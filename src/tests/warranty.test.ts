import { expect, assert } from 'chai';
import { Server } from 'http';

import * as Utils from './utils/request-async';
import { Assert } from './utils/assert';
import * as Request from 'request';

import { ServerFactory, HttpServer } from '../server-factory';
import { Warranty, WarrantyData } from '../routes/data/warranty-data';

const brand = 'Acura';
const brandBad = 'Lada';
const b2bWarranty = '4 yr/50,000 mi';

describe('Data layer tests: getWarrantyB2b', () => {

    describe('"Happy-path" tests', () => {
        it(`Returns data for a valid brand name - sequential`, () => {
            const b2b = WarrantyData.instance.getWarrantyB2b(brand);
            assert.strictEqual(b2b, b2bWarranty);
        });

        it(`Returns data for a valid brand name - callback`, (done: MochaDone) => {
            const b2b = WarrantyData.instance.getWarrantyB2bCB(brand,
                (b2b: string) => {
                    try {
                        assert.strictEqual(b2b, b2bWarranty);
                        done();
                    } catch (err) {
                        done(err);
                    }
                },
                (error) => {
                    done(error);
                }
            );
        }).timeout(3000); // Timeout is required to be at least as big as the max callback time

        it(`Returns data for a valid brand name - promise.then().catch`, (done: MochaDone) => {
            WarrantyData.instance.getWarrantyB2bAsync(brand)
                .then((b2b: string) => {
                    try {
                        assert.strictEqual(b2b, b2bWarranty);
                        done();
                    } catch (err) {
                        done(err);
                    }
                })
                .catch((error) => {
                    done(error);
                });
        }).timeout(3000); // Timeout is required to be at least as big as the max callback time

        it('Returns data for a valid brand name - async/await', async () => {
            const b2b = await WarrantyData.instance.getWarrantyB2bAsync(brand);
            assert.strictEqual(b2b, b2bWarranty);
        }).timeout(3000); // Timeout is required to be at least as big as the max callback time
    });

    describe('Negative tests', () => {
        const errorMsg = new RegExp(`^Failed to find a bumper-to-bumper warranty for the brand "${brandBad}"`);
        it('Throws on invalid model name - sequential', () => {
            assert.throws(() => WarrantyData.instance.getWarrantyB2b(brandBad), errorMsg);
        });

        it(`Throws on invalid model name - callback`, (done: MochaDone) => {
            const b2b = WarrantyData.instance.getWarrantyB2bCB(brandBad,
                (b2b: string) => {
                    done(new Error('Exception was not thrown'));
                },
                (error) => {
                    try {
                        assert.match(error.message, errorMsg, 'Error message does not match');
                        done();
                    } catch (err) {
                        done(err);
                    }
                }
            );
        }).timeout(3000);

        it(`Throws on invalid model name - promise.then().catch`, (done: MochaDone) => {
            const b2b = WarrantyData.instance.getWarrantyB2bAsync(brandBad)
                .then((b2b: string) => {
                    done(new Error('Exception was not thrown'));
                })
                .catch((error) => {
                    try {
                        assert.match(error.message, errorMsg, 'Error message does not match');
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
        }).timeout(3000);

        it('Throws on invalid model name - async/await', async () => {
            const b2b = await Assert.throws(async () => await WarrantyData.instance.getWarrantyB2bAsync(brandBad), errorMsg);
        }).timeout(3000); // Timeout is required to be at least as big as the max callback time
    });
});
