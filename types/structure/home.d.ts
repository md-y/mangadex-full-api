export = Home;
/**
 * Represents the Manga info on MangaDex's homepage
 */
declare class Home {
    /**
     * @param {Boolean} requestData Automatically call and return fill()?
     */
    constructor(requestData: boolean);
    _parse(data: any): void;
    /**
     * Array of the most recent manga updated (Web Parsing)
     * @type {Array<Manga>}
     */
    newest: Array<Manga>;
    /**
     * Array of the top manga in the past 6 hours (Web Parsing)
     * @type {Array<Manga>}
     */
    top6h: Array<Manga>;
    /**
     * Array of the top manga in the past 24 hours (Web Parsing)
     * @type {Array<Manga>}
     */
    top24h: Array<Manga>;
    /**
     * Array of the top manga in the past week (Web Parsing)
     * @type {Array<Manga>}
     */
    top7d: Array<Manga>;
    /**
     * Array of the top manga by follows (Web Parsing)
     * @type {Array<Manga>}
     */
    topFollows: Array<Manga>;
    /**
     * Array of the top manga by rating (Web Parsing)
     * @type {Array<Manga>}
     */
    topRating: Array<Manga>;
    /**
     * Retrieves information from MangaDex and set this instance's variables.
     * @returns {Promise} Promise resolve argument is this object
     */
    fill(): Promise<any>;
}
import Manga = require("./manga");
