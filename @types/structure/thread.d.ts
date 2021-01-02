export = Thread;
/**
 * Represents a MangaDex forum/comments thread
 */
declare class Thread extends APIObject {
    constructor(id: number, request?: boolean, extraArg?: any);
    /**
     * Number of pages read for this thread (Web Parsing)
     * @type {Number}
     */
    pages: number;
    /**
     * Array of posts in this thread (Web Parsing)
     * @type {Array<Post>}
     */
    posts: Array<Post>;
    /**
     * Gets full MangaDex HTTPS link.
     * @param {"id"} property A property in this object
     * Unknown properties defaults to MangaDex's homepage
     * @returns {String} String with link
     */
    getFullURL(property: "id"): string;
}
import APIObject = require("./apiobject");
import Post = require("./post");
