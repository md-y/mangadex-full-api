'use strict';

const MFA = require('../src/index');
const assert = require('assert');
const APIRequestError = require('../src/internal/requesterror');

var targetId = '583748b5-f99e-4f38-a560-5aea4dfb9248'; // Public test list

describe('List', function () {
    describe('get()', function () {
        it(`checked authorization while retrieving list (${targetId})`, async function () {
            let list;
            try {
                list = await MFA.List.get(targetId);
            } catch (error) {
                if (error instanceof APIRequestError && error.code === APIRequestError.AUTHORIZATION || error.message.includes('404')) assert.ok(error);
                else assert.fail('The wrong error was given for an authorization error / missing list.');
                return;
            }
            assert.strictEqual(list instanceof MFA.List, true);
        });
    });
});