'use strict';

/**
 * Represents a relationship from one Mangadex object to another such as a manga, author, etc via its id.
 */
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
     * This function must be called to return the proper and complete object representation of this relationship.
     * Essentially, it calls and returns Manga.get(), Author.get(), Cover.get(), etc.
     * @returns {Promise<Manga|Author|Chapter|User|Group|List|Cover>}
     */
    resolve() {
        if (this.id === undefined || this.type === undefined) throw new Error('Invalid Relationship object');
        if (!(this.type in Relationship.types)) throw new Error(`Relationship type ${this.type} is not registered. Please fix index.js`);
        return Relationship.types[this.type].get(this.id);
    }

    /**
     * Returns an array of converted objects from a Mangadex Relationships Array
     * @private
     * @param {String} type 
     * @param {Object[]} dataArray 
     * @param {Object} caller
     * @returns {Object[]}
     */
    static convertType(type, dataArray, caller) {
        if (!(dataArray instanceof Array)) return [];
        let classObject = Relationship.types[type];
        let relationshipArray = dataArray;
        if (caller && typeof caller.id === 'string') Object.keys(Relationship.types).some(key => {
            let isType = caller instanceof Relationship.types[key];
            if (isType) relationshipArray.push({ id: caller.id, type: key });
            return isType;
        });
        return dataArray.filter(elem => elem.type === type).map(elem => {
            if ('attributes' in elem) {
                let obj = new classObject({ data: elem, relationships: relationshipArray });
                obj.resolve = () => {
                    return Promise.resolve(obj);
                };
                return obj;
            }
            else return new Relationship(elem);
        });
    }

    /**
     * Provides a constructor for a relationship type at run-time.
     * Should only be called in index.js
     * @private
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