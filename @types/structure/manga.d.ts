export = Manga;
/**
 * Represents a Manga with all information on a Manga's homepage
 */
declare class Manga extends APIObject {
    /**
     * MangaDex quicksearch
     * @param {String} query Quicksearch query like a name or description
     */
    static search(query: string): Promise<any>;
    /**
     * MangaDex full search, not quicksearch
     * @param {Object} searchObj An object containing search parameters.
     * @example Search object example
     *  fullSearch({
     *      title: "Sangatsu no Lion",
     *      author: "Umino Chica",
     *      artist: "Umino Chica",
     *      demographic: [1, 2, 3, "Josei"], // You can use strings too
     *      pubstatus: [1, 2, 3, 4],
     *      language: "JP", // Original Language
     *      excludeAll: false, // True = AND mode; False = OR Mode
     *      includeAll: true, // Same as above
     *      includeTags: [4, 5, "Romance"],
     *      excludeTags: [50],
     *      order: "Rating (Des)" // Number or string; Des = starts with highest rated
     *  });
     */
    static fullSearch(searchObj: any): any;
    constructor(id: number, request?: boolean, extraArg?: any);
    /**
     * Main title for a manga
     * @type {String}
     */
    title: string;
    /**
     * Current cover.
     * @type {String}
     */
    cover: string;
    /**
     * Cover list of urls
     * @type {Array<String>}
     */
    covers: Array<string>;
    /**
     * Original (published) manga language code
     * @type {String}
     */
    language: string;
    /**
     * Array of the manga's genres
     * @type {Array<Number>}
     */
    genres: Array<number>;
    /**
     * Artist(s) name(s)
     * @type {Array<String>}
     */
    artists: Array<string>;
    /**
     * Author(s) name(s)
     * @type {Array<String>}
     */
    authors: Array<string>;
    /**
     * Hentai or not?
     * @type {Boolean}
     */
    hentai: boolean;
    /**
     * MangaDex description.
     * Formatted for HTML
     * @type {String}
     */
    description: string;
    /**
     * Links to manga information on other sites.
     * Replaces raw values with enum/link when available, but still uses MangaDex keys.
     * @type {Object}
     */
    links: Object;
    /**
     * Basic information about each chapter in this manga.
     * Call fill() on each of these to request more info.
     * @type {Array<Chapter>}
     */
    chapters: Array<Chapter>;
    /**
     * Viewcount
     * @type {Number}
     */
    views: number;
    /**
     * Bayesian Rating
     * @type {Number}
     */
    rating: number;
    /**
     * Mean Rating
     * @type {Number}
     */
    ratingMean: number;
    /**
     * Number of Users who have Rated
     * @type {Number}
     */
    ratingUserCount: number;
    /**
     * Alternate Titles
     * @type {Array<String>}
     */
    altTitles: Array<string>;
    url: string;
    /**
     * Executes Manga.search() then executes fill() with the most relevent manga.
     * @param {String} query Quicksearch query like a name or description
     */
    fillByQuery(query: string): any;
    /**
     * Executes Manga.fullSearch() then executes fill() with the most relevent manga.
     * @param {Object} searchObj
     */
    fillByFullQuery(searchObj: any): any;
    /**
     * Gets full MangaDex HTTPS link.
     * @param {"cover"|"id"|"flag"} property A property in this object
     * Unknown properties defaults to MangaDex's homepage
     * @returns {String} String with link
     */
    getFullURL(property: "cover" | "id" | "flag"): string;
    /**
     * Array of genre names instead of IDs. Uses /enum/genre
     * @type {Array<String>}
     */
    get genreNames(): string[];
}
import APIObject = require("./apiobject");
import Chapter = require("./chapter");
