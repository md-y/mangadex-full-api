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
    static async get(id) {
        return new Cover(await Util.apiRequest(`/cover/${id}`));
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
        return Util.apiCastedRequest('/cover', Cover, searchParameters);
    }

    /**
     * Get an array of manga's covers
     * @param {...String|Manga} manga
     * @returns {Promise<Cover[]>}
     */
    static async getMangaCovers(...manga) {
        if (manga[0] instanceof Array) manga = manga[0];
        manga = manga.map(elem => typeof elem === 'string' ? elem : elem.id);
        return await Cover.search({ manga: manga.splice(0, 100), limit: Infinity });
    }
}

exports = module.exports = Cover;