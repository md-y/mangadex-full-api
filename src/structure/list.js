'use strict';

const Relationship = require('../internal/relationship.js');
const Util = require('../util.js');
const AuthUtil = require('../auth.js');
const Chapter = require('./chapter.js');

/**
 * Represents a custom, user-created list of manga
 * https://api.mangadex.org/docs.html#tag/CustomList
 */
class List {
    /**
     * There is no reason to directly create a custom list object. Use static methods, ie 'get()'.
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
         * Name of this custom list
         * @type {String}
         */
        this.name = context.data.attributes.name;

        /**
         * Version of this custom list
         * @type {String}
         */
        this.version = context.data.attributes.version;

        /**
         * String form of this list's visibility
         * @type {'public'|'private'}
         */
        this.visibility = context.data.attributes.visibility;
        if (this.visibility !== 'public' && this.visibility !== 'private') this.visibility = null;

        /**
         * Relationships to all of the manga in this custom list
         * @type {Array<Relationship<import('../index').Manga>>}
         */
        this.manga = Relationship.convertType('manga', context.data.relationships, this);

        /**
         * This list's owner
         * @type {Relationship<import('../index').User>}
         */
        this.owner = Relationship.convertType('user', context.data.relationships, this).pop();
    }

    /**
     * Is this list public?
     * @type {Boolean}
     */
    get public() {
        if (this.visibility !== 'private' && this.visibility !== 'public') return null;
        return this.visibility === 'public';
    }

    /**
     * Retrieves and returns a list by its id
     * @param {String} id Mangadex id
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<List>}
     */
    static async get(id, includeSubObjects = false) {
        if (AuthUtil.canAuth) await AuthUtil.validateTokens();
        return new List(await Util.apiRequest(`/list/${id}${includeSubObjects ? '?includes[]=manga&includes[]=user' : ''}`));
    }

    /**
     * Create a new custom list. Must be logged in
     * @param {String} name
     * @param {import('../index').Manga[]|String[]} manga
     * @param {'public'|'private'} [visibility='private'] 
     * @returns {Promise<List>}
     */
    static async create(name, manga, visibility = 'private') {
        if (!name || !manga || !manga.every(e => typeof e === 'string' || 'id' in e)) throw new Error('Invalid Argument(s)');
        await AuthUtil.validateTokens();
        let res = await Util.apiRequest('/list', 'POST', {
            name: name,
            manga: manga.map(elem => typeof elem === 'string' ? elem : elem.id),
            visibility: visibility === 'public' ? visibility : 'private'
        });
        return new List(res);
    }

    /**
     * Deletes a custom list. Must be logged in
     * @param {String} id 
     * @returns {Promise<void>}
     */
    static async delete(id) {
        await AuthUtil.validateTokens();
        await Util.apiRequest(`/list/${id}`, 'DELETE');
    }

    /**
     * Adds a manga to a custom list. Must be logged in
     * @param {String} listId
     * @param {import('../index').Manga|String} manga
     * @returns {Promise<void>}
     */
    static async addManga(listId, manga) {
        if (!listId || !manga) throw new Error('Invalid Argument(s)');
        if (typeof manga !== 'string') manga = manga.id;
        await AuthUtil.validateTokens();
        await Util.apiRequest(`/manga/${manga}/list/${listId}`, 'POST');
    }

    /**
     * Removes a manga from a custom list. Must be logged in
     * @param {String} listId
     * @param {import('../index').Manga|String} manga
     * @returns {Promise<void>}
     */
    static async removeManga(listId, manga) {
        if (!listId || !manga) throw new Error('Invalid Argument(s)');
        if (typeof manga !== 'string') manga = manga.id;
        await AuthUtil.validateTokens();
        await Util.apiRequest(`/manga/${manga}/list/${listId}`, 'DELETE');
    }

    /**
     * Returns all lists created by the logged in user.
     * @param {Number} [limit=100] Amount of lists to return (0 to Infinity)
     * @param {Number} [offset=0] How many lists to skip before returning
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<List[]>}
     */
    static async getLoggedInUserLists(limit = 100, offset = 0, includeSubObjects = false) {
        await AuthUtil.validateTokens();
        let res = await Util.apiSearchRequest('/user/list', { limit: limit, offset: offset });
        return res.map(elem => new List({ data: elem }));
    }

    /**
     * Returns all public lists created by a user.
     * @param {String|import('../index').User|Relationship<import('../index').User>} user
     * @param {Number} [limit=100] Amount of lists to return (0 to Infinity)
     * @param {Number} [offset=0] How many lists to skip before returning
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<List[]>}
     */
    static async getUserLists(user, limit = 100, offset = 0, includeSubObjects = false) {
        if (typeof user !== 'string') user = user.id;
        let res = await Util.apiSearchRequest(`/user/${user}/list`, { limit: limit, offset: offset });
        return res.map(elem => new List({ data: elem }));
    }

    /**
     * @ignore
     * @typedef {Object} FeedParameterObject
     * @property {Number} [FeedParameterObject.limit] Not limited by API limits (more than 500). Use Infinity for maximum results (use at your own risk)
     * @property {Number} [FeedParameterObject.offset]
     * @property {String[]} [FeedParameterObject.translatedLanguage]
     * @property {String} [FeedParameterObject.createdAtSince] DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {String} [FeedParameterObject.updatedAtSince] DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {String} [FeedParameterObject.publishAtSince] DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {Object} [FeedParameterObject.order]
     * @property {'asc'|'desc'} [FeedParameterObject.order.volume]
     * @property {'asc'|'desc'} [FeedParameterObject.order.chapter]
     * @property {'asc'|'desc'} [FeedParameterObject.order.createdAt]
     * @property {'asc'|'desc'} [FeedParameterObject.order.updatedAt]
     */

    /**
     * Returns a list of the most recent chapters from the manga in a list
     * @param {String} id Mangadex id of the list
     * @param {FeedParameterObject} parameterObject Information on which chapters to be returned
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<Chapter[]>}
     */
    static async getFeed(id, parameterObject = {}, includeSubObjects = false) {
        if (AuthUtil.canAuth) await AuthUtil.validateTokens();
        if (includeSubObjects) parameterObject.includes = ['scanlation_group', 'manga', 'user'];
        return await Util.apiCastedRequest(`/list/${id}/feed`, Chapter, parameterObject, 500, 100);
    }

    /**
     * Returns a list of the most recent chapters from the manga in a list
     * https://api.mangadex.org/docs.html#operation/get-list-id-feed
     * @param {FeedParameterObject} [parameterObject] Information on which chapters to be returned
     * @returns {Promise<Chapter[]>}
     */
    getFeed(parameterObject = {}) {
        return List.getFeed(this.id, parameterObject);
    }

    /**
     * Delete a custom list. Must be logged in
     * @returns {Promise<void>}
     */
    delete() {
        return List.delete(this.id);
    }

    /**
     * Renames a custom list. Must be logged in
     * @param {String} newName
     * @returns {Promise<List>}
     */
    async rename(newName) {
        if (!newName || typeof newName !== 'string') throw new Error('Invalid Argument(s)');
        await AuthUtil.validateTokens();
        await Util.apiRequest(`/list/${this.id}`, 'PUT', { name: newName, version: this.version });
        this.name = newName;
        return this;
    }

    /**
     * Changes the visibility a custom list. Must be logged in
     * @param {'public'|'private'} [newVis] Leave blank to toggle
     * @returns {Promise<List>}
     */
    async changeVisibility(newVis) {
        if (!newVis && this.public) newVis = 'private';
        else if (!newVis && this.public !== null) newVis = 'public';
        else if (newVis !== 'private' && newVis !== 'public') throw new Error('Invalid Argument(s)');
        await AuthUtil.validateTokens();
        await Util.apiRequest(`/list/${this.id}`, 'PUT', { visibility: newVis, version: this.version });
        this.visibility = newVis;
        return this;
    }

    /**
     * Changes the manga in a custom list. Must be logged in
     * @param {import('../index').Manga[]|String[]} newList
     * @returns {Promise<List>}
     */
    async updateMangaList(newList) {
        if (!(newList instanceof Array)) throw new Error('Invalid Argument(s)');
        let idList = newList.map(elem => typeof elem === 'string' ? elem : elem.id);
        await AuthUtil.validateTokens();
        let res = await Util.apiRequest(`/list/${this.id}`, 'PUT', { manga: idList, version: this.version });
        this.manga = Relationship.convertType('manga', res.data.relationships, this);
        return this;
    }

    /**
     * Adds a manga to this list
     * @param {import('../index').Manga|String} manga
     * @returns {Promise<List>}
     */
    async addManga(manga) {
        if (typeof manga !== 'string') manga = manga.id;
        let idList = this.manga.map(elem => elem.id);
        // Uses updateMangaList to maintain server-side order
        if (!idList.includes(manga)) await this.updateMangaList(idList.concat(manga));
        return this;
    }

    /**
     * Removes a manga from this list
     * @param {import('../index').Manga|String} manga
     * @returns {Promise<List>}
     */
    async removeManga(manga) {
        if (typeof manga !== 'string') manga = manga.id;
        await List.removeManga(this.id, manga);
        this.manga = this.manga.filter(elem => elem.id !== manga);
        return this;
    }
}

exports = module.exports = List;