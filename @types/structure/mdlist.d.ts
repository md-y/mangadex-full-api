export = MDList;
/**
 * Represents a MangaDex MDList
 */
declare class MDList extends APIObject {
    constructor(id: number, request?: boolean, extraArg?: any);
    /**
     * Partial banner image url. Use getFullURL();
     * @type {String}
     */
    banner: string;
    /**
     * List of manga, sorted by what was called with fill().
     * @type {Array<Manga>}
     */
    manga: Array<Manga>;
    /**
     * Requests a MDList from a user account.
     * @param {User} user MangaDex User Object
     * @param {Number|String} order The list order (enum/listing-order)
     * @param {Number} category Mangadex follow category. Default: All. See enum 'viewingCategories'
     */
    fillByUser(user: any, order: number | string, category: number): any;
    /**
     * Gets full MangaDex HTTPS link.
     * @param {"id"|"banner"} property A property in this object
     * Unknown properties defaults to MangaDex's homepage
     * @returns {String} String with link
     */
    getFullURL(property: "id" | "banner"): string;
}
import APIObject = require("./apiobject");
import Manga = require("./manga");
