'use strict';

/**
 * Represents the links that represent manga on different websites
 * https://api.mangadex.org/docs.html#section/Static-data/Manga-links-data
 */
class Links {
    /**
     * @param {Object.<string, string>} linksObject 
     */
    constructor(linksObject) {
        if (!linksObject) {
            this.availableLinks = [];
            return;
        }

        /**
         * Anilist (https://anilist.co) link to manga
         * @type {String} URL
         */
        this.al = !linksObject.al ? undefined : `https://anilist.co/manga/${linksObject.al}`;

        /**
         * AnimePlanet (https://anime-planet.com) link to manga
         * @type {String} URL
         */
        this.ap = !linksObject.ap ? undefined : `https://www.anime-planet.com/manga/${linksObject.ap}`;

        /**
         * Bookwalker (https://bookwalker.jp/) link to manga
         * @type {String} URL
         */
        this.bw = !linksObject.bw ? undefined : `https://bookwalker.jp/${linksObject.bw}`;

        /**
         * Mangaupdates (https://mangaupdates.com) link to manga
         * @type {String} URL
         */
        this.mu = !linksObject.mu ? undefined : `https://www.mangaupdates.com/series.html?id=${linksObject.mu}`;

        /**
         * Novelupdates (https://novelupdates.com) link to manga
         * @type {String} URL
         */
        this.nu = !linksObject.nu ? undefined : `https://www.novelupdates.com/series/${linksObject.nu}`;

        /**
         * MyAnimeList (https://myanimelist.net) link to manga
         * @type {String} URL
         */
        this.mal = !linksObject.mal ? undefined : `https://myanimelist.net/manga/${linksObject.mal}`;

        /**
         * Kitsu (https://kitsu.io) link to manga
         * @type {String} URL
         */
        this.kt = undefined; // Set to undefined by default, but if it isn't, change it in the following lines
        if (linksObject.kt !== undefined) {
            // Stored as either a number or slug. See official documentaion
            if (isNaN(linksObject.kt)) this.kit = `https://kitsu.io/api/edge/manga?filter[slug]=${linksObject.kt}`;
            else this.kt = `https://kitsu.io/api/edge/manga/${linksObject.kt}`;
        }

        /**
         * Amazon (https://amazon.com) link to manga
         * @type {String} URL
         */
        this.amz = linksObject.amz;

        /**
         * EBookJapan (https://ebookjapan.yahoo.co.jp) link to manga
         * @type {String} URL
         */
        this.ebj = linksObject.ebj;

        /**
         * Link to manga raws
         * @type {String} URL
         */
        this.raw = linksObject.raw;

        /**
         * Link to offical english manga translation
         * @type {String} URL
         */
        this.engtl = linksObject.engtl;

        /**
         * CDJapan (https://www.cdjapan.co.jp/) link to manga
         * @type {String} URL
         */
        this.cdj = linksObject.cdj;

        /**
         * All of the links that have valid values
         * @type {String[]}
         */
        this.availableLinks = Object.keys(linksObject);
    }
}

exports = module.exports = Links;