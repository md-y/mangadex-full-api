export = APIObject;
/**
 * Represents abstract API Functionality
 */
declare class APIObject {
    /**
     * Returns a new object with the respones from fill().
     * @example
     * // Same as:
     * (new Object()).fill(id)
     * @param {Number} id ID of MangaDex object
     * @param  {...any} extraArgs
     * @returns {Promise<APIObject>}
     */
    static get(id: number, ...extraArgs: any[]): Promise<APIObject>;
    /**
     * @param {Number} id MangaDex ID
     * @param {Boolean} request Automatically call fill() and return a promise? (Default: False)
     * @param {Object} extraArg An extra argument for fill(); usually for page count (eg MDList)
     * @returns {Promise} Only returns when request is true.
     *
     * @example
     * // Manga:
     * let manga = await new Manga(47, true);
     * console.log("Retrieved manga: " + manga.title);
     *
     */
    constructor(id: number, request?: boolean, extraArg?: any);
    /**
     * MangaDex ID
     * @type {Number}
     */
    id: number;
    /**
     * Loads data from API calls
     * @param {Object} data Information that will override current info
     */
    _parse(data: any): void;
    /**
     * Retrieves information from MangaDex and set this instance's variables.
     * @param {Number} id Object's ID (Defaults to this.id)
     * @returns {Promise} Promise resolve argument is this object
     */
    fill(id: number): Promise<any>;
    /**
     * Deprecated. Simply use direct property (ie .url, .flag, or .banner)
     * @deprecated
     * @param {String} property Partial URL element
     * @type {String}
     */
    getFullURL(property: string): any;
}
