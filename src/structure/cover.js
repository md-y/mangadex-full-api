'use strict';

const Relationship = require('../internal/relationship.js');
const Util = require('../util.js');

/**
 * Represents the cover art of a manga volume
 * https://api.mangadex.org/docs.html#tag/Cover
 */
class Cover {
    /**
     * There is no reason to directly create a cover art object. Use static methods, ie 'get()'.
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
         * Manga volume this is a cover for
         * @type {Number}
         */
        this.volume = context.data.attributes.volume !== null && !isNaN(context.data.attributes.volume) ? parseFloat(context.data.attributes.volume) : null;

        /**
         * Description of this cover
         * @type {String}
         */
        this.description = context.data.attributes.description;

        /**
         * The date of the cover's creation
         * @type {Date}
         */
        this.createdAt = context.data.attributes.createdAt ? new Date(context.data.attributes.createdAt) : null;

        /**
         * The date the cover was last updated
         * @type {Date}
         */
        this.updatedAt = context.data.attributes.updatedAt ? new Date(context.data.attributes.updatedAt) : null;

        if (context.relationships === undefined) context.relationships = [];

        /**
         * Manga this is a cover for
         * @type {Relationship}
         */
        this.manga = Relationship.convertType('manga', context.relationships).pop();
        if (!this.manga) this.manga = null;

        /**
         * The user who uploaded this cover
         * @type {Relationship}
         */
        this.uploader = Relationship.convertType('user', context.relationships).pop();
        if (!this.uploader) this.uploader = null;

        /**
         * URL to the source image of the cover
         * @type {String}
         */
        this.imageSource = context.data.attributes.fileName && this.manga ? `https://uploads.mangadex.org/covers/${this.manga.id}/${context.data.attributes.fileName}` : null;

        /**
         * URL to the 512px image of the cover
         * @type {String}
         */
        this.image512 = context.data.attributes.fileName && this.manga ? `https://uploads.mangadex.org/covers/${this.manga.id}/${context.data.attributes.fileName}.512.jpg` : null;

        /**
         * URL to the 256px image of the cover
         * @type {String}
         */
        this.image256 = context.data.attributes.fileName && this.manga ? `https://uploads.mangadex.org/covers/${this.manga.id}/${context.data.attributes.fileName}.256.jpg` : null;
    }

    /**
     * Retrieves and returns a cover by its id
     * @param {String} id Mangadex id
     * @returns {Promise<Cover>}
     */
    static get(id) {
        let c = new Cover(id);
        return c.fill();
    }

    /**
     * @private
     * @typedef {Object} CoverParameterObject
     * @property {Number} CoverParameterObject.limit Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
     * @property {Number} CoverParameterObject.offset
     * @property {String[]|Manga[]} CoverParameterObject.manga Manga ids (limited to 100 per request)
     * @property {String[]|Cover[]} CoverParameterObject.ids Covers ids (limited to 100 per request)
     * @property {String[]|User[]} CoverParameterObject.uploaders User ids (limited to 100 per request)
     * @property {Object} CoverParameterObject.order
     */

    /**
     * Peforms a search and returns an array of covers.
     * https://api.mangadex.org/docs.html#operation/get-cover
     * @param {CoverParameterObject} [searchParameters]
     * @returns {Promise<Cover[]>}
     */
    static search(searchParameters = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await Util.apiSearchRequest('/cover', searchParameters);
                resolve(res.map(elem => new Cover(elem)));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Get an array of a manga's covers
     * @param {String} manga
     * @returns {Promise<Cover[]>}
     */
    static getMangaCovers(manga) {
        if (typeof manga === 'object' && 'id' in manga) manga = manga.id;
        return Cover.search({ manga: [manga] }, 100);
    }

    /**
     * Retrieves all data for this cover from the API using its id.
     * Sets the data in place and returns a new cover object as well.
     * Use if there is an incomplete in this object
     * @returns {Promise<Cover>}
     */
    fill() {
        return new Promise(async (resolve, reject) => {
            if (!this.id) reject(new Error('Attempted to fill cover with no id.'));
            if (Util.AuthUtil.canAuth) Util.AuthUtil.validateTokens();
            try {
                let res = await Util.apiRequest(`/cover/${this.id}`);
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`Failed to fill cover:\n${Util.getResponseMessage(res)}`));
                resolve(new Cover(res));
            } catch (error) {
                reject(error);
            }
        });
    }
}

exports = module.exports = Cover;