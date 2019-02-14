const User = require("./user");

/**
 * Represents a Post in a Thread.
 * Meant only for Thread objects
 */
class Post {
    /**
     * All parameters required.
     * @param {Number} id Post ID
     * @param {User} author User Object
     * @param {String} text HTML text
     */
    constructor(id, author, text) {
        /**
         * MangaDex Post ID
         * @type {Number}
         */
        this.id = id;

        /**
         * Author
         * @type {User}
         */
        this.author = author;

        /**
         * Raw HTML Text
         * @type {String}
         */
        this.text = text.replace(/<\s*br\s*\/>/gmi, "");
    }
}

module.exports = Post;