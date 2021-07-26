'use strict';

const MFA = require('../src/index');
const assert = require('assert');
const { validateResultsArray } = require('./index.test');

var targetId = 'caf0d1da-a790-49d0-833c-ce74d651c8a1'; // Default, to be overwritten by successful tests

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
        it(`every member relationship is cached`, async function () {
            let group = await MFA.Group.get(targetId, true);
            assert.strictEqual(group.members instanceof Array, true);
            group.members.forEach(elem => {
                assert.strictEqual(elem.cached, true);
            });
        });
    });
});