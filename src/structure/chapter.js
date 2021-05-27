'use strict';

const Util = require('../util.js');
const Relationship = require('../internal/relationship.js');

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

        if (context.data === undefined) context.data = {};

        /**
         * Mangadex id for this object
         * @type {String}
         */
        this.id = context.data.id;


        if (context.data.attributes === undefined) context.data.attributes = {};

        /**
         * Number this chapter's volume
         * @type {Number}
         */
        this.volume = context.data.attributes.volume !== null && !isNaN(context.data.attributes.volume) ? parseFloat(context.data.attributes.volume) : null;

        /**
         * Number of this chapter
         * @type {Number}
         */
        this.chapter = context.data.attributes.chapter !== null && !isNaN(context.data.attributes.chapter) ? parseFloat(context.data.attributes.chapter) : null;

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
         * Hash id of this chapter
         * @type {String}
         */
        this.hash = context.data.attributes.hash;

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
         * Dont Use. This is an array of partial URLs. Use 'getReadablePages()' to retrieve full urls.
         * @type {String}
         */
        this.pageNames = context.data.attributes.data;

        /**
         * Dont Use. This is an array of partial URLs. Use 'getReadablePages()' to retrieve full urls.
         * @type {String}
         */
        this.saverPageNames = context.data.attributes.dataSaver;

        /**
         * Relationships to scanlation groups that are attributed to this chapter
         * @type {Relationship[]}
         */
        this.groups = Relationship.convertType('scanlation_group', context.relationships);

        /**
         * Relationships to the manga this chapter belongs to
         * @type {Relationship}
         */
        this.manga = Relationship.convertType('manga', context.relationships)[0];

        /**
         * Relationships to the user who uploaded this chapter
         * @type {Relationship}
         */
        this.uploader = Relationship.convertType('user', context.relationships)[0];
    }

    /**
     * @private
     * @typedef {Object} ChapterParameterObject
     * @property {String} ChapterParameterObject.title
     * @property {String} ChapterParameterObject.createdAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {String} ChapterParameterObject.updatedAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {String} ChapterParameterObject.publishAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
     * @property {Object} ChapterParameterObject.order
     * @property {String[]} ChapterParameterObject.translatedLanguage
     * @property {String[]} ChapterParameterObject.ids Max of 100 per request
     * @property {Number} ChapterParameterObject.limit
     * @property {Number} ChapterParameterObject.offset
     * @property {String[]|Group[]} ChapterParameterObject.groups
     * @property {String|User} ChapterParameterObject.uploader
     * @property {String|Manga} ChapterParameterObject.manga
     * @property {String} ChapterParameterObject.volume
     * @property {String} ChapterParameterObject.chapter
     */

    /**
     * Peforms a search and returns an array of chapters.
     * https://api.mangadex.org/docs.html#operation/get-chapter
     * @param {ChapterParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the title
     * @param {Number} [limit=10] The maximum amount (100) of results to return. (Default: 10)
     * @param {Number} [offset=0] The amount of results to skip before recording them. (Default: 0)
     * @returns {Promise<Chapter[]>}
     */
    static search(searchParameters = {}, limit = 10, offset = 0) {
        return new Promise(async (resolve, reject) => {
            if (typeof searchParameters === 'string') searchParameters = { title: searchParameters };
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
                let res = await Util.apiParameterRequest('/chapter', cleanParameters);
                if (Util.getResponseStatus(res) !== 'ok')
                    reject(new Error(`Chapter search returned error:\n${Util.getResponseMessage(res)}`));
                if (!(res instanceof Array)) reject(new Error(`Chapter search returned non-search result:\n${res}`));
                resolve(res.map(chapter => new Chapter(chapter)));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Retrieves and returns a chapter by its id
     * @param {String} id Mangadex id
     * @returns {Promise<Chapter>}
     */
    static get(id) {
        let c = new Chapter(id);
        return c.fill();
    }

    /**
     * Retrieves all data for this chapter from the API using its id.
     * Sets the data in place and returns a new chapter object as well.
     * Use if there is an incomplete in this object
     * @returns {Promise<Chapter>}
     */
    fill() {
        return new Promise(async (resolve, reject) => {
            if (!this.id) reject(new Error('Attempted to fill chapter with no id.'));
            try {
                let res = await Util.apiRequest(`/chapter/${this.id}`);
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`Failed to fill chapter:\n${Util.getResponseMessage(res)}`));
                resolve(new Chapter(res));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Retrieves URLs for actual images from Mangadex @ Home.
     * This only gives URLs, so it does not report the status of the server to Mangadex @ Home.
     * Therefore applications that download image data pleaese report failures as stated here:
     * https://api.mangadex.org/docs.html#section/Reading-a-chapter-using-the-API/Report
     * @param {Boolean} [saver] Use data saver images?
     * @returns {Promise<String[]>}
     */
    getReadablePages(saver = false) {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await Util.apiRequest(`/at-home/server/${this.id}`);
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`Failed to retrieve Mangadex@Home server: ${Util.getResponseMessage(res)}`));
                resolve((saver ? this.saverPageNames : this.pageNames).map(name => `${res.baseUrl}/${saver ? 'data-saver' : 'data'}/${this.hash}/${name}`));
            } catch (error) {
                reject(error);
            }
        });
    }
}

exports = module.exports = Chapter;