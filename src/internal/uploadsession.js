'use strict';

const Util = require('../util.js');
const AuthUtil = require('../auth.js');
const APIRequestError = require('./requesterror.js');
const Relationship = require('./relationship.js');
const Chapter = require('../structure/chapter.js');

/**
 * Represents a chapter upload session
 * https://api.mangadex.org/docs.html#tag/Upload
 */
class UploadSession {
    /**
     * There is no reason to directly create an upload session object. Use static methods, ie 'open()'.
     * @param {Object} res API response 
     */
    constructor(res) {
        if (!('data' in res) || !('id' in res.data))
            throw new APIRequestError('The API did not respond with a session object when it was expected to', APIRequestError.INVALID_RESPONSE);

        /**
         * Id of this upload session
         * @type {String}
         */
        this.id = res.data.id;

        /**
         * Relationship of the target manga
         * @type {Relationship<import('../index').Manga>}
         */
        this.manga = Relationship.convertType('manga', res.data.relationships, this).pop();

        /**
         * Relationships to the groups attributed to this chapter
         * @type {Relationship<import('../index').Group>}
         */
        this.groups = Relationship.convertType('group', res.data.relationships, this);

        /**
         * Relationship to the uploader (the current user)
         * @type {Relationship<import('../index').User>}
         */
        this.uploader = Relationship.convertType('user', res.data.relationships, this).pop();

        /**
         * Is this session commited?
         * @type {Boolean}
         */
        this.isCommitted = res.data.attributes.isCommitted;

        /**
         * Is this session processed?
         * @type {Boolean}
         */
        this.isProcessed = res.data.attributes.isProcessed;


        /**
        * Is this session deleted?
        * @type {Boolean}
        */
        this.isDeleted = res.data.attributes.isDeleted;

        /**
         * Is this session open for uploading pages?
         * @type {Boolean}
         */
        this.open = !this.isDeleted && !this.isCommitted && !this.isProcessed;

        /**
         * The ids of every page uploaded THIS session
         * @type {String[]}
         */
        this.pages = [];
    }

    /**
     * Requests MD to start an upload session
     * @param {String|import('../index').Manga} manga 
     * @param  {...String|import('../index').Group|Relationship<import('../index').Group>} groups
     * @returns {UploadSession}
     */
    static async open(manga, ...groups) {
        if (typeof manga !== 'string') manga = manga.id;
        groups = groups.flat().map(elem => typeof elem === 'string' ? elem : elem.id);
        if (!manga || groups.some(elem => !elem)) throw new Error('Invalid Argument(s)');
        await AuthUtil.validateTokens();
        let res = await Util.apiRequest('/upload/begin', 'POST', {
            manga: manga,
            groups: groups
        });
        return new UploadSession(res);
    }

    /**
     * Returns the currently open upload session for the logged in user.
     * Returns null if there is no current session
     * @returns {UploadSession|null}
     */
    static async getCurrentSession() {
        await AuthUtil.validateTokens();
        let res;
        try {
            res = await Util.apiRequest('/upload');
        } catch (err) {
            if (err instanceof APIRequestError && err.message.includes('404')) return null;
            else throw err;
        }
        return new UploadSession(res);
    }

    /**
     * @ignore
     * @typedef {Object} PageFileObject
     * @property {Buffer} PageFileObject.data 
     * @property {'jpeg'|'png'|'gif'} [PageFileObject.type]
     * @property {String} PageFileObject.name
     */

    /**
     * Uploads pages through this upload session
     * @param {PageFileObject[]} pages 
     * @returns {Promise<String[]>} Returns the ids of every newly uploaded file
     */
    async uploadPages(pages) {
        if (!this.open) throw new APIRequestError('Attempted to upload to a closed upload session', APIRequestError.INVALID_REQUEST);
        let fileObjects = pages.map(obj => {
            let page = { ...obj };
            if (page.type === 'jpg') page.type = 'image/jpeg';
            else if (page.type === undefined) {
                if (page.name.endsWith('.jpg') || page.name.endsWith('.jpeg')) page.type = 'image/jpeg';
                else if (page.name.endsWith('.png')) page.type = 'image/png';
                else if (page.name.endsWith('.gif')) page.type = 'image/gif';
            } else page.type = `image/${page.type}`;
            if (!('data' in page) || !('type' in page) || !('name' in page)) throw new Error('Invalid Page Object(s).');
            return page;
        });
        await AuthUtil.validateTokens();
        let newPages = [];
        while (fileObjects.length > 0) {
            let payload = Util.createMultipartPayload(fileObjects.splice(0, 10)); // 10 images max per request
            let res = await Util.apiRequest(`/upload/${this.id}`, 'POST', payload);
            if ('data' in res) res.data.forEach(elem => newPages.push(elem.id));
            else throw new APIRequestError('The API did not respond with a session file object when it was expected to', APIRequestError.INVALID_REQUEST);
        }
        this.pages.push(...newPages);
        return newPages;
    }

    /**
     * Closes this upload session
     * @returns {Promise<void>}
     */
    async close() {
        await AuthUtil.validateTokens();
        await Util.apiRequest(`/upload/${this.id}`, 'DELETE');
    }

    /**
     * @ignore
     * @typedef {Object} ChapterDraftObject
     * @property {String} ChapterDraftObject.volume
     * @property {String} ChapterDraftObject.chapter
     * @property {String} ChapterDraftObject.title
     * @property {String} ChapterDraftObject.translatedLanguage
     */

    /**
     * @param {ChapterDraftObject} chapterDraft
     * @param {String[]} pageOrder Array of file ids sorted by their proper order. Default is the upload order
     * @returns {Promise<Chapter>} Returns the new chapter
     */
    async commit(chapterDraft, pageOrder = this.pages) {
        await AuthUtil.validateTokens();
        return new Chapter(await Util.apiRequest(`/upload/${this.id}/commit`, 'POST', {
            chapterDraft: chapterDraft,
            pageOrder: pageOrder
        }));
    }

    /**
     * Deletes an uploaded page via its upload file id.
     * @param {String} page
     * @returns {Promise<void>}
     */
    async deletePage(page) {
        await AuthUtil.validateTokens();
        await Util.apiRequest(`/upload/${this.id}/${page}`, 'DELETE');
        this.pages = this.pages.filter(elem => elem !== page);
    }
}

exports = module.exports = UploadSession;