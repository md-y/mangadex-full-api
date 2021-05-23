'use strict'

const LocalizedString = require('../internal/localizedstring.js');

/**
 * Represents a manga tag
 */
class Tag {
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
}

exports = module.exports = Tag;