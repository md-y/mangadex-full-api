const APIObject = require("./apiobject");
const Util = require("../util");
const Manga = require("./manga");
const listOrder = require("../enum/listing-order");
const viewingCategory = require("../enum/viewing-categories");

/**
 * Represents a MangaDex MDList
 */
class MDList extends APIObject {
    _parse(data) {
        /**
         * MangaDex MDList ID
         * @type {Number}
         */
        this.id = data.id;

        /**
         * Partial banner image url. Use getFullURL();
         * @type {String}
         */
        this.banner = data.banner;

        /**
         * List of manga, sorted by what was called with fill().
         * @type {Array<Manga>}
         */
        this.manga = [];
        for (let i in data.manga) {
            let m = new Manga(data.manga[i]);
            if (data.titles.length >= data.manga.length) m.title = data.titles[i];
            this.manga.push(m);
        }
    }

    /**
     * @param {Number|String} order Order of the list, specified by the enum 'listingOrder.'
     * @param {Number} category Mangadex follow category. Default: All. See enum 'viewingCategories'
     */
    fill(id, order = 0, category = viewingCategory.ALL) {
        if (!id) id = this.id;

        if (typeof order === "string") {
            if (order in listOrder) order = listOrder[order];
            else order = 0;
        }
        if (!(category in Object.values(viewingCategory))) category = 0;

        return new Promise(async (resolve, reject) => {
            if (!id) reject("No id specified or found.");
            const web = `https://mangadex.org/list/${id}/${category}/${order}/`;

            let matchObject = {
                "titles": /<a[^>]*class="[^"]*manga_title[^"]*"[^>]*>([^<]*)</gmi,
                "manga": /<a[^>]*href=["']\/title\/(\d+)\/[^>]*["'][^>]*>/gmi
            };

            // Initial Call
            let initalMatches = await Util.getMatches(web + "1", {
                ...matchObject,
                "page": /\d+ to (\d+) of \d+ titles/gmi,
                "total": /\d+ to \d+ of (\d+) titles/gmi,
                "banner": /<img[^>]*alt=["']Banner["'][^>]*src=["']([^"']+)["'][^>]*>/gmi
            });

            let banner = initalMatches.banner;
            if (initalMatches.banner instanceof Array) banner = banner[0];

            let total = parseFloat(initalMatches.total);
            // Lists with 1 page dont have the "x out of x etc", so assume 1 page
            let pages = 1;
            if (initalMatches.page && initalMatches.total) pages = Math.ceil(total / parseFloat(initalMatches.page));

            if (!initalMatches.titles || !initalMatches.manga) reject("Could not find manga details.");
            let totalTitles = initalMatches.titles;
            let totalManga = initalMatches.manga;

            // Remove Tutorial
            if (totalManga[0] == "30461") totalManga.splice(0, 1);
            
            // Skip first page (already called above)
            for (let page = 2; page <= pages; page++) {
                let matches = await Util.getMatches(web + page.toString(), matchObject);
                if (!matches.titles || !matches.manga) continue;

                // Remove Tutorial
                if (matches.manga[0] == "30461") matches.manga.splice(0, 1);

                totalManga = totalManga.concat(matches.manga);
                totalTitles = totalTitles.concat(matches.titles);
            }

            // Convert strings to ints (or floats because js is weird)
            totalManga = totalManga.map(parseFloat);
            // and remove duplicates (because there are extra matches)
            totalManga = totalManga.filter((elem, i, arr) => {
                // If elem occurs before index i, filter it out. 
                return !arr.slice(i + 1).includes(elem);
            });
            
            this._parse({
                id: id,
                banner: banner,
                titles: totalTitles,
                manga: totalManga
            });
            resolve(this);
        });
    }

    /**
     * Requests a MDList from a user account.
     * @param {User} user MangaDex User Object
     * @param {Number|String} order The list order (enum/listing-order)
     * @param {Number} category Mangadex follow category. Default: All. See enum 'viewingCategories'
     */
    fillByUser(user, order, category) {
        return this.fill(user.id, order, category);
    }

    /**
     * Gets full MangaDex HTTPS link. 
     * @param {"id"|"banner"} property A property in this object
     * Unknown properties defaults to MangaDex's homepage
     * @returns {String} String with link
     */
    getFullURL(property) {
        const homepage = "https://mangadex.org";
        switch(property) {
            default:
                return homepage;
            case "id":
                return homepage + "/list/" + this.id.toString();
            case "banner":
                return this.banner;
        }
    }
}

module.exports = MDList;