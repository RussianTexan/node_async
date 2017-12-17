import { assert } from 'chai';

export class Assert {
    static async throws(asyncFunction: () => any, regExp?: RegExp): Promise<void> {
        try {
            const something = await asyncFunction();
            assert.fail('An exception was expected');
        } catch (error) {
            assert.isFalse(error.message === 'assert.fail()', 'No exception was thrown');
            if (regExp != null) {
                assert.match(error.message, regExp, 'Error message does not match');
            }
        }
    }
}
