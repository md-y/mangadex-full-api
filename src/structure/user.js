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
         * Viewcount (Web Parsing)
         * @type {String}
         */
        this.views = data.views ? parseInt(data.views.replace(/\D/g, "")) : undefined;

        /**
         * User language code (Web Parsing)
         * @type {String}
         */
        this.language = data.language ? data.language.toUpperCase(): undefined;

        /**
         * HTML-Formatted Biography (Web Parsing)
         * @type {String}
         */
        this.biography = data.biography ? data.biography.replace(/<\s*br\s*\/>/gmi, ""): undefined; // Removes <br />

        /**
         * Number of chapters uploaded (Web Parsing)
         * @type {String}
         */
        this.uploads = data.uploads ? parseInt(data.uploads.replace(/\D/g, "")) : undefined;

        /**
         * Username (Web Parsing)
         * @type {String}
         */
        this.username = data.username;

        /**
         * User Website URL (Web Parsing)
         * @type {Object}
         */
        this.website  = data.website;

        /**
         * Avatar Image URL
         * @type {String}
         */
        this.avatar = data.avatar;
    }

    fill(id) {
        const web = "https://mangadex.org/user/"; 
        if (!id) id = this.id;

        return new Promise((resolve, reject) => {
            if (!id) reject("No id specified or found.");
            Util.getMatches(web + id.toString(), {
                "username": /card-header[\w\W]*?<span[^>]*class=["']mx-1["']>(.+)<\/span>/gmi,
                "language": /<span class=["']mx-1["']>.*?<\/span>\s*?<span[^>]*flag-(\w{2})["']/gmi,
                "views": /title=["']Views["'][\D\s\n]+([\d,]+)<\/li>/gmi,
                "uploads": /title=["']Chapters uploaded["'][\D\s\n]+([\d,]+)<\/li>/gmi,
                "website": /Website:[\d\D\n]+<a href=["']([^<>\s]+)["'].+>[^\s]+<\/a><\/div>/gmi,
                "biography": /Biography:<\/div>\s*<div class=["'].+["']>([\w\W\n]+)<\/div>\s{1,2}<\/div.+\s.+\s.+Actions:/gmi,
                "avatar": /alt=["']Avatar["'] src=["']([^"']+)["']/gmi
            }).then((matches) => {
                this._parse({...matches, id: id});
                resolve(this);
            }).catch(reject);
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