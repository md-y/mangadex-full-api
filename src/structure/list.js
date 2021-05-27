'use strict';

const Manga = require('./manga.js');
const Relationship = require('../internal/relationship.js');
const Util = require('../util.js');
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

        if (context.data === undefined) context.data = {};

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

        if (context.relationships === undefined) context.relationships = [];
        /**
         * Relationships to all of the manga in this custom list
         * @type {Relationship[]}
         */
        this.manga = Relationship.convertType('manga', context.relationships);

        if (context.data.attributes.owner === undefined) context.data.attributes.owner = {};
        /**
         * Relationship to this list's owner
         * @type {Relationship}
         */
        this.owner = new Relationship({ type: 'user', id: context.data.attributes.owner.id });

        if (context.data.attributes.owner.attributes === undefined) context.data.attributes.owner.attributes = {};
        /**
         * Name of this list's owner. Resolve this owner relationship object for other user info
         * @type {String}
         */
        this.ownerName = context.data.attributes.owner.attributes.username;
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
     * @returns {Promise<List>}
     */
    static get(id) {
        let l = new List(id);
        return l.fill();
    }

    /**
     * Create a new custom list. Must be logged in
     * @param {String} name
     * @param {Manga|String} manga
     * @param {Boolean} [public] Public visibility?
     * @returns {Promise<List>}
     */
    static async create(name, manga, publicVis = true) {
        return new Promise(async (resolve, reject) => {
            if (!name || !manga || !manga.every(e => e instanceof Manga || typeof e === 'string')) reject(new Error('Invalid Arguments'));
            try {
                await Util.AuthUtil.validateTokens();
                let res = await Util.apiRequest('/list', 'POST', {
                    name: name,
                    manga: manga.map(elem => elem.id),
                    visibility: publicVis ? 'public' : 'private'
                });
                if (Util.getResponseStatus(res) === 'ok') resolve(new List(res));
                else reject(new Error(`Failed to create list ${Util.getResponseMessage(res)}`));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Deletes a custom list. Must be logged in
     * @param {String} id 
     * @returns {Promise}
     */
    static delete(id) {
        let l = new List(id);
        return l.delete();
    }

    /**
     * Adds a manga to a custom list. Must be logged in
     * @param {String} listId
     * @param {Manga|String} manga
     * @returns {Promise}
     */
    static addManga(listId, manga) {
        return new Promise(async (resolve, reject) => {
            if (!listId || !manga) reject(new Error('Invalid arguments'));
            if (typeof manga !== 'string') manga = manga.id;
            try {
                await Util.AuthUtil.validateTokens();
                let res = await Util.apiRequest(`/manga/${manga}/list/${listId}`, 'POST');
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`Failed to add manga to a list: ${Util.getResponseMessage(res)}`));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Removes a manga from a custom list. Must be logged in
     * @param {String} listId
     * @param {Manga|String} manga
     * @returns {Promise}
     */
    static removeManga(listId, manga) {
        return new Promise(async (resolve, reject) => {
            if (!listId || !manga) reject(new Error('Invalid arguments'));
            if (typeof manga !== 'string') manga = manga.id;
            try {
                await Util.AuthUtil.validateTokens();
                let res = await Util.apiRequest(`/manga/${manga}/list/${listId}`, 'DELETE');
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`Failed to delete manga from list: ${Util.getResponseMessage(res)}`));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
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
     * Returns a list of the most recent chapters from the manga in a list
     * @param {String} id Mangadex id of the list
     * @param {FeedParameterObject} parameterObject Information on which chapters to be returned
     * @returns {Promise<Chapter[]>}
     */
    static getFeed(id, parameterObject) {
        let l = new List(id);
        return l.getFeed(parameterObject);
    }

    /**
     * Returns a list of the most recent chapters from the manga in a list
     * https://api.mangadex.org/docs.html#operation/get-list-id-feed
     * @param {FeedParameterObject} [parameterObject] Information on which chapters to be returned
     * @returns {Promise<Chapter[]>}
     */
    getFeed(parameterObject = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                if (Util.AuthUtil.canAuth) Util.AuthUtil.validateTokens();
                let res = await Util.apiSearchRequest(`/list/${this.id}/feed`, parameterObject, 500, 100);
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`List feed returned an error: ${Util.getResponseMessage(res)}`));
                resolve(res.map(elem => new Chapter(elem)));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Delete a custom list. Must be logged in
     * @returns {Promise}
     */
    delete() {
        return new Promise(async (resolve, reject) => {
            try {
                await Util.AuthUtil.validateTokens();
                let res = await Util.apiRequest(`/list/${this.id}`, 'DELETE');
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`Failed to delete list: ${Util.getResponseMessage(res)}`));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Renames a custom list. Must be logged in
     * @param {String} newName
     * @returns {Promise<List>}
     */
    rename(newName) {
        return new Promise(async (resolve, reject) => {
            if (!newName || typeof newName !== 'string') reject(new Error('Invalid argument.'));
            try {
                await Util.AuthUtil.validateTokens();
                let res = await Util.apiRequest(`/list/${this.id}`, 'PUT', { name: newName, version: this.version });
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`Failed to rename list: ${Util.getResponseMessage(res)}`));
                this.name = newName;
                resolve(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Changes the visibility a custom list. Must be logged in
     * @param {'public'|'private'} [newVis] Leave blank to toggle
     * @returns {Promise<List>}
     */
    changeVisibility(newVis) {
        return new Promise(async (resolve, reject) => {
            if (!newVis && this.public) newVis = 'private';
            else if (!newVis && this.public !== null) newVis = 'public';
            else if (newVis !== 'private' && newVis !== 'public') reject(new Error('Invalid argument.'));
            try {
                await Util.AuthUtil.validateTokens();
                let res = await Util.apiRequest(`/list/${this.id}`, 'PUT', { visibility: newVis, version: this.version });
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`Failed to change list visibility: ${Util.getResponseMessage(res)}`));
                this.visibility = newVis;
                resolve(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Changes the manga in a custom list. Must be logged in
     * @param {Manga[]|String[]} newList
     * @returns {Promise<List>}
     */
    updateMangaList(newList) {
        return new Promise(async (resolve, reject) => {
            if (!(newList instanceof Array)) reject(new Error('Invalid argument'));
            let idList = newList.map(elem => typeof elem === 'string' ? elem : elem.id);
            try {
                await Util.AuthUtil.validateTokens();
                let res = await Util.apiRequest(`/list/${this.id}`, 'PUT', { manga: idList, version: this.version });
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`Failed to change the manga of a list: ${Util.getResponseMessage(res)}`));
                this.manga = Relationship.convertType('manga', res.relationships);
                resolve(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Adds a manga to this list
     * @param {Manga|String} manga
     * @returns {Promise<List>}
     */
    addManga(manga) {
        return new Promise(async (resolve, reject) => {
            if (typeof manga !== 'string') manga = manga.id;
            let idList = this.manga.map(elem => elem.id);
            try {
                // Uses updateMangaList to maintain server-side order
                if (!idList.includes(manga)) await this.updateMangaList(idList.concat(manga));
                resolve(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Removes a manga from this list
     * @param {Manga|String} manga
     * @returns {Promise<List>}
     */
    removeManga(manga) {
        return new Promise(async (resolve, reject) => {
            if (typeof manga !== 'string') manga = manga.id;
            try {
                await List.removeManga(this.id, manga);
                this.manga = this.manga.filter(elem => elem.id !== manga);
                resolve(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Retrieves all data for this list from the API using its id.
     * Sets the data in place and returns a new list object as well.
     * Use if there is an incomplete in this object
     * @returns {Promise<List>}
     */
    fill() {
        return new Promise(async (resolve, reject) => {
            if (!this.id) reject(new Error('Attempted to fill custom list with no id.'));
            if (Util.AuthUtil.canAuth) Util.AuthUtil.validateTokens();
            try {
                let res = await Util.apiRequest(`/list/${this.id}`);
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`Failed to fill custom list:\n${Util.getResponseMessage(res)}`));
                resolve(new List(res));
            } catch (error) {
                reject(error);
            }
        });
    }
}

exports = module.exports = List;