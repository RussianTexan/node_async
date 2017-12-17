#!/usr/bin/env node

import * as  http from 'http';
import * as debug from 'debug';
import * as ip from 'ip';

import { theApp } from './app';

const debuger = debug('node-async:server');

export class ServerFactory {

    static createAndListen(port: number): HttpServer {

        theApp.set('port', port);
        // Create HTTP server.
        const srv = new HttpServer();
        srv.server = http.createServer(theApp);
        srv.port = port;

        //  Listen on provided port, on all network interfaces.
        srv.server.on('error', srv.onError.bind(srv));
        srv.server.on('listening', srv.onListening.bind(srv));
        srv.server.on('close', srv.onClose.bind(srv));

        srv.server.listen(srv.port);

        return srv;
    }

    /**
     * Normalize a port into a number, string, or false.
     */

    static normalizePort(val: string) {
        const portNumber = parseInt(val, 10);

        if (isNaN(portNumber)) {
            // named pipe
            throw new Error('Named pipe is not supported');
        }

        if (portNumber >= 0) {
            // port number
            return portNumber;
        }

        throw new Error('The port number parsing failure');
    }
}

export class HttpServer {

    server: http.Server;
    port: number;

    /**
     * Event listener for HTTP server "error" event.
     */

    onError(error: any) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(`Port ${this.port} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`Port ${this.port} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    onListening() {
        if (ip.isLoopback) {
            console.log(`Server listening on http://localhost:${this.port}`);
        }
        console.log(`Server listening on http://${ip.address('public')}:${this.port}`);
    }

    onClose() {
        console.log(`Server closed`);
    }
}
