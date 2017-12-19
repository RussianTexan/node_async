import * as exp from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as morgan from 'morgan';  // Logger
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as gtrace from '@google-cloud/trace-agent';
import * as gdebug from '@google-cloud/debug-agent';

import { index } from './routes/index';
import { warranty } from './routes/warranty';
import { warrantyCb } from './routes/warranty-cb';
import { warrantyThen } from './routes/warranty-then';
import { warrantyThenCatch } from './routes/warranty-then-catch';
import { warrantyAsync } from './routes/warranty-async';

import { Logger } from './logger';

// Activate Google Cloud Trace and Debug when in production
if (process.env.NODE_ENV === 'production') {
    // gtrace.start();
    // gdebug.start();
}

const app = exp();

// view engine setup
app.set('../views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, '../public', 'icon16.png')));

// Add the request logger before anything else so that it can accurately log requests.
app.use(Logger.requestMiddleware);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(exp.static(path.join(__dirname, '../public')));

// setup routes
app.use('/', index);
app.use('/warranty', warranty);
app.use('/warranty-cb', warrantyCb);
app.use('/warranty-then', warrantyThen);
app.use('/warranty-then-catch', warrantyThenCatch);
app.use('/warranty-async', warrantyAsync);

// Responde to GAE healthcheck
app.get('/_ah/health', (req: exp.Request, res: exp.Response) => {
    res.send('I am healthy');
});

// catch 404 and forward to error handler
app.use(function (req: exp.Request, res: exp.Response, next: exp.NextFunction) {
    const err: any = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Add the error logger after all middleware and routes so that it can log errors from the whole application.
// Any custom error handlers should go after this.
app.use(Logger.errorMiddleware);

// error handler
app.use(function (err: any, req: exp.Request, res: exp.Response, next: exp.NextFunction) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export const theApp: exp.Express = app;
