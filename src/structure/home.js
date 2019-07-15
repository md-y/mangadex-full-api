const Util = require("../util");
const Manga = require("./manga");

/**
 * Represents the Manga info on MangaDex's homepage
 */
class Home {

    /**
     * @param {Boolean} requestData Automatically call and return fill()?
     */
    constructor(requestData) {
        if (requestData) return this.fill();
    }

    _parse(data) {
        const tabLength = 42;
        const rankingLength = 10;
        const ranges = [0, 
                        tabLength,                      // Newest
                        tabLength + rankingLength,      // Top 6h
                        tabLength + rankingLength * 2,  // Top 24h
                        tabLength + rankingLength * 3,  // Top 7d
                        tabLength + rankingLength * 4,  // Top Follows
                        tabLength + rankingLength * 5]; // Top Rating 

        // Combine manga into one object
        const series = {
            ids: data["ids-pre"].concat(data["ids-mid"], data["ids-post"]),
            titles: data["titles-pre"].concat(data["titles-mid"], data["titles-post"])
        };
        
        const getRange = function() {
            // Remove one remaining range every call
            let min = ranges.splice(0, 1);
            let max = ranges[0];

            let payload = [];
            for (let i = min; i < max; i++) {
                let m = new Manga(series.ids[i]);
                m.title = series.titles[i];
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
                // Each Section Will Be Combined; This is to remove manga from a signed in user (agent):
                // Everything Before Follows (Recently Uploaded)
                "ids-pre": /<a[^>]*href=["']\/title\/(\d+)\/[^"']+["'][^>]*>[^<]+<\/a>(?=[\w\W]+follows_update)/gmi,
                "titles-pre": /<a[^>]*href=["']\/title\/\d+\/[^"']+["'][^>]*>([^<]+)<\/a>(?=[\w\W]+follows_update)/gmi,
                // Recent Ranking (6h, 24h, and a week)
                "ids-mid": /(?![\w\W]+\/stats\/top)<a[^>]*href=["']\/title\/(\d+)\/[^"']+["'][^>]*>[^<]+<\/a>(?=[\w\W]+[Rr]eading.[Hh]istory)/gmi,
                "titles-mid": /(?![\w\W]+\/stats\/top)<a[^>]*href=["']\/title\/\d+\/[^"']+["'][^>]*>([^<]+)<\/a>(?=[\w\W]+[Rr]eading.[Hh]istory)/gmi,
                // After History ("Top Of All Time"s)
                "ids-post": /<a[^>]*href=["']\/title\/(\d+)\/[^"']+["'][^>]*>[^<]+<\/a>(?![\w\W]+top_follows)/gmi, 
                "titles-post": /<a[^>]*href=["']\/title\/\d+\/[^"']+["'][^>]*>([^<]+)<\/a>(?![\w\W]+top_follows)/gmi
            }).then((matches) => {
                this._parse(matches);
                resolve(this);
            }).catch(reject);
        });
    }
}

module.exports = Home;