const Util = require("../util");
const Chapter = require("./chapter");
const genre = require("../enum/genre");
const link = require("../enum/link");
const APIObject = require("./apiobject");

// Full Search
const langs = require("../enum/language");
const sLangs = require("../enum/searchable-langs");
const demographics = require("../enum/demographic");
const pubstatus = require("../enum/pubstatus");
const searchOrder = require("../enum/listing-order");

/**
 * Represents a Manga with all information on a Manga's homepage
 */
class Manga extends APIObject {
    _parse(data) {
        /**
         * MangaDex Manga ID
         * @type {Number}
         */
        this.id = data.id;

        /**
         * Main title for a manga
         * @type {String}
         */
        this.title = data.manga.title;

        /**
         * Current cover.
         * Partial URL (ex "images/manga/47.png?1545745341"). Use getFullURL to get full url.
         * @type {String}
         */
        this.cover = data.manga.cover_url;

        /**
         * Original (published) manga language code
         * @type {String}
         */
        this.language = data.manga.lang_flag ? data.manga.lang_flag.toUpperCase(): undefined;

        /**
         * Array of the manga's genres
         * @type {Array<Number>}
         */
        this.genres = data.manga.genres;

        /**
         * Artist(s) name(s)
         * @type {Array<String>}
         */
        this.artists = data.manga.artist ? data.manga.artist.split(", ") : [];

        /**
         * Author(s) name(s)
         * @type {Array<String>}
         */
        this.authors = data.manga.author ? data.manga.author.split(", ") : [];

        /**
         * Hentai or not?
         * @type {Boolean}
         */
        this.hentai = data.manga.hentai == undefined ? undefined : (data.manga.hentai == 1); // Needs ==undefined to get around 0 == false

        /**
         * MangaDex description. 
         * Formatted for HTML
         * @type {String}
         */
        this.description = data.manga.description;

        /**
         * Links to manga information on other sites.
         * Replaces raw values with enum/link when available, but still uses MangaDex keys.
         * @type {Array<String>}
         */
        this.links = data.manga.links;
        if (this.links) for (let i in this.links) if (link[i]) this.links[i] = link[i].prefix + this.links[i];

        /**
         * Basic information about each chapter in this manga. 
         * Call fill() on each of these to request more info.
         * @type {Array<Chapter>}
         */
        this.chapters = undefined;
        if (data.chapter) {
            this.chapters = [];
            for (let i in data.chapter) {
                // Simulate api/chapter return object
                let chapterObject = data.chapter[i];
                chapterObject.manga_id = this.id;
                chapterObject.id = parseInt(i);

                // Create chapter object
                let c = new Chapter();
                c._parse(chapterObject);
                this.chapters.push(c);
            }
            this.chapters.reverse(); // Fix Order
        }

        /**
         * Viewcount (Web Parsing)
         * @type {String}
         */
        this.views = data.views ? parseInt(data.views.replace(/\D/g, "")) : undefined;

        /**
         * Bayesian Rating
         * @type {String}
         */
        // Parse float is needed because MD returns ratings as strings for some reason.
        this.rating = data.manga.rating.bayesian ? parseFloat(data.manga.rating.bayesian) : undefined;

        /**
         * Mean Rating
         * @type {String}
         */
        this.ratingMean = data.manga.rating.mean ? parseFloat(data.manga.rating.mean) : undefined;

        /**
         * Number of Users who have Rated
         * @type {String}
         */
        this.ratingUserCount = data.manga.rating.users ? parseFloat(data.manga.rating.users) : undefined;

        /**
         * Alternate Titles (Web Parsing)
         * @type {Array<String>}
         */
        this.altTitles = undefined;
        if (data.altTitles) {
            this.altTitles = [];
            for (let i of data.altTitles) this.altTitles.push(decodeURI(i));
        }

        /**
         * URL to manga homepage
         * @type {String}
         */
        if (this.id) this.url = "https://mangadex.org/title/" + this.id;
        else this.url = undefined;
    }

