'use strict'

class Relationship {
    static types = {};
    
    constructor(data) {
        /**
         * Id of the object this is a relationship to
         * @type {String}
         */
        this.id = data.id;

        /**
         * The type of the object this is a relationship to
         * @type {String}
         */
        this.type = data.type;
    }

    /**
     * Returns the proper and complete object representation (Manga, Author, etc) of this relationship.
     * For example, it calls Manga.get() for manga relationships
     * @param {Object} data 
     * @returns {Promise<Manga|Author|Chapter>}
     */
    resolve() {
        // Promise resolve is res to avoid confusion with this function's name
        return new Promise((res, reject) => {
            if (this.id === undefined || this.type === undefined) reject(new Error('Invalid Relationship object'));
            if (!(this.type in Relationship.types)) reject(new Error(`Relationship type ${this.type} is not registered. Please fix index.js`));
            res(Relationship.types[this.type].get(this.id));
        });
    }

    /**
     * Returns an array of Relationship objects from a Mangadex Relationships Array
     * @param {String} type 
     * @param {Object[]} dataArray 
     * @returns {Relationship[]}
     */
    static convertType(type, dataArray) {
        if (!(dataArray instanceof Array)) return [];
        return dataArray.filter(elem => elem.type === type).map(elem => new Relationship(elem));
    }

    /**
     * Provides a constructor for a relationship type at run-time.
     * Should only be called in index.js
     * @param {String} name 
     * @param {Object} classObject 
     */
    static registerType(name, classObject) {
        if (name in Relationship.types) return;
        if (!('get' in classObject)) throw new Error(`Attempted to register a class object with no 'get' method`);
        Relationship.types[name] = classObject;
    }
}

exports = module.exports = Relationship;