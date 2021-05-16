'use strict'

const Util = require('../util.js');
const Relationship = require('./relationship.js');

/**
 * Represents a group
 * https://api.mangadex.org/docs.html#tag/Group
 */
class Group {
    /**
     * There is no reason to directly create a group object. Use static methods, ie 'get()'.
     * @param {Object|String} context Either an API response or Mangadex id 
     */
    constructor (context) {
        if (typeof(context) === 'string') {
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
        this.leader = new Relationship({type: 'user', id: context.data.attributes.leader.id});
        
        /**
         * Username of the group's member. Resolve the members' relationships to retrieve other data
         * @type {User[]}
         */
        this.memberNames = (context.data.attributes.members || []).map(elem => elem.attributes.username);

        /**
         * Relationships to each group's members
         * @type {Relationship[]}
         */
        this.members = (context.data.attributes.members || []).map(elem => new Relationship({type: 'user', id: elem.id}));
    }

    /**
     * Peforms a search and returns an array of a group.
     * https://api.mangadex.org/docs.html#operation/get-search-group
     * @typedef {Object} GroupParameterObject
     * @property {String} GroupParameterObject.name
     * @property {String[]} GroupParameterObject.ids Max of 100 per request
     * @property {Number} GroupParameterObject.limit
     * @property {Number} GroupParameterObject.offset
     * @property {Object} GroupParameterObject.order
     * @param {GroupParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the name
     * @param {Number} [limit=10] The maximum amount (100) of results to return. (Default: 10)
     * @param {Number} [offset=0] The amount of results to skip before recording them. (Default: 0)
     * @returns {Promise<Group[]>}
     */
    static search(searchParameters = {}, limit = 10, offset = 0) {
        return new Promise(async(resolve, reject) => {
            if (typeof(searchParameters) === 'string') searchParameters = { name: searchParameters };
            let cleanParameters = { limit: limit, offset: offset };
            for (let i in searchParameters) {
                if (searchParameters[i] instanceof Array) cleanParameters[i] = searchParameters[i].map(elem => {
                    if (typeof(elem) === 'string') return elem;
                    if ('id' in elem) return elem.id;
                    return elem.toString();
                });
                else if (typeof(searchParameters[i]) !== 'string') cleanParameters[i] = searchParameters[i].toString();
                else cleanParameters[i] = searchParameters[i];
            }

            try {
                let res = await Util.apiParameterRequest('/group', cleanParameters);
                if (Util.getResponseStatus(res) !== 'ok') 
                    reject(new Error(`Group search returned error:\n${Util.getResponseMessage(res)}`));
                if (!(res instanceof Array)) reject(new Error(`Group search returned non-search result:\n${res}`)); 
                resolve(res.map(group => new Group(group)));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Retrieves and returns a group by its id
     * @param {String} id Mangadex id
     * @returns {Promise<Group>}
     */
     static get(id) {
        let a = new Group(id);
        return a.fill();
    }

    /**
     * Retrieves all data for this group from the API using its id.
     * Sets the data in place and returns a new group object as well.
     * Use if there is an incomplete data due to this object simply being a reference.
     * @returns {Promise<Group>}
     */
    fill() {
        return new Promise(async (resolve, reject) => {
            if (!this.id) reject(new Error('Attempted to fill group with no id.'));
            try {
                let res = await Util.apiRequest(`/group/${this.id}`);
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`Failed to fill group:\n${Util.getResponseMessage(res)}`));
                resolve(new Group(res));
            } catch (error) {
                reject(error);
            }
        });
    }
}

exports = module.exports = Group;