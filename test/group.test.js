'use strict';

const MFA = require('../src/index');
const assert = require('assert');
const { validateResultsArray } = require('./index.test');

var targetId = '7a26a805-fe66-4e25-8ee3-4d11f7384388'; // Default, to be overwritten by successful tests

describe('Group', function () {
    describe('search()', function () {
        it('performed a search', async function () {
            let results = await MFA.Group.search({
                limit: 1
            });
            validateResultsArray(results);
            assert.strictEqual(results.length, 1);
            targetId = results[0].id;
        });
    });
    describe('get()', function () {
        it(`retrived the test group via id (${targetId})`, async function () {
            let group = await MFA.Group.get(targetId);
            assert.strictEqual(group.id, targetId);
            assert.strictEqual(typeof group.name, 'string');
        });
        it(`the leader is a user object and not undefined`, async function () {
            let group = await MFA.Group.get(targetId, true);
            assert.strictEqual(group.leader instanceof MFA.User, true);
            assert.strictEqual(group.leader.username !== undefined, true);
        });
        it(`each member is a user object and not undefined`, async function () {
            let group = await MFA.Group.get(targetId, true);
            assert.strictEqual(group.members instanceof Array, true);
            group.members.forEach(elem => {
                assert.strictEqual(elem instanceof MFA.User, true);
                assert.strictEqual(elem.username !== undefined, true);
            });
        });
    });
});