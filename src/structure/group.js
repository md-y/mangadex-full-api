const APIObject = require("./apiobject");
const Util = require("../util");
const User = require("./user");

/**
 * Represents a MangaDex translation group
 */
class Group extends APIObject {
    _parse(data) {
        /**
         * MangaDex Group ID
         * @type {Number}
         */
        this.id = data.id;

        /**
         * Viewcount
         * @type {String}
         */
        this.views = data.views;

        /**
         * Group language code
         * @type {String}
         */
        this.language = data.language ? data.language.toUpperCase(): undefined;

        /**
         * Group description
         * @type {String}
         */
        this.description = data.description;

        /**
         * Followers
         * @type {String}
         */
        this.followers = data.follows;

        /**
         * Number of chapters uploaded
         * @type {String}
         */
        this.uploads = data.chapters;

        /**
         * Official Group Name
         * @type {String}
         */
        this.title = data.name;

        /**
         * Official Group Links
         * Website, Discord, IRC, and Email
         * @type {Object}
         */
        this.links = {};
        if (data.website) this.links.website = data.website;
        if (data.discord) this.links.discord = data.discord;
        if (data.ircServer) this.links.ircServer = data.ircServer;
        if (data.ircChannel) this.links.ircChannel = data.ircChannel;
        if(data.email) this.links.email = data.email;

        /**
         * Leader User Object
         * Contains ID only, use fill() for full data.
         * @type {User}
         */
        this.leader = undefined;
        if (data.leader) {
            let user = new User(data.leader.id);
            user.username = data.leader.name;
            this.leader = user;
        }

        /**
         * Array of members
         * @type {Array<User>}
         */
        this.members = [];
        if (data.members) {
            for (let i of data.members) {
                let user = new User(i.id);
                user.username = i.name;
                this.members.push(user);
            }
        }

        /**
         * Foundation Date
         * @type {String}
         */
        this.founded = data.founded;

        /**
         * Locked?
         * @type {Boolean}
         */
        this.locked = data.isLocked !== undefined ? data.isLocked : undefined;

        /**
         * Inactive?
         * @type {Boolean}
         */
        this.inactive = data.isInactive !== undefined ? data.isInactive : undefined;

        /**
         * Group Delay in Seconds
         * @type {Number}
         */
        this.delay = data.delay;

        /**
         * Banner URL
         * @type {String}
         */
        this.banner = data.banner ? data.banner : "https://mangadex.org/images/groups/default.png";

        /**
         * URL to group homepage
         * @type {String}
         */
        if (this.id) this.url = "https://mangadex.org/group/" + this.id.toString();
        else this.url = undefined;

        /**
         * URL to this group's language flag
         * @type {String}
         */
        if (this.language) this.flag = "https://mangadex.org/images/flags/" + this.language.toLowerCase() + ".png";
        else this.flag = undefined;
    }

    fill(id) {
        const web = "https://api.mangadex.org/v2/group/"; 
        if (!id) id = this.id;

        return new Promise(async (resolve, reject) => {
            if (!id) reject("No id specified or found.");

            // API v2
            let res = await Util.getJSON(web + id.toString());
            if (!res) reject("Invalid API response");
            if (res.status !== "OK") reject("API responsed with an error: " + res.message);

            this._parse(res.data);
            resolve(this);
        });
    }

    /**
     * Executes Group.search() then executes fill() with the most relevent user.
     * @param {String} query Quicksearch query like a name or description
     */
    fillByQuery(query) {
        return new Promise((resolve, reject) => {
            Group.search(query).then((res)=>{
                if (res.length == 0) reject("No Group Found"); 
                else this.fill(parseInt(res[0])).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    /**
     * MangaDex group quicksearch
     * @param {String} query Quicksearch query like a name or description
     */
    static search(query) {
        const regex = /<td><a href=["']\/group\/(\d+)\/[^"'\/<>]+["']>/gmi;
        return Util.quickSearch(query, regex);
    }
}

module.exports = Group;