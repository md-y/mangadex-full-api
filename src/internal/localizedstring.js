'use strict';

/**
 * Represents a string, but in different languages.
 * Generates properties for each language available
 * (ie you can index with language codes through localizedString['en'] or localizedString.jp)
 */
class LocalizedString {
    /**
     * Global locale setting
     * @ignore
     * @type {String}
     */
    static locale = 'en';

    /**
     * @param {Object.<string, string>} stringObject
     */
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

    /**
     * Gets an object
     * @returns {{[locale: string]: string}}
     */
    get data(){
        return this.availableLocales.reduce((obj, locale) => {
            obj[locale] = this[locale];
            return obj;
        }, {});
    }
}

exports = module.exports = LocalizedString;