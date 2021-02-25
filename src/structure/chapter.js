const Util = require("../util");
const APIObject = require("./apiobject");
const Group = require("./group");
const chapterType = require("../enum/chapter-type");

/**
 * Represents a Chapter with pages
 */
class Chapter extends APIObject {
    _parse(data) {
        /**
         * MangaDex Chapter ID
         * @type {Number}
         */
        this.id = data.id;

        /**
         * Type of chapter (delayed, external, etc.)?
         * @type {Number} See chapter-type.js
         */
        this.type = chapterType.internal;
        if (data.status != "OK") this.type = chapterType[data.status];

        /**
         * URL to chapter homepage (AKA the first page)
         * @type {String}
         */
        if (this.id) this.url = "https://mangadex.org/chapter/" + this.id.toString();
        else this.url = undefined;

        /**
         * Applicable link to chapter. It's either the MD Link, Group delayed link, or
         * external link.
         * @type {String}
         */
        this.link = this.url;
        if (this.type == chapterType.delayed) this.link = data.groupWebsite;
        else if (this.type == chapterType.external) this.link = data.pages;

        /**
         * Unix timestamp
         * @type {Number}
         */
        this.timestamp = data.timestamp ? data.timestamp : undefined;

        /**
         * Volume # (0 if unknown)
         * @type {Number}
         */
        this.volume = data.volume && data.volume !== "" ? parseFloat(data.volume): 0;

        /**
         * Chapter # (0 if unknown)
         * @type {Number}
         */
        this.chapter = data.chapter && data.chapter !== "" ? parseFloat(data.chapter): 0;

        /**
         * Chapter Title ("" if no title)
         * @type {String}
         */
        this.title = data.title ? data.title : "";

        /**
         * Chapter translated language code
         * @type {String}
         */
        this.language = data.language ? data.language.toUpperCase(): undefined;

        /**
         * Parent manga ID
         * @type {Number}
         */
        this.parentMangaID = data.mangaId;

        /**
         * IDs of translation groups for this chapter
         * @type {Array<Group>}
         */
        this.groups = [];
        if (data.groups) {
            for (let i of data.groups) {
                let group = new Group(i.id);
                group.title = i.name;
                this.groups.push(group);
            }
        }

        /**
         * Number of comments for this chapter, not manga
         * @type {Number}
         */
        this.commentCount = data.comments;

        /**
         * Links to each pages.
         * @type {Array<String>}
         */
        this.pages = [];
        if (data.server && data.hash && data.pages) {
            this.pages = [];
            if (data.server == "/data/") data.server = "https://mangadex.org/data/"; // Home image server
            for (let i of data.pages) this.pages.push(data.server + data.hash + "/" + i);
        }

        /**
         * Data-saver server version of page URLs. 
         * @type {Array<String>}
         */
        this.saverPages = [];
        if (this.pages instanceof Array) {
            for (let i of this.pages) this.saverPages.push(i.replace("/data/", "/data-saver/"));
        }

        /**
         * Pages using the fallback server. 
         * If there is no fallback, this is the same as the regular pages.
         * Fallback servers are also more unstable, ironically. Be prepared for 404s and 500s.
         * @type {Array<String>}
         */
        this.fallbackPages = this.pages;
        if (this.pages instanceof Array && data.serverFallback && data.serverFallback !== data.server) {
            this.fallbackPages = [];
            if (data.serverFallback == "/data/") data.serverFallback = "https://mangadex.org/data/";
            for (let i of data.pages) this.fallbackPages.push(data.serverFallback + data.hash + "/" + i);
        }

        /**
         * Viewcount for this chapter
         * @type {Number}
         */
        this.views = data.views;

        /**
         * URL to this chapter's language flag
         * @type {String}
         */
        if (this.language) this.flag = "https://mangadex.org/images/flags/" + this.language.toLowerCase() + ".png";
        else this.flag = undefined;
    }

    fill(id) {
        const api = "https://api.mangadex.org/v2/chapter/"; 
        if (!id) id = this.id;
        else this.id = id;

        return new Promise(async (resolve, reject) => {
            if (!id) reject("No id specified or found.");

            // API v2
            let res = await Util.getJSON(api + id.toString());
            if (!res) reject("Invalid API response");
            if (res.status !== "OK") reject("API responsed with an error: " + res.message);

            this._parse(res.data);
            resolve(this);
        });
    }
}

module.exports = Chapter;
