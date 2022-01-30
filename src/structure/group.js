'use strict';

const Util = require('../util.js');
const AuthUtil = require('../auth.js');
const Relationship = require('../internal/relationship.js');

/**
 * Represents a scanlation group
 * https://api.mangadex.org/docs.html#tag/Group
 */
class Group {
    /**
     * There is no reason to directly create a group object. Use static methods, ie 'get()'.
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
         * Name of this group
         * @type {String}
         */
        this.name = context.data.attributes.name;

        /**
         * The date of this group's creation
         * @type {Date}
         */
        this.createdAt = context.data.attributes.createdAt ? new Date(context.data.attributes.createdAt) : null;

        /**
         * The date the group was last updated
         * @type {Date}
         */
        this.updatedAt = context.data.attributes.updatedAt ? new Date(context.data.attributes.updatedAt) : null;

        /**
         * Is this group locked?
         * @type {Boolean}
         */
        this.locked = context.data.attributes.locked === true;

        /**
         * Website URL for this group
         * @type {String}
         */
        this.website = context.data.attributes.website;

        /**
        * IRC Server for this group
        * @type {String}
        */
        this.ircServer = context.data.attributes.ircServer;

        /**
        * IRC Channel for this group
        * @type {String}
        */
        this.ircChannel = context.data.attributes.ircChannel;

        /**
        * Discord Invite Code for this group
        * @type {String}
        */
        this.discord = context.data.attributes.discord;

        /**
         * Email for this group
         * @type {String}
         */
        this.contactEmail = context.data.attributes.contactEmail;

        /**
         * This group's twitter
         * @type {String}
         */
        this.twitter = context.data.attributes.twitter;

        /**
         * This group's manga updates page
         * @type {String}
         */
        this.mangaUpdates = context.data.attributes.mangaUpdates;

        /**
         * This group's focused languages
         * @type {String[]}
         */
        this.focusedLanguages = context.data.attributes.focusedLanguages;

        /**
         * This group's publish delay
         * @type {Number}
         */
        this.publishDelay = context.data.attributes.publishDelay;

        /**
         * Is this group inactive?
         * @type {Boolean}
         */
        this.inactive = context.data.attributes.inactive;

        /**
         * The group's custom description
         * @type {String}
         */
        this.description = context.data.attributes.description;

        /**
         * Is this group an official publisher?
         * @type {Boolean}
         */
        this.official = context.data.attributes.official;

        /**
         * Is this group managed by an official publisher?
         * @type {Boolean}
         */
        this.verified = context.data.attributes.verified;

        /**
         * This group's leader
         * @type {Relationship<import('../index').User>}
         */
        this.leader = Relationship.convertType('leader', context.data.relationships, this).pop();

        /**
         * Array of this group's members
         * @type {Array<Relationship<import('../index').User>>}
         */
        this.members = Relationship.convertType('member', context.data.relationships, this);
    }

    /**
     * @ignore
     * @typedef {Object} GroupParameterObject
     * @property {String} [GroupParameterObject.name]
     * @property {String} [GroupParameterObject.name]
     * @property {String} [GroupParameterObject.focusedLanguage]
     * @property {Object} [GroupParameterObject.order]
     * @property {'asc'|'desc'} [GroupParameterObject.order.createdAt]
     * @property {'asc'|'desc'} [GroupParameterObject.order.updatedAt]
     * @property {'asc'|'desc'} [GroupParameterObject.order.name]
     * @property {'asc'|'desc'} [GroupParameterObject.order.followedCount]
     * @property {'asc'|'desc'} [GroupParameterObject.order.relevance]
     * @property {String[]} [GroupParameterObject.ids] Max of 100 per request
     * @property {Number} [GroupParameterObject.limit] Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
     * @property {Number} [GroupParameterObject.offset]
     */

    /**
     * Peforms a search and returns an array of groups.
     * https://api.mangadex.org/docs.html#operation/get-search-group
     * @param {GroupParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the name
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<Group[]>}
     */
    static search(searchParameters = {}, includeSubObjects = false) {
        if (typeof searchParameters === 'string') searchParameters = { name: searchParameters };
        if (includeSubObjects) searchParameters.includes = ['user'];
        return Util.apiCastedRequest('/group', Group, searchParameters);
    }

    /**
     * Gets multiple groups
     * @param {...String|Group|Relationship<Group>} ids
     * @returns {Promise<Group[]>}
     */
    static getMultiple(...ids) {
        return Util.getMultipleIds(Group.search, ids);
    }

    /**
     * Retrieves and returns a group by its id
     * @param {String} id Mangadex id
     * @param {Boolean} [includeSubObjects=false] Attempt to resolve sub objects (eg author, artists, etc) when available through the base request
     * @returns {Promise<Group>}
     */
    static async get(id, includeSubObjects = false) {
        return new Group(await Util.apiRequest(`/group/${id}${includeSubObjects ? '?includes[]=leader&includes[]=member' : ''}`));
    }

    /**
     * Performs a search for one group and returns that group
     * @param {GroupParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the name
     * @returns {Promise<Group>}
     */
    static async getByQuery(searchParameters = {}) {
        if (typeof searchParameters === 'string') searchParameters = { name: searchParameters, limit: 1 };
        else searchParameters.limit = 1;
        let res = await Group.search(searchParameters);
        if (res.length === 0) throw new Error('Search returned no results.');
        return res[0];
    }

    /**
     * Returns all groups followed by the logged in user
     * @param {Number} [limit=100] Amount of groups to return (0 to Infinity)
     * @param {Number} [offset=0] How many groups to skip before returning
     * @returns {Promise<Group[]>}
     */
    static async getFollowedGroups(limit = 100, offset = 0) {
        await AuthUtil.validateTokens();
        return await Util.apiCastedRequest('/user/follows/group', Group, { limit: limit, offset: offset });
        // Currently (8/30/21) MD does not support includes[]=leader&includes[]=member for this endpoint
    }

    /**
     * Makes the logged in user either follow or unfollow a group
     * @param {String} id 
     * @param {Boolean} [follow=true] True to follow, false to unfollow
     * @returns {Promise<void>}
     */
    static async changeFollowship(id, follow = true) {
        await AuthUtil.validateTokens();
        await Util.apiRequest(`/group/${id}/follow`, follow ? 'POST' : 'DELETE');
    }

    /**
     * Makes the logged in user either follow or unfollow this group
     * @param {Boolean} [follow=true] True to follow, false to unfollow
     * @returns {Promise<Group>}
     */
    async changeFollowship(follow = true) {
        await Group.changeFollowship(this.id, follow);
        return this;
    }
}

exports = module.exports = Group;