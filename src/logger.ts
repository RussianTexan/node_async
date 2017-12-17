import * as exp from 'express';
import * as Winston from 'winston';
import * as debug from 'debug';
const winston = require('winston');
const expressWinston = require('express-winston');
const LoggingWinston = require('@google-cloud/logging-winston');

import { Deployment } from './deployment';

const moduleName = 'node-async';
export class Logger {

    private static _transport: any;
    private static _logger: Winston.LoggerInstance | undefined;
    private static readonly routeLogginInfo = debug.enabled(`route-loggin:info`);
    private static readonly routeLogginError = debug.enabled(`route-loggin:error`);

    private static _staticConstructor: void = (() => {
        Logger._transport = new LoggingWinston();
        Logger._logger = new Winston.Logger({ transports: [Logger._transport], });
    })();

    private static readonly ignoreRoute = function (req: exp.Request, res: exp.Response) {
        // Do not log GAE health checks
        return req.url.match(new RegExp('^/_ah/health'));
    };

    // Logger to capture all requests and output them to
    // the StackDriver in running on the GAE or to the console if running on a local host
    static readonly requestMiddleware = Logger.routeLogginInfo ?
        (Deployment.instance.project ?
            expressWinston.logger({
                transports: [Logger._transport],
                statusLevels: true, // Use HTTP status codes for log levels: info(status<400)/warn(status<500)/error(status>=500))
                expressFormat: true,  // Use the default Express/morgan request formatting
                meta: true,  // Control whether to log the meta data about the request (default to true)
                ignoreRoute: Logger.ignoreRoute // Skip some log messages based on request and/or response
            })
            :
            expressWinston.logger({
                transports: [new winston.transports.Console({ json: false, colorize: true })],
                expressFormat: true,
                meta: false,
            }))
        :
        (req: exp.Request, res: exp.Response, next: exp.NextFunction) => { next(); };

    // Logger to capture any top-level errors and output json diagnostic info to
    // the StackDriver in running on the GAE or to the console if running on a local host
    static readonly errorMiddleware = Logger.routeLogginError ?
        (Deployment.instance.project ?
            expressWinston.errorLogger({
                transports: [Logger._transport],
            })
            :
            expressWinston.errorLogger({
                transports: [new winston.transports.Console({ json: true, colorize: true })],
            }))
        :
        (err: any, req: exp.Request, res: exp.Response, next: exp.NextFunction) => { next(err); };

    private static readonly errorDebugger = debug(`${moduleName}:error`);
    private static readonly warnDebugger = debug(`${moduleName}:warn`);
    private static readonly infoDebugger = debug(`${moduleName}:info`);
    private static readonly debugDebugger = debug(`${moduleName}:debug`);

    static error(error: any): string {
        let errMsg: string | undefined = undefined;
        if (error) {
            if (typeof error === 'string') {
                errMsg = `ERROR: ${error}\n    *** stack trace is not available ***`;
            }
            else if (error.stack) {
                errMsg = error.stack;
            }
        }
        errMsg = errMsg || `ERROR: error message and stack trace are unavailable`;

        Logger.errorDebugger(errMsg);
        Logger._logger!.error(errMsg);
        return errMsg;
    }

    static warn(error: any): string {
        let errMsg: string | undefined = undefined;
        if (error) {
            if (typeof error === 'string') {
                errMsg = error;
            }
            else {
                errMsg = error.message;
            }
        }
        errMsg = errMsg || 'no error message available';

        const msg = `WARNING: ${errMsg}`;
        Logger.warnDebugger(msg);
        Logger._logger!.warn(msg);
        return msg;
    }

    static info(message: string): string {
        if (!message) { message = 'empty info message'; }
        Logger.infoDebugger(message);
        Logger._logger!.info(message);
        return message;
    }

    static debug(message: string): string {
        if (!message) { message = 'empty debug message'; }
        Logger.debugDebugger(message);
        return message;
    }
}
