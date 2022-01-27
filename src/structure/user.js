'use strict';

const Util = require('../util.js');
const AuthUtil = require('../auth.js');
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

        if (!context.data) context.data = {};

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
         * The roles of this user such as "ROLE_MD_AT_HOME" and "ROLE_ADMIN"
         * @type {String[]}
         */
        this.roles = context.data.attributes.roles;

        /**
         * Groups this user is a part of
         * @type {Array<Relationship<import('../index').Group>>}
         */
        this.groups = Relationship.convertType('scanlation_group', context.data.relationships, this);
    }

    /**
     * @ignore
     * @typedef {Object} UserParameterObject
     * @property {String} [UserParameterObject.username]
     * @property {String[]} [UserParameterObject.ids] Max of 100 per request
     * @property {Number} [UserParameterObject.limit] Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
     * @property {Number} [UserParameterObject.offset]
     * @property {Object} [UserParameterObject.order] 
     * @property {'asc'|'desc'} [UserParameterObject.order.username]
     */

    /**
     * Peforms a search and returns an array of users. Requires authorization
     * https://api.mangadex.org/docs.html#operation/get-user
     * @param {UserParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the username
     * @returns {Promise<User[]>}
     */
    static search(searchParameters = {}) {
        if (typeof searchParameters === 'string') searchParameters = { username: searchParameters };
        return Util.apiCastedRequest('/user', User, searchParameters);
        // Currently (9/14/21) MD does not support includes[]=scanlation_group for any user endpoint
    }

    /**
     * Gets multiple users
     * @param {...String|Relationship<User>} ids
     * @returns {Promise<User[]>}
     */
    static getMultiple(...ids) {
        return Util.getMultipleIds(User.search, ids);
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
        await AuthUtil.validateTokens();
        return await Util.apiCastedRequest('/user/follows/user', User, { limit: limit, offset: offset });
    }

    /**
     * Returns the logged in user as a user object
     * @returns {Promise<User>}
     */
    static async getLoggedInUser() {
        await AuthUtil.validateTokens();
        return new User(await Util.apiRequest('/user/me'));
    }

    /**
     * Makes the logged in user either follow or unfollow a user
     * @param {String} id 
     * @param {Boolean} [follow=true] True to follow, false to unfollow
     * @returns {Promise<void>}
     */
    static async changeFollowship(id, follow = true) {
        await AuthUtil.validateTokens();
        await Util.apiRequest(`/user/${id}/follow`, follow ? 'POST' : 'DELETE');
    }

    /**
     * Makes the logged in user either follow or unfollow this user
     * @param {Boolean} [follow=true] True to follow, false to unfollow
     * @returns {Promise<User>}
     */
    async changeFollowship(follow = true) {
        await User.changeFollowship(this.id, follow);
        return this;
    }
}

exports = module.exports = User;