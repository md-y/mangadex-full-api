'use strict';

const Util = require('../util.js');
const Links = require('../internal/links.js');
const LocalizedString = require('../internal/localizedstring.js');
const Relationship = require('../internal/relationship.js');
const Tag = require('../internal/tag.js');
const Chapter = require('./chapter.js');
const Cover = require('./cover.js');
const List = require('./list.js');
const APIRequestError = require('../internal/requesterror.js');

/**
 * Represents a manga object
 * https://api.mangadex.org/docs.html#tag/Manga
 */
class Manga {
    /**
     * There is no reason to directly create a manga object. Use static methods, ie 'get()'.
     * @param {Object|String} context Either an API response or Mangadex id 
     */
    constructor(context) {
        if (typeof context === 'string') {
            this.id = context;
            return;
        } else if (!context) return;

        if (context.data === undefined) context.data = {};

        /**
         * Mangadex id for this object
         * @type {String}
         */
        this.id = context.data.id;


        if (context.data.attributes === undefined) context.data.attributes = {};
        /**
         * Main title with different localization options
         * @type {LocalizedString}
         */
        this.localizedTitle = new LocalizedString(context.data.attributes.title);

        /**
         * Alt titles with different localization options
         * @type {LocalizedString[]}
         */
        this.localizedAltTitles = (context.data.attributes.altTitles || []).map(i => new LocalizedString(i));

        /**
         * Description with different localization options
         * @type {LocalizedString}
         */
        this.localizedDescription = new LocalizedString(context.data.attributes.description);

        /**
         * Is this Manga locked?
         * @type {Boolean}
         */
        this.isLocked = context.data.attributes.isLocked;

        /**
         * Link object representing links to other websites about this manga
         * https://api.mangadex.org/docs.html#section/Static-data/Manga-links-data
         * @type {Links}
         */
        this.links = new Links(context.data.attributes.links);

        /**
         * 2-letter code for the original language of this manga
         * @type {String}
         */
        this.originalLanguage = context.data.attributes.originalLanguage;

        /**
         * Number this manga's last volume
         * @type {Number}
         */
        this.lastVolume = context.data.attributes.lastVolume !== null && !isNaN(context.data.attributes.lastVolume) ? parseFloat(context.data.attributes.lastVolume) : null;

        /**
         * Name of this manga's last chapter
         * @type {String}
         */
        this.lastChapter = context.data.attributes.lastChapter;

        /**
         * Publication demographic of this manga
         * https://api.mangadex.org/docs.html#section/Static-data/Manga-publication-demographic
         * @type {'shounen'|'shoujo'|'josei'|'seinen'}
         */
        this.publicationDemographic = context.data.attributes.publicationDemographic;

        /**
         * Publication/Scanlation status of this manga
         * @type {'ongoing'|'completed'|'hiatus'|'cancelled'}
         */
        this.status = context.data.attributes.status;

        /**
         * Year of this manga's publication
         * @type {Number}
         */
        this.year = context.data.attributes.year !== null && !isNaN(context.data.attributes.year) ? parseFloat(context.data.attributes.year) : null;

        /**
         * The content rating of this manga
         * @type {'safe'|'suggestive'|'erotica'|'pornographic'}
         */
        this.contentRating = context.data.attributes.contentRating;

        /**
         * The date of this manga's page creation
         * @type {Date}
         */
        this.createdAt = context.data.attributes.createdAt ? new Date(context.data.attributes.createdAt) : null;

        /**
         * The date the manga was last updated
         * @type {Date}
         */
        this.updatedAt = context.data.attributes.updatedAt ? new Date(context.data.attributes.updatedAt) : null;

        /**
         * Relationships to authors attributed to this manga
         * @type {Relationship[]}
         */
        this.authors = Relationship.convertType('author', context.relationships);

        /**
         * Relationships to artists attributed to this manga
         * @type {Relationship[]}
         */
        this.artists = Relationship.convertType('artist', context.relationships);

        /**
         * Relationships to this manga's main cover. Use 'getCovers' to retrive other covers
         * @type {Relationship}
         */
        this.mainCover = Relationship.convertType('cover_art', context.relationships).pop();
        if (!this.mainCover) this.mainCover = null;

        /**
         * Array of tags for this manga
         * @type {Tag[]}
         */
        this.tags = (context.data.attributes.tags || []).map(elem => new Tag(elem));
    }

    /**
     * Main title string based on global locale
     * @type {String}
     */
    get title() {
        if (this.localizedTitle !== undefined) return this.localizedTitle.localString;
        return undefined;
    }

    /**
     * Alt titles array based on global locale
     * @type {String[]}
     */
    get altTitles() {
        if (this.localizedAltTitles !== undefined) return this.localizedAltTitles.map(e => e.localString);
        return undefined;
    }

