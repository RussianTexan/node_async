#!/usr/bin/env node

import * as  http from 'http';
import * as debug from 'debug';
import * as ip from 'ip';

import { ServerFactory } from './server-factory';

// Get port from environment and store in Express.
const port = ServerFactory.normalizePort(process.env.PORT || '3000');
const httpServer = ServerFactory.createAndListen(port);
