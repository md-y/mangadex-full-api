'use strict';

const Util = require('../util.js');
const Relationship = require('../internal/relationship.js');

/**
 * Represents an user
 * https://api.mangadex.org/docs.html#tag/User
 */
class User {
    /**
     * There is no reason to directly create a user object. Use static methods, ie 'get()'.
     * @param {Object|String} context Either an API response or Mangadex id 
     */
    constructor(context) {
        if (typeof context === 'string') {
            this.id = context;
            return;
        } else if (!context) return;

        if (context.data === undefined) context.data = {};

        /**
         * Mangadex id for this object
         * @type {String}
         */
        this.id = context.data.id;

        if (context.data.attributes === undefined) context.data.attributes = {};

        /**
         * Username of this user
         * @type {String}
         */
        this.username = context.data.attributes.username;

        /**
         * Relationships to chapters attributed to this user
         * @type {Relationship[]}
         */
        this.chapters = Relationship.convertType('chapter', context.relationships);
    }

    /**
     * Retrieves and returns a user by its id
     * @param {String} id Mangadex id
     * @returns {Promise<User>}
     */
    static async get(id) {
        return new User(await Util.apiRequest(`/user/${id}`));
    }

    /**
     * Returns all users followed by the logged in user
     * @param {Number} [limit=100] Amount of users to return (0 to Infinity)
     * @param {Number} [offset=0] How many users to skip before returning
     * @returns {Promise<User[]>}
     */
    static async getFollowedUsers(limit = 100, offset = 10) {
        await Util.AuthUtil.validateTokens();
        return await Util.apiCastedRequest('/user/follows/user', User, { limit: limit, offset: offset });
    }

    /**
     * Returns the logged in user as a user object
     * @returns {Promise<User>}
     */
    static async getLoggedInUser() {
        return new User(await Util.apiRequest('/user/me'));
    }
}

exports = module.exports = User;