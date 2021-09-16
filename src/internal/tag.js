'use strict';

const LocalizedString = require('../internal/localizedstring.js');
const Util = require('../util.js');
const APIRequestError = require('./requesterror.js');

/**
 * Represents a manga tag
 */
class Tag {
    /** 
     * A cached response from https://api.mangadex.org/manga/tag
     * @type {Tag[]} 
     */
    static cache = [];

    constructor(data) {
        if (data === undefined || !('id' in data)) throw new Error('Attempted to create a tag with invalid data.');

        /**
         * Mangadex id of this tag
         * @type {String}
         */
        this.id = data.id;

        /**
         * Name with different localization options
         * @type {LocalizedString}
         */
        this.localizedName = new LocalizedString(data.attributes.name);

        /**
         * Description with different localization options
         * @type {LocalizedString}
         */
        this.localizedDescription = new LocalizedString(data.attributes.description);

        /**
         * What type of tag group this tag belongs to
         * @type {String}
         */
        this.group = data.attributes.group;
    }

    /**
     * Name string based on global locale
     * @type {String}
     */
    get name() {
        if (this.localizedName !== undefined) return this.localizedName.localString;
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
     * @ignore
     * @returns {Promise<Tag[]>}
     */
    static async getAllTags() {
        if (Tag.cache.length === 0) {
            let res = await Util.apiRequest('/manga/tag');
            if (!(res.data instanceof Array)) throw new APIRequestError('The API did not respond with an array when it was expected to', APIRequestError.INVALID_RESPONSE);
            if (res.data.length === 0) throw new APIRequestError('The API returned an empty array of tags.', APIRequestError.INVALID_RESPONSE);
            Tag.cache = res.data.map(elem => new Tag(elem));
        }
        return Tag.cache;
    }

    /**
     * @ignore
     * @param {String} indentity
     * @returns {Promise<Tag>}
     */
    static async getTag(indentity) {
        for (let i of await Tag.getAllTags()) {
            if (i.id === indentity || i.localizedName.availableLocales.some(elem => i.localizedName[elem].toLowerCase() === indentity)) {
                return i;
            }
        }
        return null;
    }
}

exports = module.exports = Tag;