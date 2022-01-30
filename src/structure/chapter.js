'use strict';

const Util = require('../util.js');
const AuthUtil = require('../auth.js');
const Relationship = require('../internal/relationship.js');
const APIRequestError = require('../internal/requesterror.js');

/**
 * Represents a chapter with readable pages
 * https://api.mangadex.org/docs.html#tag/Chapter
 */
class Chapter {
    /**
     * There is no reason to directly create a chapter object. Use static methods, ie 'get()'.
     * @param {Object|String} context Either an API response or Mangadex id 
     */
    constructor(context) {
        if (typeof context === 'string') {
            this.id = context;
            return;
        } else if (!context) return;

        if (!context.data) context.data = {};

        /**
         * Mangadex id for this object
         * @type {String}
         */
        this.id = context.data.id;


        if (context.data.attributes === undefined) context.data.attributes = {};

        /**
         * This chapter's volume number/string
         * @type {String}
         */
        this.volume = context.data.attributes.volume;

        /**
         * This chapter's number/string identifier
         * @type {String}
         */
        this.chapter = context.data.attributes.chapter;

        /**
         * Title of this chapter
         * @type {String}
         */
        this.title = context.data.attributes.title;

        /**
         * Translated language code (2 Letters)
         * @type {String}
         */
        this.translatedLanguage = context.data.attributes.translatedLanguage;

        /**
         * The date of this chapter's creation
         * @type {Date}
         */
        this.createdAt = context.data.attributes.createdAt ? new Date(context.data.attributes.createdAt) : null;

        /**
         * The date this chapter was last updated
         * @type {Date}
         */
        this.updatedAt = context.data.attributes.updatedAt ? new Date(context.data.attributes.updatedAt) : null;

        /**
         * The date this chapter was published
         * @type {Date}
         */
        this.publishAt = context.data.attributes.publishAt ? new Date(context.data.attributes.publishAt) : null;

        /**
         * The date this chapter was/will be readable
         * @type {Date}
         */
        this.readableAt = context.data.attributes.readableAt ? new Date(context.data.attributes.readableAt) : null;

        /**
         * Page count
         * @type {Number}
         */
        this.pages = context.data.attributes.pages;

        /**
         * Is this chapter only a link to another website (eg Mangaplus) instead of being hosted on MD?
         * @type {Boolean}
         */
        this.isExternal = 'externalUrl' in context.data.attributes && context.data.attributes.externalUrl !== null;

        /**
         * The external URL to this chapter if it is not hosted on MD. Null if it is hosted on MD
         * @type {String}
         */
        this.externalUrl = this.isExternal ? context.data.attributes.externalUrl : null;

        /**
         * The scanlation groups that are attributed to this chapter
         * @type {Array<Relationship<import('../index').Group>>}
         */
        this.groups = Relationship.convertType('scanlation_group', context.data.relationships, this);

        /**
         * The manga this chapter belongs to
         * @type {Relationship<import('../index').Manga>}
         */
        this.manga = Relationship.convertType('manga', context.data.relationships, this).pop();

        /**
         * The user who uploaded this chapter
         * @type {Relationship<import('../index').User>}
         */
        this.uploader = Relationship.convertType('user', context.data.relationships, this).pop();
    }

    /**
     * @ignore
     * @typedef {Object} ChapterParameterObject
     * @property {String} [ChapterParameterObject.title]
     * @property {String} [ChapterParameterObject.createdAtSince] DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {String} [ChapterParameterObject.updatedAtSince] DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {String} [ChapterParameterObject.publishAtSince] DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {Object} [ChapterParameterObject.order]
     * @property {'asc'|'desc'} [ChapterParameterObject.order.createdAt]
     * @property {'asc'|'desc'} [ChapterParameterObject.order.updatedAt]
     * @property {'asc'|'desc'} [ChapterParameterObject.order.publishAt]
     * @property {'asc'|'desc'} [ChapterParameterObject.order.volume]
     * @property {'asc'|'desc'} [ChapterParameterObject.order.chapter]
     * @property {String[]} [ChapterParameterObject.translatedLanguage]
     * @property {String[]} [ChapterParameterObject.originalLanguage]
     * @property {String[]} [ChapterParameterObject.excludedOriginalLanguage]
     * @property {Array<'safe'|'suggestive'|'erotica'|'pornographic'>} [ChapterParameterObject.contentRating]
     * @property {String[]} [ChapterParameterObject.ids] Max of 100 per request
     * @property {Number} [ChapterParameterObject.limit] Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
     * @property {Number} [ChapterParameterObject.offset]
     * @property {String[]|import('../index').Group[]} [ChapterParameterObject.groups]
     * @property {String|import('../index').User|Relationship<import('../index').User>} [ChapterParameterObject.uploader]
     * @property {String|import('../index').Manga|Relationship<import('../index').Manga>} [ChapterParameterObject.manga]
     * @property {String[]} [ChapterParameterObject.volume]
     * @property {String} [ChapterParameterObject.chapter]
     */