    /**
     * Description string based on global locale
     * @type {String}
     */
    get description() {
        if (this.localizedDescription !== undefined) return this.localizedDescription.localString;
        return undefined;
    }

    /**
     * @private
     * @typedef {Object} MangaParameterObject
     * @property {String} MangaParameterObject.title
     * @property {Number} MangaParameterObject.year
     * @property {'AND'|'OR'} MangaParameterObject.includedTagsMode
     * @property {'AND'|'OR'} MangaParameterObject.excludedTagsMode
     * @property {String} MangaParameterObject.createdAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {String} MangaParameterObject.updatedAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {Object} MangaParameterObject.order
     * @property {String[]|Author[]} MangaParameterObject.authors Array of author ids
     * @property {String[]|Author[]} MangaParameterObject.artists Array of artist ids
     * @property {String[]|Tag[]} MangaParameterObject.includedTags
     * @property {String[]|Tag[]} MangaParameterObject.excludedTags
     * @property {Array<'ongoing'|'completed'|'hiatus'|'cancelled'>} MangaParameterObject.status
     * @property {String[]} MangaParameterObject.originalLanguage
     * @property {Array<'shounen'|'shoujo'|'josei'|'seinen'|'none'>} MangaParameterObject.publicationDemographic
     * @property {String[]} MangaParameterObject.ids Max of 100 per request
     * @property {Array<'safe'|'suggestive'|'erotica'|'pornographic'>} MangaParameterObject.contentRating
     * @property {Number} MangaParameterObject.limit Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
     * @property {Number} MangaParameterObject.offset
     */

    /**
     * Peforms a search and returns an array of manga.
     * https://api.mangadex.org/docs.html#operation/get-search-manga
     * @param {MangaParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the title
     * @returns {Promise<Manga[]>}
     */
    static search(searchParameters = {}) {
        if (typeof searchParameters === 'string') searchParameters = { title: searchParameters };
        return Util.apiCastedRequest('/manga', Manga, searchParameters);
    }

    /**
     * Retrieves and returns a manga by its id
     * @param {String} id Mangadex id
     * @returns {Promise<Manga>}
     */
    static async get(id) {
        return new Manga(await Util.apiRequest(`/manga/${id}`));
    }

    /**
     * @private
     * @typedef {Object} FeedParameterObject
     * @property {Number} FeedParameterObject.limit Not limited by API limits (more than 500). Use Infinity for maximum results (use at your own risk)
     * @property {Number} FeedParameterObject.offset
     * @property {String[]} FeedParameterObject.translatedLanguage
     * @property {String} FeedParameterObject.createdAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {String} FeedParameterObject.updatedAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {String} FeedParameterObject.publishAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {Object} FeedParameterObject.order
     */

    /**
     * Returns a feed of the most recent chapters of this manga
     * @param {String} id
     * @param {FeedParameterObject|Number} [parameterObject] Either a parameter object or a number representing the limit
     * @returns {Promise<Chapter[]>}
     */
    static getFeed(id, parameterObject = {}) {
        let m = new Manga(id);
        return m.getFeed(parameterObject);
    }

    /**
     * Returns one random manga
     * @returns {Promise<Manga>}
     */
    static async getRandom() {
        return new Manga(await Util.apiRequest('/manga/random'));
    }

    /**
     * Returns all manga followed by the logged in user
     * @param {Number} [limit=100] Amount of manga to return (0 to Infinity)
     * @param {Number} [offset=0] How many manga to skip before returning
     * @returns {Promise<Manga[]>}
     */
    static async getFollowedManga(limit = 100, offset = 0) {
        await Util.AuthUtil.validateTokens();
        return await Util.apiCastedRequest('/user/follows/manga', Manga, { limit: limit, offset: offset });
    }

    /**
     * Retrieves a tag object based on its id or name ('Oneshot', 'Thriller,' etc).
     * The result of every available tag is cached, so subsequent tag requests will have no delay
     * https://api.mangadex.org/docs.html#operation/get-manga-tag
     * @param {String} indentity
     * @returns {Promise<Tag>}
     */
    static getTag(indentity) {
        return Tag.getTag(indentity);
    }

    /**
     * Returns an array of every tag available on Mangadex right now.
     * The result is cached, so subsequent tag requests will have no delay
     * https://api.mangadex.org/docs.html#operation/get-manga-tag
     * @returns {Promise<Tag[]>}
     */
    static getAllTags() {
        return Tag.getAllTags();
    }

    /**
     * Retrieves the logged in user's reading status for a manga.
     * If there is no status, null is returned
     * @param {String} id
     * @returns {Promise<'reading'|'on_hold'|'plan_to_read'|'dropped'|'re_reading'|'completed'>}
     */
    static getReadingStatus(id) {
        let m = new Manga(id);
        return m.getReadingStatus();
    }

