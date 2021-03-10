export = MDList;
/**
 * Represents a MangaDex MDList
 */
declare class MDList extends APIObject {
    constructor(id: number, request?: boolean, extraArg?: any);
    /**
     * Banner image url
     * @type {String}
     */
    banner: string;
    /**
     * List of manga, sorted by what was called with fill().
     * @type {Array<Manga>}
     */
    manga: Array<Manga>;
    url: string;
    /**
     * Owner of this MDList
     * @type {User}
     */
    owner: any;
    /**
     * Requests a MDList from a user account.
     * @param {User} user MangaDex User Object
     * @param {Number|String} order The list order (enum/listing-order)
     * @param {Number} category Mangadex follow category. Default: All. See enum 'viewingCategories'
     */
    fillByUser(user: any, order: number | string, category: number): any;
}
import APIObject = require("./apiobject");
import Manga = require("./manga");