    fill(id) {
        const jsonAPI = "https://mangadex.org/api/manga/"; 
        const web = "https://mangadex.org/title/";

        if (!id) id = this.id;
        let last = false; // Flag to trigger resolve()
        let obj = {};

        const finish = function(manga, resolve) {
            // Only execute when both requests have responded
            if (last) {
                manga._parse(obj);
                resolve(manga);
            } else last = true;
        };

        return new Promise((resolve, reject) => {
            if (!id) reject("No id specified or found.");
            Util.getJSON(jsonAPI + id.toString()).then((json) => {
                obj = {...obj, ...json, id: id};
                finish(this, resolve);
            }).catch(reject);

            Util.getMatches(web + id.toString(), {
                "views": /title=["']views["']\D+(\d[\d,.]+)<\/li>/gmi,
                "altTitles": /<li [^>]*><span[^>]*fa-book[\s"'][^>]*><\/span>([^<]+)<\/li>/gmi
            }).then((matches) => {
                obj = {...obj, ...matches};
                finish(this, resolve);
            }).catch(reject);
        });
    }

    /**
     * Executes Manga.search() then executes fill() with the most relevent manga.
     * @param {String} query Quicksearch query like a name or description
     */
    fillByQuery(query) {
        return new Promise((resolve, reject) => {
            Manga.search(query).then((res)=>{
                if (res.length == 0) reject("No Manga Found"); 
                else this.fill(parseInt(res[0])).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    /**
     * Executes Manga.fullSearch() then executes fill() with the most relevent manga.
     * @param {Object} searchObj 
     */
    fillByFullQuery(searchObj) {
        return new Promise((resolve, reject) => {
            Manga.fullSearch(searchObj).then((res) => {
                if (res.length == 0) reject("No Manga Found");
                else this.fill(res[0].id).then(resolve).catch(reject);
            });
        });
    }

    /**
     * Gets full MangaDex HTTPS link. 
     * @param {"cover"|"id"|"flag"} property A property in this object
     * Unknown properties defaults to MangaDex's homepage
     * @returns {String} String with link
     */
    getFullURL(property) {
        const homepage = "https://mangadex.org";
        switch(property) {
            default:
                return homepage;
            case "cover":
                return homepage + this.cover;
            case "id":
                return homepage + "/manga/" + this.id.toString();
            case "flag":
                return homepage + "/images/flags/" + this.language.toLowerCase() + ".png";
        }
    }

    /**
     * Array of genre names instead of IDs. Uses /enum/genre
     * @type {Array<String>}
     */
    get genreNames() {
        let payload = [];
        for (let i of this.genres) payload.push(genre[i]);
        return payload;
    }

    /**
     * MangaDex quicksearch
     * @param {String} query Quicksearch query like a name or description
     */
    static search(query) {
        const regex = /<a[^>]*href=["']\/title\/(\d+)\/\S+["'][^>]*manga_title[^>]*>/gmi;
        return Util.quickSearch(query, regex);
    }
    
    /**
     * MangaDex full search, not quicksearch
     * @param {Object} searchObj An object containing search parameters.
     * @example Search object example
     *  fullSearch({
     *      title: "Sangatsu no Lion",
     *      author: "Umino Chica",
     *      artist: "Umino Chica",
     *      demographic: [1, 2, 3, "Josei"], // You can use strings too
     *      pubstatus: [1, 2, 3, 4],
     *      language: "JP", // Original Language
     *      excludeAll: false, // True = AND mode; False = OR Mode
     *      includeAll: true, // Same as above
     *      includeTags: [4, 5, "Romance"],
     *      excludeTags: [50],
     *      order: "Rating (Des)" // Number or string; Des = starts with highest rated
     *  });
     */
    static fullSearch(searchObj) {
        return new Promise((resolve, reject) => {
            let url = "https://mangadex.org/search?";

            if ("title" in searchObj) url += "title=" + encodeURIComponent(searchObj.title) + "&";
            if ("author" in searchObj) url += "author=" + encodeURIComponent(searchObj.author) + "&"; 
            if ("artist" in searchObj) url += "artist=" + encodeURIComponent(searchObj.artist) + "&"; 

            if ("demographic" in searchObj) {
                let demos = Util.parseEnumArray(demographics, searchObj.demographic);
                url += "demos=" + demos.join(",") + "&";
            }

            if ("pubstatus" in searchObj) {
                let statuses = Util.parseEnumArray(pubstatus, searchObj.pubstatus);
                url += "statuses=" + statuses.join(",") + "&";
            }

            if ("language" in searchObj) {
                let langId = 0;
                if (typeof searchObj.language === 'string') {
                    if (searchObj.language.length == 2 && searchObj.language in sLangs) langId = sLangs[searchObj.language];
                    else {
                        let langCode = Util.getKeyByValue(langs, searchObj.language);
                        if (langCode in sLangs) langId = sLangs[langCode];
                    }
                } else if (typeof searchObj.language === "number") langId = searchObj.language;
                url += "lang_id=" + langId + "&";
            }

            // Default is to not exclude all, so ignore if false/undefined
            if (searchObj.excludeAll) url += "tag_mode_exc=all&";
            // Default is to include all, so ignore only if false
            if (searchObj.includeAll === false) url += "tag_mode_inc=any&";

            // Include and Exlude tags/genres
            let tags = [];
            if ("includeTags" in searchObj) {
                tags = Util.parseEnumArray(genre, searchObj.includeTags);
            }
            if ("excludeTags" in searchObj) {
                let exTags = Util.parseEnumArray(genre, searchObj.excludeTags);
                for (let i of exTags) tags.push("-" + i.toString());
            }
            if (tags.length > 0) url += "tags=" + tags.join(",") + "&";

            if ("order" in searchObj) {
                let sOrder = 0;
                if (typeof searchObj.order === "string" && searchObj.order in searchOrder) {
                    sOrder = searchOrder[searchObj.order];
                } else if (typeof searchObj.order === "number") sOrder = searchObj.order;
                url += "s=" + sOrder; // Last append, so no '&'
            }
            
            if (url.endsWith("&")) url = url.substr(0, url.length - 1);

            Util.getMatches(url, {
                "id": /<a[^>]*href=["']\/title\/(\d+)\/\S+["'][^>]*>[^<]+/gmi,
                "title": /<a[^>]*href=["']\/title\/\d+\/\S+["'][^>]*>([^<]+)/gmi
            }).then((matches) => {
                if (!matches.id) resolve([]);
                
                let results = [];
                for (let i in matches.id) {
                    let m = new Manga(matches.id[i]);
                    m.title = matches.title[i];
                    results.push(m);
                }
                resolve(results);
            }).catch(reject);
        });
    }
}

module.exports = Manga;