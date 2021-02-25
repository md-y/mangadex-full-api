/**
 * Represents abstract API Functionality
 */
class APIObject {
    /**
     * @param {Number} id MangaDex ID
     * @param {Boolean} request Automatically call fill() and return a promise? (Default: False)
     * @param {Object} extraArg An extra argument for fill(); usually for page count (eg MDList)
     * @returns {Promise} Only returns when request is true.
     * 
     * @example 
     * // Manga:
     * let manga = await new Manga(47, true);
     * console.log("Retrieved manga: " + manga.title);
     * 
     */
    constructor(id, request = false, extraArg = undefined) {
        /**
         * MangaDex ID
         * @type {Number}
         */
        this.id = id;

        if (request) {
            if (extraArg) return this.fill(this.id, extraArg);
            else return this.fill(this.id);
        }
        else return this;
    }

    /**
     * Loads data from API calls
     * @param {Object} data Information that will override current info
     */
    _parse(data) {
        this.id = data.id;
    }

    /**
     * Retrieves information from MangaDex and set this instance's variables.
     * @param {Number} id Object's ID (Defaults to this.id)
     * @returns {Promise} Promise resolve argument is this object
     */
    fill(id) {
        return new Promise((resolve, reject) => {
            // Return Empty Promise
            resolve(this);
        });
    }

    /**
     * Returns a new object with the respones from fill().
     * @example
     * // Same as:
     * (new Object()).fill(id)
     * @param {Number} id ID of MangaDex object
     * @param  {...any} extraArgs 
     * @returns {Promise<APIObject>}
     */
    static async get(id, ...extraArgs) {
        return await (new this()).fill(id, ...extraArgs);
    }

    /**
     * Deprecated. Simply use direct property (ie .url, .flag, or .banner)
     * @deprecated
     * @param {String} property Partial URL element
     * @type {String}
     */
    getFullURL(property) {
        if (property === "id") property = "url";
        if (property in this && typeof(this[property]) === "string") {
            console.warn(`The method getFullURL is deprecated! Please use the '${property}' property instead.`);
            return this[property];
        }
        console.warn("The method getFullURL is deprecated! (And you didn't even use it correctly)");
        return "https://mangadex.org"; // This is a stupid default, but it's what the old method used
    }
}

module.exports = APIObject;