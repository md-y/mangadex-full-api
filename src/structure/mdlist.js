const APIObject = require("./apiobject");
const Util = require("../util");
const Manga = require("./manga");

const MANGA_PER_PAGE = 40;

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

        // Yes I know manga is plural for multiple
        // manga, but this negates variable confusion.
        let mangas = [];
        for (let i in data.manga) {
            let m = new Manga(data.manga[i]);
            m.title = data.title[i];
            mangas.push(m);
        }

        /**
         * All mangas in the user's mdlist. 
         * They are parts, meaning the must be filled().
         * @type {Array<Manga>}
         */
        this.manga = mangas;

        /**
         * Partial banner image url. Use getFullURL();
         * @type {String}
         */
        this.banner = data.banner;

        /**
         * Number of pages in the MDList
         * @type {Number}
         */
        this.pages = Math.ceil(data.total / MANGA_PER_PAGE);
    }

    /**
     * @param {Number} pages How many pages to read? Default: 1
     */
    fill(id, pages) {
        const web = "https://mangadex.org/list/"; 
        if (!id) id = this.id;
        if (!pages) pages = 1;

        return new Promise((resolve, reject) => {
            if (!id) reject("No id specified or found.");
            let completed = 0;

            let titles = [];
            let mangas = [];
            let banner, total;

            // i is 1 (inclusive) to pages (inclusive)
            for (let i = 1; i <= pages; i++) {
                Util.getMatches(web + id.toString() + "/0/0/" + i.toString(), {
                    "title": /<a.+class=["'][^"']+manga_title[^"']+["'].+title="(.+?)".+>/gmi,
                    "manga": /<a.+class=["'][^"']+manga_title[^"']+["'].+href=["']\/title\/(\d+)\/.+["'].+>/gmi,
                    "banner": /<img.+alt=["']Banner["'].+src=["']([^"']+)["'].+>/gmi,
                    "total": /\d+ to \d+ of (\d+) titles/gmi
                }).then((matches) => {
                    if (matches.title) titles = titles.concat(matches.title);
                    if (matches.manga) mangas = mangas.concat(matches.manga);
                    if (matches.total && !total) total = matches.total;
                    if (matches.banner && !banner) banner = matches.banner;
                    completed++;

                    if (completed >= pages) {
                        if (!banner && !total && mangas.length == 0) reject("Unable to parse MDList. Do you have permission?");
                        this._parse({title: titles, manga: mangas, id: id, banner: banner, total: total});
                        resolve(this);
                    } 
                }).catch(reject);
            }
        });
    }

    /**
     * Requests a MDList from a user account.
     * @param {User} user MangaDex User Object
     */
    fillByUser(user, pages) {
        return this.fill(user.id, pages);
    }

    /**
     * Retrieves and returns the number of pages for a MDList,
     * and sets the pages field.
     */
    static getNumberOfPages(id) {
        const web = "https://mangadex.org/list/"; 

        return new Promise((resolve, reject) => {
            if (!id) reject("No id specified.");
            Util.getMatches(web + id.toString(), {
                "total": /\d+ to \d+ of (\d+) titles/gmi
            }).then((matches) => {
                if (!matches.total) reject("Unable to parse MDList. Do you have permission?");
                let pages = Math.ceil(matches.total / MANGA_PER_PAGE);
                this.pages = pages;
                resolve(pages);
            }).catch(reject);
        });
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
                return homepage + this.banner;
        }
    }
}

module.exports = MDList;