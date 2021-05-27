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
    static get(id) {
        let u = new User(id);
        return u.fill();
    }

    /**
     * Retrieves all data for this user from the API using its id.
     * Sets the data in place and returns a new user object as well.
     * Use if there is an incomplete data due to this object simply being a reference.
     * @returns {Promise<User>}
     */
    fill() {
        return new Promise(async (resolve, reject) => {
            if (!this.id) reject(new Error('Attempted to fill user with no id.'));
            try {
                let res = await Util.apiRequest(`/user/${this.id}`);
                if (Util.getResponseStatus(res) !== 'ok') reject(new Error(`Failed to fill user:\n${Util.getResponseMessage(res)}`));
                resolve(new User(res));
            } catch (error) {
                reject(error);
            }
        });
    }
}

exports = module.exports = User;