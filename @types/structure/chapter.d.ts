import Group = require('./group');

export = Chapter;
/**
 * Represents a Chapter with pages
 */
declare class Chapter extends APIObject {
    constructor(id: number, request?: boolean, extraArg?: any);
    /**
     * Type of chapter (delayed, external, etc.)?
     * @type {Number} See chapter-type.js
     */
    type: number;
    url: string;
    /**
     * Applicable link to chapter. It's either the MD Link, Group delayed link, or
     * external link.
     * @type {String}
     */
    link: string;
    /**
     * Unix timestamp
     * @type {Number}
     */
    timestamp: number;
    /**
     * Volume # (0 if unknown)
     * @type {Number}
     */
    volume: number;
    /**
     * Chapter # (0 if unknown)
     * @type {Number}
     */
    chapter: number;
    /**
     * Chapter Title ("" if no title)
     * @type {String}
     */
    title: string;
    /**
     * Chapter translated language code
     * @type {String}
     */
    language: string;
    /**
     * Parent manga ID
     * @type {Number}
     */
    parentMangaID: number;
    /**
     * IDs of translation groups for this chapter
     * @type {Array<Group>}
     */
    groups: Array<Group>;
    /**
     * Number of comments for this chapter, not manga
     * @type {Number}
     */
    commentCount: number;
    /**
     * Links to each pages. Uses the Mangadex.org domain, not Mangadex @ Home due to instability
     * @type {Array<String>}
     */
    pages: Array<string>;
    saverPages: Array<string>|undefined;
    /**
     * Viewcount for this chapter
     * @type {Number}
     */
    views: number;
    /**
     * Gets full MangaDex HTTPS link.
     * @param {"id"|"flag"} property A property in this object
     * Unknown properties defaults to MangaDex's homepage
     * @returns {String} String with link
     */
    getFullURL(property: "id" | "flag"): string;
}
import APIObject = require("./apiobject");
