export = Group;
/**
 * Represents a MangaDex translation group
 */
declare class Group extends APIObject {
    /**
     * MangaDex group quicksearch
     * @param {String} query Quicksearch query like a name or description
     */
    static search(query: string): Promise<any>;
    constructor(id: number, request?: boolean, extraArg?: any);
    /**
     * Viewcount
     * @type {String}
     */
    views: string;
    /**
     * Group language code
     * @type {String}
     */
    language: string;
    /**
     * Group description
     * @type {String}
     */
    description: string;
    /**
     * Followers
     * @type {String}
     */
    followers: string;
    /**
     * Number of chapters uploaded
     * @type {String}
     */
    uploads: string;
    /**
     * Official Group Name
     * @type {String}
     */
    title: string;
    /**
     * Official Group Links
     * Website, Discord, IRC, and Email
     * @type {Object}
     */
    links: any;
    /**
     * Leader User Object
     * Contains ID only, use fill() for full data.
     * @type {User}
     */
    leader: User;
    /**
     * Array of members
     * @type {Array<User>}
     */
    members: Array<User>;
    /**
     * Foundation Date
     * @type {String}
     */
    founded: string;
    /**
     * Locked?
     * @type {Boolean}
     */
    locked: boolean;
    /**
     * Inactive?
     * @type {Boolean}
     */
    inactive: boolean;
    /**
     * Group Delay in Seconds
     * @type {Number}
     */
    delay: number;
    /**
     * Banner URL
     * @type {String}
     */
    banner: string;
    /**
     * Executes Group.search() then executes fill() with the most relevent user.
     * @param {String} query Quicksearch query like a name or description
     */
    fillByQuery(query: string): any;
    /**
     * Gets full MangaDex HTTPS link.
     * @param {"id"|"flag"} property A property in this object
     * Unknown properties defaults to MangaDex's homepage
     * @returns {String} String with link
     */
    getFullURL(property: "id" | "flag"): string;
}
import APIObject = require("./apiobject");
import User = require("./user");
