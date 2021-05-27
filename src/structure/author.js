'use strict';

const Util = require('../util.js');
const Relationship = require('../internal/relationship.js');

/**
 * Represents an author or artist
 * https://api.mangadex.org/docs.html#tag/Author
 */
class Author {
    /**
     * There is no reason to directly create an author object. Use static methods, ie 'get()'.
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
         * Name of this author/artist
         * @type {String}
         */
        this.name = context.data.attributes.name;

        /**
         * Image URL for this author/artist
         * @type {String}
         */
        this.imageUrl = context.data.attributes.imageUrl;

        /**
         * Author/Artist biography
         * @type {String[]}
         */
        this.biography = context.data.attributes.biography;

        /**
         * The date of this author/artist page creation
         * @type {Date}
         */
        this.createdAt = context.data.attributes.createdAt ? new Date(context.data.attributes.createdAt) : context.data.attributes.createdAt;

        /**
         * The date the author/artist was last updated
         * @type {Date}
         */
        this.updatedAt = context.data.attributes.updatedAt ? new Date(context.data.attributes.updatedAt) : context.data.attributes.updatedAt;

        /**
         * Relationships to manga this author/artist has been attributed to
         * @type {Relationship[]}
         */
        this.manga = Relationship.convertType('manga', context.relationships);
    }

    /**
     * @private
     * @typedef {Object} AuthorParameterObject
     * @property {String} AuthorParameterObject.name
     * @property {String[]} AuthorParameterObject.ids Max of 100 per request
     * @property {Number} AuthorParameterObject.limit
     * @property {Number} AuthorParameterObject.offset
     * @property {Object} AuthorParameterObject.order 
     */

    /**
     * Peforms a search and returns an array of a authors/artists.
     * https://api.mangadex.org/docs.html#operation/get-author
     * @param {AuthorParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the name
     * @param {Number} [limit=10] The maximum amount (100) of results to return. (Default: 10)
     * @param {Number} [offset=0] The amount of results to skip before recording them. (Default: 0)
     * @returns {Promise<Author[]>}
     */
    static search(searchParameters = {}, limit = 10, offset = 0) {
        return new Promise(async (resolve, reject) => {
            if (typeof searchParameters === 'string') searchParameters = { name: searchParameters };
            let cleanParameters = { limit: limit, offset: offset };
            for (let i in searchParameters) {
                if (searchParameters[i] instanceof Array) cleanParameters[i] = searchParameters[i].map(elem => {
                    if (typeof elem === 'string') return elem;
                    if ('id' in elem) return elem.id;
                    return elem.toString();
                });
                else if (typeof searchParameters[i] !== 'string') cleanParameters[i] = searchParameters[i].toString();
                else cleanParameters[i] = searchParameters[i];
            }

            try {
                let res = await Util.apiParameterRequest('/author', cleanParameters);
                if (Util.getResponseStatus(res) !== 'ok')
                    reject(new Error(`Author search returned error:\n${Util.getResponseMessage(res)}`));
                if (!(res instanceof Array)) reject(new Error(`Author search returned non-search result:\n${res}`));
                resolve(res.map(author => new Author(author)));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Retrieves and returns a author by its id
     * @param {String} id Mangadex id
     * @returns {Promise<Author>}
     */
    static get(id) {
        let a = new Author(id);
        return a.fill();
    }

    /**
     * Retrieves all data for this author from the API using its id.
     * Sets the data in place and returns a new author object as well.
     * Use if there is an incomplete data due to this object simply being a reference.
     * @returns {Promise<Author>}
     */
    fill() {
        return new Promise(async (resolve, reject) => {
            if (!this.id) reject(new Error('Attempted to fill author with no id.'));
            try {
                let res = await Util.apiRequest(`/author/${this.id}`);
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`Failed to fill author:\n${Util.getResponseMessage(res)}`));
                resolve(new Author(res));
            } catch (error) {
                reject(error);
            }
        });
    }
}

exports = module.exports = Author;