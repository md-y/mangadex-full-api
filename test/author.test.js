'use strict';

const MFA = require('../src/index');
const assert = require('assert');
const { validateResultsArray } = require('./index.test');

var targetId = '2c45da87-bbde-488d-acb6-d1ef51742ec1'; // Default, to be overwritten by successful tests

describe('Author', function () {
    this.retries(2);

    describe('search()', function () {
        it('performed a search', async function () {
            let results = await MFA.Author.search({
                limit: 1
            });
            validateResultsArray(results);
            assert.strictEqual(results.length, 1);
            targetId = results[0].id;
        });
    });
    describe('get()', function () {
        it(`retrived the test author via id (${targetId})`, async function () {
            let author = await MFA.Author.get(targetId);
            assert.strictEqual(author.id, targetId);
            assert.strictEqual(typeof author.name, 'string');
        });
    });
});