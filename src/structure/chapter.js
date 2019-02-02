const util = require("../util");
const APIObject = require("./apiobject");

/**
 * Represents a Chapter with pages
 */
class Chapter extends APIObject {
    parse(data) {
        /**
         * MangaDex Chapter ID
         * @type {Number}
         */
        this.id = data.id;

        /**
         * Unix timestamp
         * @type {Number}
         */
        this.timestamp = data.timestamp;

        /**
         * Volume #
         * @type {Number}
         */
        this.volume = data.volume ? parseFloat(data.volume): undefined;

        /**
         * Chapter #
         * @type {Number}
         */
        this.chapter = data.volume ? parseFloat(data.volume): undefined;

        /**
         * Chapter Title. No title == ""
         * @type {String}
         */
        this.title = data.title ? data.title : "";

        /**
         * Chapter translated language code
         * @type {String}
         */
        this.language = data.lang_code ? data.lang_code.toUpperCase(): undefined;

        /**
         * Parent manga ID
         * @type {Number}
         */
        this.parentMangaID = data.manga_id;

        /**
         * IDs of translation groups for this chapter
         * @type {Array<Number>}
         */
        this.groups = [data.group_id, data.group_id_2, data.group_id_3];

        /**
         * Number of comments for this chapter, not manga
         * @type {Number}
         */
        this.commentCount = data.comments;

        /**
         * Longstrip or not?
         * @type {Boolean}
         */
        this.longstrip = data.long_strip == undefined ? undefined : (data.long_strip == 1); // Needs ==undefined to get around 0 == false

        /**
         * Links to each pages. Requires hash, server, and page_array keys from API
         * @type {Array<String>}
         */
        this.pages = undefined;
        if (data.server && data.hash && data.page_array) {
            this.pages = []
            for (let i of data.page_array) this.pages.push(data.server + data.hash + "/" + i);
        }
    }

    fill(id) {
        const api = "https://mangadex.org/api/chapter/"; 
        if (!id) id = this.id;
        else this.id = id;

        return new Promise((resolve, reject) => {
            util.getJSON(api + id.toString(), (json) => {
                this.parse(json);
                resolve(this);
            }).on('error', (err) => {
                reject(err);
            });
        });
    }

    /**
     * Gets full MangaDex HTTPS link. 
     * @param {"id"} property A property in this object 
     * Unknown properties defaults to MangaDex's homepage
     * @returns {String} String with link
     */
    getFullURL(property) {
        const homepage = "https://mangadex.org"
        switch(property) {
            default:
                return homepage;
            case "id":
                return homepage + "/chapter/" + this.id.toString();
        }
    }
}

module.exports = Chapter;