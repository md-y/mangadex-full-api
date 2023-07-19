import type { LocalizedStringSchema } from '../types/schema';

/**
 * This class represents a map of locales and their associated strings.
 * Each string can be accessed by using the locale as the key (e.g. 'en', 'jp').
 * {@link localString} and {@link setGlobalLocale} can be used to
 * automatically access a preferred locale.
 * @example
 * var locStr;
 * locStr['en']; // English String
 * LocalizedString.setGlobalLocale('jp');
 * locStr.localString; // Japanese String
 */
class LocalizedString implements LocalizedStringSchema {
    private static globalLocale = 'en';

    [x: string]: string;

    constructor(strings: LocalizedStringSchema) {
        for (const locale in strings) {
            this[locale] = strings[locale];
        }
    }

    /**
     * The string associated with the current global locale (set with setGlobalLocale()).
     * If the global locale is not available for this string, the English string is returned.
     * If that is also unavailable, the next available locale is returned. If no locales are
     * available, an empty string is returned.
     */
    get localString() {
        if (LocalizedString.globalLocale in this) return this[LocalizedString.globalLocale];
        if ('en' in this) return this['en'];
        // localString is not included in Object.keys(this)
        for (const i of Object.keys(this)) if (typeof this[i] === 'string') return this[i];
        return '';
    }

    /**
     * This function sets the default locale used by {@link LocalizedString.localString}.
     */
    static setGlobalLocale(locale: string) {
        if (locale.length < 2 || locale.length > 8) throw Error(`Locale "${locale}" has an invalid length`);
        LocalizedString.globalLocale = locale;
    }
}

export default LocalizedString;
