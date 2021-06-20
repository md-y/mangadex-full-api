'use strict';

const MFA = require('../src/index');
const assert = require('assert');
const { validateResultsArray } = require('./index.test');

var targetId = '0893dd04-10ee-48df-9067-66b4bb1da487'; // Default, to be overwritten by successful tests

describe('Chapter', function () {
    describe('search()', function () {
        it('performed a search', async function () {
            let results = await MFA.Chapter.search({
                limit: 1
            });
            validateResultsArray(results);
            assert.strictEqual(results.length, 1);
            targetId = results[0].id;
        });
    });
    describe('get()', function () {
        it(`retrived the test chapter via id (${targetId})`, async function () {
            let chapter = await MFA.Chapter.get(targetId);
            assert.strictEqual(chapter.id, targetId);
            assert.strictEqual(typeof chapter.title, 'string');
        });
        it(`manga is a manga object`, async function () {
            let chapter = await MFA.Chapter.get(targetId, true);
            assert.strictEqual(chapter.manga instanceof MFA.Manga, true);
        });
    });
    describe('getReadablePages()', function () {
        it(`retrieved readable pages from a chapter (${targetId}) via get()`, async function () {
            let chapter = await MFA.Chapter.get(targetId);
            let pages = await chapter.getReadablePages();
            if (pages.length === 0) assert.fail('Chapter returned 0 readable pages.');
            pages.forEach(elem => {
                assert.strictEqual(typeof elem, 'string');
                assert.match(elem, /\..{3,4}$/);
            });
        });
    });
});