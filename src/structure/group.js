'use strict';

const Util = require('../util.js');
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

        if (context.data === undefined) context.data = {};

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
         * Relationships to chapters attributed to this group
         * @type {Relationship[]}
         */
        this.chapters = Relationship.convertType('chapter', context.relationships);

        /**
         * Username of the group's leader. Resolve the leader relationship to retrieve other data
         * @type {User}
         */
        this.leaderName = context.data.attributes.leader ? context.data.attributes.leader.attributes.username : null;

        /**
         * Relationship to this group's leader
         * @type {Relationship}
         */
        this.leader = new Relationship({ type: 'user', id: context.data.attributes.leader.id });

        /**
         * Username of the group's member. Resolve the members' relationships to retrieve other data
         * @type {User[]}
         */
        this.memberNames = (context.data.attributes.members || []).map(elem => elem.attributes.username);

        /**
         * Relationships to each group's members
         * @type {Relationship[]}
         */
        this.members = (context.data.attributes.members || []).map(elem => new Relationship({ type: 'user', id: elem.id }));
    }

    /**
     * @private
     * @typedef {Object} GroupParameterObject
     * @property {String} GroupParameterObject.name
     * @property {String[]} GroupParameterObject.ids Max of 100 per request
     * @property {Number} GroupParameterObject.limit Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
     * @property {Number} GroupParameterObject.offset
     * @property {Object} GroupParameterObject.order
     */

    /**
     * Peforms a search and returns an array of groups.
     * https://api.mangadex.org/docs.html#operation/get-search-group
     * @param {GroupParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the name
     * @returns {Promise<Group[]>}
     */
    static search(searchParameters = {}) {
        if (typeof searchParameters === 'string') searchParameters = { name: searchParameters };
        return Util.apiCastedRequest('/group', Group, searchParameters);
    }

    /**
     * Retrieves and returns a group by its id
     * @param {String} id Mangadex id
     * @returns {Promise<Group>}
     */
    static async get(id) {
        return new Group(await Util.apiRequest(`/group/${id}`));
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
    static async getFollowedGroups(limit = 100, offset = 10) {
        await Util.AuthUtil.validateTokens();
        return await Util.apiCastedRequest('/user/follows/group', Group, { limit: limit, offset: offset });
    }
}

exports = module.exports = Group;