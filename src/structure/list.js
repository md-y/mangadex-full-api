'use strict';

const { Manga } = require('../index.js');
const Relationship = require('../internal/relationship.js');
const Util = require('../util.js');
const Chapter = require('./chapter.js');

/**
 * Represents a Mangadex custom list object
 * https://api.mangadex.org/docs.html#tag/CustomList
 */
class List {
    /**
     * There is no reason to directly create a custom list object. Use static methods, ie 'get()'.
     * @param {Object|String} context Either an API response or Mangadex id 
     */
    constructor(context) {
        if (typeof(context) === 'string') {
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
         * String form of this list's visibility
         * @type {'public'|'private'}
         */
        this.visibility = context.data.attributes.visibility;
        if (this.visibility !== 'public' && this.visibility !== 'private') this.visibility = null;

        /**
         * Is this list public?
         * @type {Boolean}
         */
        this.public = this.visibility === 'public';

        if (context.relationships === undefined) context.relationships = [];
        /**
         * Relationships to all of the manga in this custom list
         * @type {Relationship}
         */
        this.manga = Relationship.convertType('manga', context.relationships);

        if (context.data.attributes.owner === undefined) context.data.attributes.owner = {};
        /**
         * Relationship to this list's owner
         * @type {Relationship}
         */
        this.owner = new Relationship({type: 'user', id: context.data.attributes.owner.id});

        if (context.data.attributes.owner.attributes === undefined) context.data.attributes.owner.attributes = {};
        /**
         * Name of this list's owner. Resolve this owner relationship object for other user info
         * @type {String}
         */
         this.ownerName = context.data.attributes.owner.attributes.username;
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
            if (!name || !manga || !manga.every(e => e instanceof Manga || typeof(e) === 'string')) reject(new Error('Invalid Arguments'));
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
     * Returns a list of the most recent chapters from the manga in a list
     * @param {String} id Mangadex id of the list
     * @param {Number} [limit] Amount of chapters to return (Max 500)
     * @param {Number} [offset] How many chapters to skip before returning
     * @returns {Promise<Chapter[]>}
     */
    static getFeed(id, limit = 100, offset = 0) {
        let l = new List(id)
        return l.getFeed(limit, offset);
    }

    /**
     * Returns a list of the most recent chapters from the manga in a list
     * @param {Number} [limit] Amount of chapters to return (Max 500)
     * @param {Number} [offset] How many chapters to skip before returning
     * @returns {Promise<Chapter[]>}
     */
    getFeed(limit = 100, offset = 0) {
        return new Promise(async (resolve, reject) => {
            if (!this.id) reject(new Error('Attempted to get feed for a list with no id.'));
            try {
                if (Util.AuthUtil.canAuth) Util.AuthUtil.validateTokens();
                let res = await Util.apiParameterRequest(`/list/${this.id}/feed`, { limit: limit, offset: offset });
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`List feed returned an error: ${Util.getResponseMessage(res)}`));
                if (!(res instanceof Array)) reject(new Error(`List feed returned non-feed result:\n${res}`));
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