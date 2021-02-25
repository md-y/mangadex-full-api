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
    url: string;
    /**
     * Array of posts in this thread (Web Parsing)
     * @type {Array<Post>}
     */
    posts: Array<Post>;
}
import APIObject = require("./apiobject");
import Post = require("./post");
