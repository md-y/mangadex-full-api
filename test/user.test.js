'use strict';

const MFA = require('../src/index');
const assert = require('assert');

var targetId = '18bc704d-26c8-452c-9591-fa9afc7e4d10';

describe('User', function () {
    this.retries(2);

    describe('get()', function () {
        it(`retrived the test user via id (${targetId})`, async function () {
            let user = await MFA.User.get(targetId);
            assert.strictEqual(user.id, targetId);
            assert.strictEqual(typeof user.username, 'string');
        });
    });
});