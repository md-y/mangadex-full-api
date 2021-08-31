'use strict';

/**
 * Represents a string, but in different languages.
 * Generates properties for each language available 
 * (ie you can index with language codes through localizedString['en'] or localizedString.jp)
 */
class LocalizedString {
    /**
     * Global locale setting
     * @private
     * @type {String}
     */
    static locale = 'en';

    constructor(stringObject) {
        if (!stringObject) {
            this.availableLocales = [];
            return;
        }

        for (let i in stringObject) if (typeof stringObject[i] === 'string') this[i] = stringObject[i];

        /**
         * Array with all locales with values in this object
         * @type {String[]}
         */
        this.availableLocales = Object.keys(stringObject);
    }

    /**
     * String from global locale setting (setGlobalLocale)
     * @returns {String}
     */
    get localString() {
        if (LocalizedString.locale in this) return this[LocalizedString.locale];
        for (let i of this.availableLocales) if (i in this) return this[i];
        return null;
    }
}

exports = module.exports = LocalizedString;