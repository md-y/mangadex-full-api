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

        if (!context.data) context.data = {};

        /**
         * Mangadex id for this object
         * @type {String}
         */
        this.id = context.data.id;


        if (context.data.attributes === undefined) context.data.attributes = {};

        /**
         * Manga volume this is a cover for
         * @type {String}
         */
        this.volume = context.data.attributes.volume;

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

        /**
         * Manga this is a cover for
         * @type {Relationship<import('../index').Manga>}
         */
        this.manga = Relationship.convertType('manga', context.data.relationships, this).pop();
        if (!this.manga) this.manga = null;

        /**
         * The user who uploaded this cover
         * @type {Relationship<import('../index').User>}
         */
        this.uploader = Relationship.convertType('user', context.data.relationships, this).pop();
        if (!this.uploader) this.uploader = null;

        /**
         * The locale of this cover
         * @type {String}
         */
        this.locale = context.data.attributes.locale;

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
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<Cover>}
     */
    static async get(id, includeSubObjects = false) {
        return new Cover(await Util.apiRequest(`/cover/${id}${includeSubObjects ? '?includes[]=user&includes[]=manga' : ''}`));
    }

    /**
     * @ignore
     * @typedef {Object} CoverParameterObject
     * @property {Number} [CoverParameterObject.limit] Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
     * @property {Number} [CoverParameterObject.offset]
     * @property {String[]|import('../index').Manga[]} [CoverParameterObject.manga] Manga ids (limited to 100 per request)
     * @property {String[]|Cover[]} [CoverParameterObject.ids] Covers ids (limited to 100 per request)
     * @property {String[]|import('../index').User[]} [CoverParameterObject.uploaders] User ids (limited to 100 per request)
     * @property {Object} [CoverParameterObject.order]
     * @property {'asc'|'desc'} [CoverParameterObject.order.createdAt]
     * @property {'asc'|'desc'} [CoverParameterObject.order.updatedAt]
     * @property {'asc'|'desc'} [CoverParameterObject.order.volume]
     */

    /**
     * Peforms a search and returns an array of covers.
     * https://api.mangadex.org/docs.html#operation/get-cover
     * @param {CoverParameterObject} [searchParameters]
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<Cover[]>}
     */
    static search(searchParameters = {}, includeSubObjects = false) {
        if (includeSubObjects) searchParameters.includes = ['user', 'manga'];
        return Util.apiCastedRequest('/cover', Cover, searchParameters);
    }

    /**
     * @ignore
     * @typedef {Object} CoverUploadParameterObject
     * @property {string|null} [CoverUploadParameterObject.volume] Volume of the cover
     * @property {string} [CoverUploadParameterObject.description] Description of the cover
     */

    /**
     * @ignore
     * @typedef {Object} CoverFileObject
     * @property {Buffer} CoverFileObject.data
     * @property {'jpeg'|'png'|'gif'} [CoverFileObject.type]
     * @property {String} CoverFileObject.name
     */

    /**
     * Creates a new cover.
     * @param {string} [mangaId] The id of the manga that the cover is for.
     * @param {CoverFileObject} [file] The buffer containing the image data.
     * @param {CoverUploadParameterObject | undefined} [options] Additional options for the cover upload.
     * @returns {Promise<Cover>}
     */
    static async create(mangaId, file, options){
        options = options || {};
        return new Cover(await Util.apiRequest(`/cover/${mangaId}`, 'POST', Util.createMultipartPayload([file], {
            volume: options.volume,
            description: options.description
        })))
    }

    /**
     * Gets multiple covers
     * @param {...String|Cover|Relationship<Cover>} ids
     * @returns {Promise<Cover[]>}
     */
    static getMultiple(...ids) {
        return Util.getMultipleIds(Cover.search, ids);
    }

    /**
     * Performs a search for one manga and returns that manga
     * @param {CoverParameterObject} [searchParameters]
     * @returns {Promise<Cover>}
     */
    static async getByQuery(searchParameters = {}) {
        searchParameters.limit = 1;
        let res = await Cover.search(searchParameters);
        if (res.length === 0) throw new Error('Search returned no results.');
        return res[0];
    }

    /**
     * Get an array of manga's covers
     * @param {...String|import('../index').Manga|Relationship<import('../index').Manga>} manga
     * @returns {Promise<Cover[]>}
     */
    static getMangaCovers(...manga) {
        return Util.getMultipleIds(Cover.search, manga, {}, Infinity, 'manga');
    }
}

exports = module.exports = Cover;