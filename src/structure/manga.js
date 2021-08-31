'use strict';

const Util = require('../util.js');
const AuthUtil = require('../auth.js');
const Links = require('../internal/links.js');
const LocalizedString = require('../internal/localizedstring.js');
const Relationship = require('../internal/relationship.js');
const Tag = require('../internal/tag.js');
const Chapter = require('./chapter.js');
const Cover = require('./cover.js');
const Author = require('./author.js');
const List = require('./list.js');
const APIRequestError = require('../internal/requesterror.js');
const UploadSession = require('../internal/uploadsession.js');
const Group = require('./group.js');

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
        this.isLocked = context.data.attributes.isLocked === true;

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
         * This manga's last volume based on the default feed order
         * @type {String}
         */
        this.lastVolume = context.data.attributes.lastVolume;

        /**
         * This manga's last chapter based on the default feed order
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
         * Authors attributed to this manga
         * @type {Relationship[]}
         */
        this.authors = Relationship.convertType('author', context.data.relationships, this);

        /**
         * Artists attributed to this manga
         * @type {Relationship[]}
         */
        this.artists = Relationship.convertType('artist', context.data.relationships, this);

        /**
         * This manga's main cover. Use 'getCovers' to retrive other covers
         * @type {Relationship}
         */
        this.mainCover = Relationship.convertType('cover_art', context.data.relationships, this).pop();
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
     * @property {String} [MangaParameterObject.title]
     * @property {Number} [MangaParameterObject.year]
     * @property {'AND'|'OR'} [MangaParameterObject.includedTagsMode]
     * @property {'AND'|'OR'} [MangaParameterObject.excludedTagsMode]
     * @property {String} [MangaParameterObject.createdAtSince] DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {String} [MangaParameterObject.updatedAtSince] DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {Object} [MangaParameterObject.order]
     * @property {'asc'|'desc'} [MangaParameterObject.order.createdAt]
     * @property {'asc'|'desc'} [MangaParameterObject.order.updatedAt]
     * @property {String[]|Author[]} [MangaParameterObject.authors] Array of author ids
     * @property {String[]|Author[]} [MangaParameterObject.artists] Array of artist ids
     * @property {String[]|Tag[]} [MangaParameterObject.includedTags]
     * @property {String[]|Tag[]} [MangaParameterObject.excludedTags]
     * @property {Array<'ongoing'|'completed'|'hiatus'|'cancelled'>} [MangaParameterObject.status]
     * @property {String[]} [MangaParameterObject.originalLanguage]
     * @property {String[]} [MangaParameterObject.excludedOriginalLanguage]
     * @property {String[]} [MangaParameterObject.availableTranslatedLanguage]
     * @property {Array<'shounen'|'shoujo'|'josei'|'seinen'|'none'>} [MangaParameterObject.publicationDemographic]
     * @property {String[]} [MangaParameterObject.ids] Max of 100 per request
     * @property {Array<'safe'|'suggestive'|'erotica'|'pornographic'>} [MangaParameterObject.contentRating]
     * @property {Number} [MangaParameterObject.limit] Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
     * @property {Number} [MangaParameterObject.offset]
     */

    /**
     * Peforms a search and returns an array of manga.
     * https://api.mangadex.org/docs.html#operation/get-search-manga
     * @param {MangaParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the title
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<Manga[]>}
     */
    static search(searchParameters = {}, includeSubObjects = false) {
        if (typeof searchParameters === 'string') searchParameters = { title: searchParameters };
        if (includeSubObjects) searchParameters.includes = ['artist', 'author', 'cover_art'];
        return Util.apiCastedRequest('/manga', Manga, searchParameters);
    }

    /**
     * Gets multiple manga
     * @param {...String|Relationship} ids
     * @returns {Promise<Manga[]>}
     */
    static getMultiple(...ids) {
        return Util.getMultipleIds(Manga.search, ids);
    }

    /**
     * Retrieves and returns a manga by its id
     * @param {String} id Mangadex id
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<Manga>}
     */
    static async get(id, includeSubObjects = false) {
        return new Manga(await Util.apiRequest(`/manga/${id}${includeSubObjects ? '?includes[]=artist&includes[]=author&includes[]=cover_art' : ''}`));
    }

    /**
     * Performs a search for one manga and returns that manga
     * @param {MangaParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the title
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<Manga>}
     */
    static async getByQuery(searchParameters = {}, includeSubObjects = false) {
        if (typeof searchParameters === 'string') searchParameters = { title: searchParameters, limit: 1 };
        else searchParameters.limit = 1;
        let res = await Manga.search(searchParameters, includeSubObjects);
        if (res.length === 0) throw new Error('Search returned no results.');
        return res[0];
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
     * @property {'asc'|'desc'} FeedParameterObject.order.volume
     * @property {'asc'|'desc'} FeedParameterObject.order.chapter
     * @property {'asc'|'desc'} FeedParameterObject.order.createdAt
     * @property {'asc'|'desc'} FeedParameterObject.order.updatedAt
     */

    /**
     * Returns a feed of chapters for a manga
     * @param {String} id
     * @param {FeedParameterObject|Number} [parameterObject] Either a parameter object or a number representing the limit
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<Chapter[]>}
     */
    static getFeed(id, parameterObject = {}, includeSubObjects = false) {
        if (typeof parameterObject === 'number') parameterObject = { limit: parameterObject };
        if (includeSubObjects) parameterObject.includes = ['scanlation_group', 'manga', 'user'];
        return Util.apiCastedRequest(`/manga/${id}/feed`, Chapter, parameterObject, 500, 100);
    }

    /**
     * Returns one random manga
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<Manga>}
     */
    static async getRandom(includeSubObjects = false) {
        return new Manga(await Util.apiRequest(`/manga/random${includeSubObjects ? '?includes[]=artist&includes[]=author&includes[]=cover_art' : ''}`));
    }

    /**
     * Returns all manga followed by the logged in user
     * @param {Number} [limit=100] Amount of manga to return (0 to Infinity)
     * @param {Number} [offset=0] How many manga to skip before returning
     * @returns {Promise<Manga[]>}
     */
    static async getFollowedManga(limit = 100, offset = 0) {
        await AuthUtil.validateTokens();
        let params = { limit: limit, offset: offset };
        return await Util.apiCastedRequest('/user/follows/manga', Manga, params);
        // Currently (8/30/21) MD does not support includes[]=artist&includes[]=author&includes[]=cover_art for this endpoint
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
    static async getReadingStatus(id) {
        await AuthUtil.validateTokens();
        let res = await Util.apiRequest(`/manga/${id}/status`);
        return (typeof res.status === 'string' ? res.status : null);
    }

    /**
     * Sets the logged in user's reading status for this manga. 
     * Call without arguments to clear the reading status
     * @param {String} id
     * @param {'reading'|'on_hold'|'plan_to_read'|'dropped'|'re_reading'|'completed'} [status]
     * @returns {Promise<void>}
     */
    static async setReadingStatus(id, status = null) {
        await AuthUtil.validateTokens();
        await Util.apiRequest(`/manga/${id}/status`, 'POST', { status: status });
    }

    /**
     * Returns the reading status for every manga for this logged in user as an object with Manga ids as keys
     * @returns {Object.<string, 'reading'|'on_hold'|'plan_to_read'|'dropped'|'re_reading'|'completed'>}
     */
    static async getAllReadingStatuses() {
        await AuthUtil.validateTokens();
        let res = await Util.apiRequest(`/manga/status`);
        if (!('statuses' in res)) throw new APIRequestError('The API did not respond with a statuses object when it was expected to', APIRequestError.INVALID_RESPONSE);
        return res.statuses;
    }

    /**
     * Gets the combined feed of every manga followed by the logged in user
     * @param {FeedParameterObject|Number} [parameterObject] Either a parameter object or a number representing the limit
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<Chapter[]>}
     */
    static async getFollowedFeed(parameterObject, includeSubObjects = false) {
        if (typeof parameterObject === 'number') parameterObject = { limit: parameterObject };
        if (includeSubObjects) parameterObject.includes = ['scanlation_group', 'manga', 'user'];
        await AuthUtil.validateTokens();
        return await Util.apiCastedRequest(`/user/follows/manga/feed`, Chapter, parameterObject, 500, 100);
    }

    /**
     * Makes the logged in user either follow or unfollow a manga
     * @param {String} id 
     * @param {Boolean} [follow=true] True to follow, false to unfollow
     * @returns {Promise<void>}
     */
    static async changeFollowship(id, follow = true) {
        await AuthUtil.validateTokens();
        await Util.apiRequest(`/manga/${id}/follow`, follow ? 'POST' : 'DELETE');
    }

    /**
     * Retrieves the read chapters for multiple manga
     * @param  {...String|Manga|Relationship} ids
     * @returns {Promise<Chapter[]>} 
     */
    static async getReadChapters(...ids) {
        if (ids.length === 0) throw new Error('Invalid Argument(s)');
        if (ids[0] instanceof Array) ids = ids[0];
        await AuthUtil.validateTokens();
        let chapterIds = await Util.apiParameterRequest(`/manga/read`, { ids: ids });
        if (!(chapterIds.data instanceof Array)) throw new APIRequestError('The API did not respond with an array when it was expected to', APIRequestError.INVALID_RESPONSE);
        return Chapter.getMultiple(...chapterIds);
    }

    /**
     * Returns all covers for a manga
     * @param {...String|Manga|Relationship} id Manga id(s)
     * @returns {Promise<Cover[]>}
     */
    static getCovers(...id) {
        return Cover.getMangaCovers(...id);
    }

    /**
     * @private
     * @typedef {Object} AggregateChapter
     * @property {String} AggregateChapter.chapter
     * @property {Number} AggregateChapter.count
     */

    /**
     * @private
     * @typedef {Object} AggregateVolume
     * @property {String} AggregateVolume.volume
     * @property {Number} AggregateVolume.count
     * @property {Object.<string, AggregateChapter>} AggregateVolume.chapters
     */

    /**
     * Returns a summary of every chapter for a manga including each of their numbers and volumes they belong to
     * https://api.mangadex.org/docs.html#operation/post-manga
     * @param {String} id
     * @param {...String} languages 
     * @returns {Promise<Object.<string, AggregateVolume>>}
     */
    static async getAggregate(id, ...languages) {
        if (languages[0] instanceof Array) languages = languages[0];
        let res = await Util.apiParameterRequest(`/manga/${id}/aggregate`, { translatedLanguage: languages });
        if (!('volumes' in res)) throw new APIRequestError('The API did not respond with the appropriate aggregate structure', APIRequestError.INVALID_RESPONSE);
        return res.volumes;
    }

    /**
     * Creates a new upload session with a manga as the target
     * @param {String} id
     * @param {...String|Group} [groups]
     * @returns {Promise<UploadSession>}
     */
    static createUploadSession(id, ...groups) {
        return UploadSession.open(id, ...groups);
    }

    /**
     * Returns the currently open upload session for the logged in user.
     * Returns null if there is no current session
     * @returns {Promise<UploadSession>}
     */
    static getCurrentUploadSession() {
        return UploadSession.getCurrentSession();
    }

    /**
     * Creates a new upload session with this manga as the target
     * @param {...String|Group} [groups]
     * @returns {Promise<UploadSession>}
     */
    createUploadSession(...groups) {
        return Manga.createUploadSession(this.id, ...groups);
    }

    /**
     * Returns all covers for this manga
     * @returns {Promise<Cover[]>}
     */
    getCovers() {
        return Manga.getCovers(this.id);
    }

    /**
     * Returns a feed of this manga's chapters.
     * @param {FeedParameterObject|Number} [parameterObject] Either a parameter object or a number representing the limit
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<Chapter[]>}
     */
    getFeed(parameterObject = {}, includeSubObjects = false) {
        return Manga.getFeed(this.id, parameterObject, includeSubObjects);
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
    getReadingStatus() {
        return Manga.getReadingStatus(this.id);
    }

    /**
     * Sets the logged in user's reading status for this manga. 
     * Call without arguments to clear the reading status
     * @param {'reading'|'on_hold'|'plan_to_read'|'dropped'|'re_reading'|'completed'} [status]
     * @returns {Promise<Manga>}
     */
    async setReadingStatus(status = null) {
        await Manga.setReadingStatus(this.id, status);
        return this;
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

    /**
     * Returns a summary of every chapter for this manga including each of their numbers and volumes they belong to
     * https://api.mangadex.org/docs.html#operation/post-manga
     * @param {...String} languages 
     * @returns {Promise<Object>}
     */
    getAggregate(...languages) {
        return Manga.getAggregate(this.id, ...languages);
    }
}

exports = module.exports = Manga;