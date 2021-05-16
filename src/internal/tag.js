'use strict'

const Util = require('../util.js');
const LocalizedString = require('../internal/localizedstring.js');

class Tag {
    static cachedTags = {};
    static cached = false;

    constructor(id) {
        /**
         * Mangadex id of this tag
         * @type {String}
         */
        this.id = id;
        if (!(id in Tag.cachedTags)) return;

        /**
         * Name with different localization options
         * @type {LocalizedString}
         */
        this.localizedName = new LocalizedString(Tag.cachedTags[id].name);

        /**
         * Description with different localization options
         * @type {LocalizedString}
         */
        this.localizedDescription = new LocalizedString(Tag.cachedTags[id].description);

        /**
         * What type of tag group this tag belongs to
         * @type {String}
         */
        this.group = Tag.cachedTags[id].group;
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
     * Fills the tag cache. Required before any tag objects can be made.
     */
    static async fillCache() {
        let res = await Util.apiRequest('/manga/tag');
        if (Util.getResponseStatus(res) === 'ok') {
            for (let i of res) Tag.cachedTags[i.data.id] = i.data.attributes;
            Tag.cached = true;
        } else throw new Error(`Failed to fill tag cache: ${Util.getResponseMessage(res)}`);
    }

    /**
     * Returns an array of all tags from a Mangadex relationship array
     * @param {Object[]} data
     * @returns {Array<Tag>}
     */
    static getFromRelationships(data) {
        if (!(data instanceof Array)) return [];
        return data.filter(elem => elem.type === 'tag').map(elem => new Tag(elem.id));
    }
}

exports = module.exports = Tag;