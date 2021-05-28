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
    });
    describe('resovle()', function () {
        it(`resolved the leader of a group (${targetId}) via get()`, async function () {
            let group = await MFA.Group.get(targetId);
            if (!group.leader) assert.fail('Group has no leader relationship.');
            let leader = await group.leader.resolve();
            assert.strictEqual(leader instanceof MFA.User, true);
            assert.strictEqual(typeof leader.id, 'string');
        });
    });
});