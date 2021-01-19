const APIObject = require("./apiobject");
const Util = require("../util");

/**
 * Represents a MangaDex user
 */
class User extends APIObject {
    _parse(data) {
        /**
         * MangaDex User ID
         * @type {Number}
         */
        this.id = data.id;

        /**
         * Viewcount
         * @type {String}
         */
        this.views = data.views;

        /**
         * Markdown-Formatted Biography
         * @type {String}
         */
        this.biography = data.biography;

        /**
         * Username 
         * @type {String}
         */
        this.username = data.username;

        /**
         * User Website URL
         * @type {Object}
         */
        this.website  = data.website;

        /**
         * Avatar Image URL
         * @type {String}
         */
        this.avatar = data.avatar !== null ? data.avatar : "https://mangadex.org/images/avatars/default1.jpg";

        /**
         * Level ID (Adminstrator, Moderator, etc)
         * @type {Number}
         */
        this.levelId = data.levelId;

        /**
         * Last Seen Timestamp
         * @type {Number}
         */
        this.timeLastSeen = data.lastSeen;

        /**
         * Joined Timestamp
         * @type {Number}
         */
        this.timeJoined = data.joined;

        /**
         * Number of Chapters Uploaded
         * @type {Number}
         */
        this.uploads = data.uploads;

        /**
         * Premium Account?
         * @type {Boolean}
         */
        this.premium = data.premium;

        /**
         * Mangadex @ Home Contributor?
         * @type {Boolean}
         */
        this.mdAtHome = data.mdAtHome;
        if (this.mdAtHome !== undefined) this.mdAtHome = this.mdAtHome === 1;
    }

    fill(id) {
        const api = "https://api.mangadex.org/v2/user/"; 
        if (!id) id = this.id;

        return new Promise(async (resolve, reject) => {
            if (!id) reject("No id specified or found.");
            
            // API v2
            let res = await Util.getJSON(api + id.toString());
            if (!res) reject("Invalid API response");
            if (res.status !== "OK") reject("API responsed with an error: " + data.message);

            this._parse(res.data);
            resolve(this);
        });
    }

    /**
     * Executes User.search() then executes fill() with the most relevent user.
     * @param {String} query Quicksearch query like a name or description
     */
    fillByQuery(query) {
        return new Promise((resolve, reject) => {
            User.search(query).then((res)=>{
                if (res.length == 0) reject("No User Found"); 
                else this.fill(parseInt(res[0])).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    /**
     * Gets full MangaDex HTTPS link. 
     * @param {"id"|"avatar"|"flag"} property A property in this object
     * Unknown properties defaults to MangaDex's homepage
     * @returns {String} String with link
     */
    getFullURL(property) {
        const homepage = "https://mangadex.org";
        switch(property) {
            default:
                return homepage;
            case "id":
                return homepage + "/user/" + this.id.toString();
            case "avatar":
                return homepage + "/images/avatars/" + this.id.toString() + ".png";
            case "flag":
                return homepage + "/images/flags/" + this.language.toLowerCase() + ".png";
        }
    }

    /**
     * MangaDex user quicksearch
     * @param {String} query Quicksearch query like a name or description
     */
    static search(query) {
        const regex = /<td><a class=["']user[\w\W]{0,100}href=["']\/user\/(\d+)\/[^"'\/<>]+["']>/gmi;
        return Util.quickSearch(query, regex);
    }
}

module.exports = User;