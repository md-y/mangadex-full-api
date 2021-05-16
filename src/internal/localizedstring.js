'use strict'

/**
 * Represents a string, but in different languages
 */
class LocalizedString {
    /**
     * Global locale setting
     * @type {String}
     */
    static locale = 'en';

    constructor(stringObject) {
        if (!stringObject) {
            this.availableLocales = [];
            return;
        }

        for (let i in stringObject) if (i.length == 2) this[i] = stringObject[i];

        /**
         * Array with all locales with values in this object
         * @type {String[]}
         */
        this.availableLocales = Object.keys(stringObject);
    }

    /**
     * String from localized setting (LocalizedString.locale). 
     * Default is English (en). 
     * @returns {String}
     */
    get localString() {
        if (LocalizedString.locale in this) return this[LocalizedString.locale];
        for (let i of this.availableLocales) if (i in this) return this[i];
        return undefined;
    }
}

exports = module.exports = LocalizedString;