    /**
     * Peforms a search and returns an array of chapters.
     * https://api.mangadex.org/docs.html#operation/get-chapter
     * @param {ChapterParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the title
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<Chapter[]>}
     */
    static search(searchParameters = {}, includeSubObjects = false) {
        if (typeof searchParameters === 'string') searchParameters = { title: searchParameters, groups };
        if (includeSubObjects) searchParameters.includes = ['scanlation_group', 'manga', 'user'];
        return Util.apiCastedRequest('/chapter', Chapter, searchParameters);
    }

    /**
     * Gets multiple chapters
     * @param {...String|Chapter|Relationship<Chapter>} ids
     * @returns {Promise<Chapter[]>}
     */
    static getMultiple(...ids) {
        return Util.getMultipleIds(Chapter.search, ids);
    }


    /**
     * Retrieves and returns a chapter by its id
     * @param {String} id Mangadex id
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<Chapter>}
     */
    static async get(id, includeSubObjects = false) {
        return new Chapter(await Util.apiRequest(`/chapter/${id}${includeSubObjects ? '?includes[]=scanlation_group&includes[]=manga&includes[]=user' : ''}`));
    }

    /**
     * Performs a search for one chapter and returns that chapter
     * @param {ChapterParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the title
     * @returns {Promise<Chapter>}
     */
    static async getByQuery(searchParameters = {}) {
        if (typeof searchParameters === 'string') searchParameters = { title: searchParameters, limit: 1 };
        else searchParameters.limit = 1;
        let res = await Chapter.search(searchParameters);
        if (res.length === 0) throw new Error('Search returned no results.');
        return res[0];
    }

    /**
     * Marks a chapter as either read or unread
     * @param {String} id
     * @param {Boolean} [read=true] True to mark as read, false to mark unread
     * @returns {Promise<void>}
     */
    static async changeReadMarker(id, read = true) {
        await AuthUtil.validateTokens();
        await Util.apiRequest(`/chapter/${id}/read`, read ? 'POST' : 'DELETE');
    }

    /**
     * Retrieves URLs for actual images from Mangadex @ Home.
     * This only gives URLs, so it does not report the status of the server to Mangadex @ Home.
     * Therefore applications that download image data pleaese report failures as stated here:
     * https://api.mangadex.org/docs.html#section/Reading-a-chapter-using-the-API/Report
     * @param {Boolean} [saver=false] Use data saver images?
     * @param {Boolean} [forcePort=false] Force the final URLs to use port 443
     * @returns {Promise<String[]>}
     */
    async getReadablePages(saver = false, forcePort = false) {
        if (this.isExternal) throw new Error('Cannot get readable pages for an external chapter.');
        let res = await Util.apiParameterRequest(`/at-home/server/${this.id}`, { forcePort443: forcePort });
        if (!res.baseUrl || !res.chapter.hash || !res.chapter.hash) {
            throw new APIRequestError(`The API did not respond the correct structure for a MD@H chapter request:\n${JSON.stringify(res)}`, APIRequestError.INVALID_RESPONSE);
        }
        return res.chapter[saver ? 'dataSaver' : 'data'].map(file => `${res.baseUrl}/${saver ? 'data-saver' : 'data'}/${res.chapter.hash}/${file}`);
    }

    /**
     * Marks this chapter as either read or unread
     * @param {Boolean} [read=true] True to mark as read, false to mark unread
     * @returns {Promise<Chapter>}
     */
    async changeReadMarker(read = true) {
        await Chapter.changeReadMarker(this.id, read);
        return this;
    }
}

exports = module.exports = Chapter;