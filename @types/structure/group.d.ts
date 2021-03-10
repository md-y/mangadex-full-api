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
    leader: any;
    /**
     * Array of members
     * @type {Array<User>}
     */
    members: Array<any>;
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
    url: string;
    flag: string;
    /**
     * Executes Group.search() then executes fill() with the most relevent user.
     * @param {String} query Quicksearch query like a name or description
     */
    fillByQuery(query: string): any;
}
import APIObject = require("./apiobject");
