/**
 * Represents abstract API Functionality
 */
class APIObject {
    /**
     * @param {Number} id MangaDex ID (Optional).
     * @param {Boolean} dontRequest When true, the object will not be filled from the constructor (Optional)
     * @returns {Array<APIObject, Promise>} (Optional) Returns a two-element array when an agrument is included.
     * Index zero is this object, the other is the fill() promise.
     * 
     * @example 
     * // Manga:
     * var [manga, promise] = new Manga(47);
     * promise.then(()=>{
     *  console.log(manga.description);
     * });
     * 
     */
    constructor(id, dontRequest) {
        /**
         * MangaDex ID
         * @type {Number}
         */
        this.id = id;
        
        if (id && !dontRequest) return [this, this.fill(id)];
    }

    /**
     * Loads data from API calls
     * @param {Object} data Information that will override current info
     */
    parse(data) {
        this.id = data.id;
    }

    /**
     * Retrieves information from MangaDex and set this instance's variables.
     * Uses two HTTPS requests
     * @param {Number} id Object's ID (Defaults to this.id)
     * @returns {Promise} Promise resolve argument is this object
     */
    fill(id) {
        return new Promise((resolve, reject) => {
            // Return Empty Promise
            resolve(this);
        });
    }
}

module.exports = APIObject;