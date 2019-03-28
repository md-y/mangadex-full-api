const Util = require("../util");
const Chapter = require("./chapter");
const genre = require("../enum/genre");
const link = require("../enum/link");
const APIObject = require("./apiobject");

/**
 * Represents a Manga with all information on a Manga's homepage
 */
class Manga extends APIObject {
    parse(data) {
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
                c.parse(chapterObject);
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
         * Bayesian Rating (Web Parsing)
         * @type {String}
         */
        this.rating = data.rating ? parseFloat(data.rating) : undefined;

        /**
         * Alternate Titles (Web Parsing)
         * @type {Array<String>}
         */
        this.altTitles = undefined;
        if (data.altTitles) {
            this.altTitles = [];
            for (let i of data.altTitles) this.altTitles.push(decodeURI(i));
        }
    }

    fill(id) {
        const jsonAPI = "https://mangadex.org/api/manga/"; 
        const web = "https://mangadex.org/title/"

        if (!id) id = this.id;
        let last = false; // Flag to trigger resolve()
        let obj = {};

        const finish = function(manga, resolve) {
            // Only execute when both requests have responded
            if (last) {
                manga.parse(obj);
                resolve(manga);
            } else last = true;
        } 

        return new Promise((resolve, reject) => {
            Util.getJSON(jsonAPI + id.toString()).then((json) => {
                obj = {...obj, ...json, id: id};
                finish(this, resolve);
            }).catch(reject);

            Util.getMatches(web + id.toString(), {
                "views": /title=["']views["']\D+(\d[\d,.]+)<\/li>/gmi,
                "rating": /title=["']Bayesian rating["']\D+(\d[\d,.]+)/gmi,
                "altTitles": /<li [^>]+><span[^>]+fa-book[\s"'][^>]+><\/span>([^<]+)<\/li>/gmi
            }).then((matches) => {
                obj = {...obj, ...matches};
                finish(this, resolve);
            }).catch(reject);;
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
     * Gets full MangaDex HTTPS link. 
     * @param {"cover"|"id"} property A property in this object
     * Unknown properties defaults to MangaDex's homepage
     * @returns {String} String with link
     */
    getFullURL(property) {
        const homepage = "https://mangadex.org"
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
        for (let i of this.genres) payload.push(genre[i])
        return payload;
    }

    /**
     * MangaDex quicksearch
     * @param {String} query Quicksearch query like a name or description
     */
    static search(query) {
        const regex = /<a.+href=["']\/title\/(\d+)\/\S+["'].+class=["'].+manga_title.+["']>.+<\/a>/gmi;
        return Util.quickSearch(query, regex);
    }
}

module.exports = Manga;