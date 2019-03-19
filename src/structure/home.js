const Util = require("../util");
const Manga = require("./manga");

/**
 * Represents the Manga info on MangaDex's homepage
 */
class Home {

    /**
     * @param {*} requestData Automatically call and return fill()?
     */
    constructor(requestData) {
        if (requestData) return this.fill();
    }

    parse(data) {
        // Newest; Top 6h; Top 24h; Top 7d; Top Follows; Top Rating
        const ranges = [0, 40, 50, 60, 70, 80, 90]

        const getRange = function() {
            // Remove one remaining range every call
            let min = ranges.splice(0, 1);
            let max = ranges[0];

            let payload = [];
            for (let i = min; i < max; i++) {
                let m = new Manga(data.ids[i], true);
                m.title = data.titles[i];
                payload.push(m);
            }
            return payload;
        };

        /**
         * Array of the most recent manga updated (Web Parsing)
         * @type {Array<Manga>}
         */
        this.newest = getRange();

        /**
         * Array of the top manga in the past 6 hours (Web Parsing)
         * @type {Array<Manga>}
         */
        this.top6h = getRange();

        /**
         * Array of the top manga in the past 24 hours (Web Parsing)
         * @type {Array<Manga>}
         */
        this.top24h = getRange();

        /**
         * Array of the top manga in the past week (Web Parsing)
         * @type {Array<Manga>}
         */
        this.top7d = getRange();

        /**
         * Array of the top manga by follows (Web Parsing)
         * @type {Array<Manga>}
         */
        this.topFollows = getRange();

        /**
         * Array of the top manga by rating (Web Parsing)
         * @type {Array<Manga>}
         */
        this.topRating = getRange();
    }

    /**
     * Retrieves information from MangaDex and set this instance's variables.
     * @returns {Promise} Promise resolve argument is this object
     */
    fill() {
        const web = "https://mangadex.org/"; 

        return new Promise((resolve, reject) => {
            Util.getMatches(web, {
                "ids": /<a[^>]*href=["']\/title\/(\d+)\/[^"']+["'][^>]*>[^<]+<\/a>/gmi,
                "titles": /<a[^>]*href=["']\/title\/\d+\/[^"']+["'][^>]*>([^<]+)<\/a>/gmi
            }).then((matches) => {
                this.parse(matches);
                resolve(this);
            }).catch(reject);
        });
    }
}

module.exports = Home;