    /**
     * Sets the logged in user's reading status for this manga. 
     * Call without arguments to clear the reading status
     * @param {String} id
     * @param {'reading'|'on_hold'|'plan_to_read'|'dropped'|'re_reading'|'completed'} [status]
     * @returns {Promise<void>}
     */
    static setReadingStatus(id, status = null) {
        let m = new Manga(id);
        return m.setReadingStatus(status);
    }

    /**
     * Gets the combined feed of every manga followed by the logged in user
     * @param {FeedParameterObject|Number} [parameterObject] Either a parameter object or a number representing the limit
     * @returns {Promise<Chapter[]>}
     */
    static async getFollowedFeed(parameterObject) {
        if (typeof parameterObject === 'number') parameterObject = { limit: parameterObject };
        await Util.AuthUtil.validateTokens();
        return await Util.apiCastedRequest(`/user/follows/manga/feed`, Chapter, parameterObject, 500, 100);
    }

    /**
     * Makes the logged in user either follow or unfollow a manga
     * @param {String} id 
     * @param {Boolean} [follow=true] True to follow, false to unfollow
     * @returns {Promise<void>}
     */
    static async changeFollowship(id, follow = true) {
        await Util.AuthUtil.validateTokens();
        await Util.apiRequest(`/manga/${id}/follow`, follow ? 'POST' : 'DELETE');
    }

    /**
     * Retrieves the read chapters for multiple manga
     * @param  {...String} ids
     * @returns {Promise<Chapter[]>} 
     */
    static async getReadChapters(...ids) {
        if (ids.length === 0) throw new Error('Invalid Argument(s)');
        if (ids[0] instanceof Array) ids = ids[0];
        await Util.AuthUtil.validateTokens();
        let chapterIds = await Util.apiParameterRequest(`/manga/read`, { ids: ids });
        if (!(chapterIds.data instanceof Array)) throw new APIRequestError('The API did not respond with an array when it was expected to', APIRequestError.INVALID_RESPONSE);
        let finalArray = [];
        while (chapterIds.data.length > 0) finalArray = finalArray.concat(await Chapter.search({ ids: chapterIds.data.splice(0, 100), limit: 100 }));
        return finalArray;
    }

    /**
     * Returns all covers for a manga
     * @param {...String|Manga} id Manga id(s)
     * @returns {Promise<Cover[]>}
     */
    static getCovers(...id) {
        return Cover.getMangaCovers(...id);
    }

    /**
     * Returns all covers for this manga
     * @returns {Promise<Cover[]>}
     */
    getCovers() {
        return Manga.getCovers(this.id);
    }

    /**
     * Returns a feed of the most recent chapters of this manga
     * @param {FeedParameterObject|Number} [parameterObject] Either a parameter object or a number representing the limit
     * @returns {Promise<Chapter[]>}
     */
    getFeed(parameterObject = {}) {
        if (typeof parameterObject === 'number') parameterObject = { limit: parameterObject };
        return Util.apiCastedRequest(`/manga/${this.id}/feed`, Chapter, parameterObject, 500, 100);
    }

    /**
     * Adds this manga to a list
     * @param {List|String} list
     * @returns {Promise<void>}
     */
    addToList(list) {
        if (typeof list !== 'string') list = list.id;
        return List.addManga(list, this.id);
    }

    /**
     * Retrieves the logged in user's reading status for this manga.
     * If there is no status, null is returned
     * @returns {Promise<'reading'|'on_hold'|'plan_to_read'|'dropped'|'re_reading'|'completed'>}
     */
    async getReadingStatus() {
        await Util.AuthUtil.validateTokens();
        let res = await Util.apiRequest(`/manga/${this.id}/status`);
        return (typeof res.status === 'string' ? res.status : null);
    }

    /**
     * Sets the logged in user's reading status for this manga. 
     * Call without arguments to clear the reading status
     * @param {'reading'|'on_hold'|'plan_to_read'|'dropped'|'re_reading'|'completed'} [status]
     * @returns {Promise<void>}
     */
    async setReadingStatus(status = null) {
        await Util.AuthUtil.validateTokens();
        await Util.apiRequest(`/manga/${this.id}/status`, 'POST', { status: status });
    }

    /**
     * Makes the logged in user either follow or unfollow this manga
     * @param {Boolean} [follow=true] True to follow, false to unfollow
     * @returns {Promise<Manga>}
     */
    async changeFollowship(follow = true) {
        await Manga.changeFollowship(this.id, follow);
        return this;
    }

    /**
     * Returns an array of every chapter that has been marked as read for this manga
     * @returns {Promise<Chapter[]>}
     */
    getReadChapters() {
        return Manga.getReadChapters(this.id);
    }
}

exports = module.exports = Manga;