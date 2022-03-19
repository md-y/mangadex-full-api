'use strict';

const MFA = require('../src/index');
const assert = require('assert');

require('dotenv').config();

const credentials = {
    username: process.env.MFA_TEST_USER,
    password: process.env.MFA_TEST_PASSWORD
};

describe('Authentication', async function () {
    this.retries(2);

    before(async function () {
        if (process.env.MFA_SKIP_AUTH_TEST === 'true') this.skip();
        assert.equal(typeof credentials.username, 'string', 'Username Environment Variable');
        assert.equal(typeof credentials.password, 'string', 'Password Environment Variable');
        await MFA.login(credentials.username, credentials.password, './test/.md_tokens');
    });
    
    describe('getLoggedInUser()', function () {
        it('retrieved English chapters from the followed manga feed', async function () {
            let user = await MFA.User.getLoggedInUser();
            assert.strictEqual(user instanceof MFA.User, true);
            assert.strictEqual(typeof user.id, 'string');
        });
    });
    describe('getFollowedManga()', function () {
        it('retrieved array of followed manga', async function () {
            let manga = await MFA.Manga.getFollowedManga(1);
            assert.strictEqual(manga instanceof Array, true);
            assert.strictEqual(manga.length <= 1, true); // Some test users may have no followed manga
            if (manga.length > 0) assert.strictEqual(manga[0] instanceof MFA.Manga, true);
        });
    });
    describe('getFollowedFeed()', function () {
        it('retrieved English chapters from the followed manga feed', async function () {
            let manga = await MFA.Manga.getFollowedFeed({
                limit: 1,
                translatedLanguage: ['en']
            });
            assert.strictEqual(manga instanceof Array, true);
            assert.strictEqual(manga.length <= 1, true); // Some test users may have no followed manga
            if (manga.length > 0) assert.strictEqual(manga[0] instanceof MFA.Chapter, true);
        });
    });
    describe('getReadChapters()', function () {
        let targetId = 'f9c33607-9180-4ba6-b85c-e4b5faee7192';
        it(`got the read chapters of a manga (${targetId})`, async function () {
            let readChapters = await MFA.Manga.getReadChapters(targetId);
            assert.strictEqual(Array.isArray(readChapters), true);
            readChapters.forEach(chapter => {
                assert.strictEqual(chapter instanceof MFA.Chapter, true);
                assert.strictEqual(typeof chapter.id, 'string');
            });
            
        });
    });
});