export = Post;
/**
 * Represents a Post in a Thread.
 * Meant only for Thread objects
 */
declare class Post {
    /**
     * All parameters required.
     * @param {Number} id Post ID
     * @param {User} author User Object
     * @param {String} text HTML text
     */
    constructor(id: number, author: User, text: string);
    /**
     * MangaDex Post ID
     * @type {Number}
     */
    id: number;
    /**
     * Author
     * @type {User}
     */
    author: User;
    /**
     * Raw HTML Text
     * @type {String}
     */
    text: string;
}
import User = require("./user");
