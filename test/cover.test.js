'use strict';

const MFA = require('../src/index');
const assert = require('assert');
const { validateResultsArray } = require('./index.test');

var targetId = 'cbbe77e4-3c00-4fc5-acdf-cebb0bc34d54'; // Default, to be overwritten by successful tests

describe('Cover', function () {
    this.retries(2);

    describe('search()', function () {
        it('performed a search', async function () {
            let results = await MFA.Cover.search({
                limit: 1
            });
            validateResultsArray(results);
            assert.strictEqual(results.length, 1);
            targetId = results[0].id;
        });
    });
    describe('get()', function () {
        it(`retrived the test cover via id (${targetId})`, async function () {
            let cover = await MFA.Cover.get(targetId);
            assert.strictEqual(cover.id, targetId);
            assert.strictEqual(cover.imageSource.includes('uploads.mangadex.org'), true);
            assert.strictEqual(cover.image512.includes('.512.jpg'), true);
        });
    });
});