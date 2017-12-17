import { expect, assert } from 'chai';
import { Server } from 'http';

import * as Utils from './utils/request-async';
import { Assert } from './utils/assert';
import * as Request from 'request';

import { ServerFactory, HttpServer } from '../server-factory';
import { Warranty, WarrantyData } from '../routes/data/warranty-data';

const route = '/warranty-async';
describe(`Server tests for the route ${route}`, () => {

    let httpServer: HttpServer;
    const brand = 'Acura';
    const brandBad = 'Lada';
    let reqOptions: Request.Options;
    let reqOptionsBad: Request.Options;


    before(() => {
        const port = 3000;
        httpServer = ServerFactory.createAndListen(port);
        reqOptions = { url: `http://localhost:${port}${route}/${brand}`, method: 'GET' };
        reqOptionsBad = { url: `http://localhost:${port}${route}/${brandBad}`, method: 'GET' };
    });

    after(() => {
        httpServer.server.close();
    });

    it(`test using a callback`, (done: MochaDone) => {
        Request(reqOptions, (error: any, res: Request.RequestResponse, body: any) => {
            if (error) {
                done(error);
            } else {
                try {
                    assert.strictEqual(res.statusCode, 200);
                    assert.match(res.body, new RegExp(`Warranty information for ${brand}`));
                    done();
                }
                catch (err) {
                    done(err);
                }
            }
        });
    }).timeout(6000); // Timeout is required to be at least as big as the max call time

    it(`test using async/await`, async () => {
        const res = await Utils.requestAsync(reqOptions);
        assert.strictEqual(res.statusCode, 200);
        assert.match(res.body, new RegExp(`Warranty information for ${brand}`));
    }).timeout(6000); // Timeout is required to be at least as big as the max call time


    it(`Negative test - request failed`, async () => {
        const res = await Utils.requestAsync(reqOptionsBad);
        assert.strictEqual(res.statusCode, 500);
        assert.match(res.body, new RegExp(`Failed to find a bumper-to-bumper warranty for the brand &quot;${brandBad}&quot;`));
    }).timeout(6000); // Timeout is required to be at least as big as the max call time
});
