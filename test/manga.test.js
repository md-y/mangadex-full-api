'use strict';

const MFA = require('../src/index');
const assert = require('assert');
const { validateResultsArray } = require('./index.test');

var targetId = 'f9c33607-9180-4ba6-b85c-e4b5faee7192'; // Default, to be overwritten by successful tests

describe('Manga', function () {
    describe('getRandom()', function () {
        it('retrived a random manga', async function () {
            let manga = await MFA.Manga.getRandom();
            assert.strictEqual(typeof manga.id, 'string');
            assert.strictEqual(typeof manga.title, 'string');
            targetId = manga.id;
        });
        it('compared the output of getRandom() and get()', async function () {
            let manga1 = await MFA.Manga.getRandom();
            let manga2 = await MFA.Manga.get(manga1.id);
            assert.deepStrictEqual(manga1, manga2);
        });
    });
    describe('get()', function () {
        it(`retrived a manga via id (${targetId})`, async function () {
            let manga = await MFA.Manga.get(targetId);
            assert.strictEqual(typeof manga.id, 'string');
            assert.strictEqual(typeof manga.title, 'string');
        });
    });
    describe('resovle()', function () {
        it(`resolved an author of a manga (${targetId}) via get()`, async function () {
            let manga = await MFA.Manga.get(targetId);
            if (manga.authors.length === 0) assert.fail('Manga has no authors.');
            let author = await manga.authors[0].resolve();
            assert.strictEqual(author instanceof MFA.Author, true);
            assert.strictEqual(typeof author.id, 'string');
        });
        it(`resolved an artist of a manga (${targetId}) via get()`, async function () {
            let manga = await MFA.Manga.get(targetId);
            if (manga.artists.length === 0) assert.fail('Manga has no artists.');
            let artist = await manga.artists[0].resolve();
            assert.strictEqual(artist instanceof MFA.Author, true);
            assert.strictEqual(typeof artist.id, 'string');
        });
        it(`resolved a cover of a manga (${targetId}) via get()`, async function () {
            let manga = await MFA.Manga.get(targetId);
            if (!manga.mainCover) assert.fail('Manga has no main cover relationship.');
            let cover = await manga.mainCover.resolve();
            assert.strictEqual(cover instanceof MFA.Cover, true);
            assert.strictEqual(typeof cover.id, 'string');
        });
    });
    describe('search()', function () {
        it('performed a search with a finite limit', async function () {
            let results = await MFA.Manga.search({
                limit: 1
            });
            validateResultsArray(results);
            assert.strictEqual(results.length, 1);
            targetId = results[0].id;
        });
        it('performed a search with array parameters', async function () {
            let results = await MFA.Manga.search({
                limit: 1,
                status: ['cancelled', 'hiatus'],
                contentRating: ['safe'],
                publicationDemographic: ['josei', 'shoujo']
            });
            validateResultsArray(results);
        });
        it('performed a search with an infinite limit and title parameter (takes a while)', async function () {
            this.timeout(15000);
            let results = await MFA.Manga.search({
                limit: Infinity,
                title: 'isekai'
            });
            validateResultsArray(results);
        });
    });
    describe('getFeed()', function () {
        it(`retrieved the feed of a manga (${targetId})`, async function () {
            let feed = await MFA.Manga.getFeed(targetId);
            if (feed.length === 0) assert.fail('Feed returned no chapters');
            feed.forEach(elem => {
                assert.strictEqual(elem instanceof MFA.Chapter, true);
                assert.strictEqual(typeof elem.id, 'string');
            });
        });
    });
    describe('getMangaCovers()', function () {
        it(`retrieved the covers of a manga (${targetId})`, async function () {
            let covers = await MFA.Manga.getCovers(targetId);
            if (covers.length === 0) assert.fail('Manga returned no covers');
            covers.forEach(elem => {
                assert.strictEqual(elem instanceof MFA.Cover, true);
                assert.strictEqual(typeof elem.id, 'string');
                assert.strictEqual(elem.imageSource.includes('uploads.mangadex.org'), true);
                assert.strictEqual(elem.image512.includes('.512.jpg'), true);
            });
        });
    });
    describe('getTag()', function () {
        it('retrieved tag information', async function () {
            let tag = await MFA.Manga.getTag('oneshot');
            assert.strictEqual(typeof tag.id, 'string');
            assert.strictEqual(tag.localizedName['en'].toLowerCase(), 'oneshot');
        });
    });
});