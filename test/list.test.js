'use strict';

const MFA = require('../src/index');
const assert = require('assert');
const APIRequestError = require('../src/internal/requesterror');

var targetId = 'db824031-12be-4fa8-a84d-5deedda19105'; // Public test list

describe('List', function () {
    describe('get()', function () {
        it(`checked authorization while retrieving list (${targetId})`, async function () {
            try {
                let list = await MFA.List.get(targetId);
                assert.ok(list);
            } catch (error) {
                if (error instanceof APIRequestError && error.code === APIRequestError.AUTHORIZATION) assert.ok(error);
                else assert.fail('The wrong error was given for an authorization error.');
            }
        });
    });
});