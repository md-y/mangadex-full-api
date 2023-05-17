/**
 * A simple record object representing links to manga on different websites.
 * Websites are the keys, and the values are full urls (when available).
 */
class Links {
    /**
     * Anilist (https://anilist.co) link to manga
     */
    anilist?: string;
    /**
     * AnimePlanet (https://anime-planet.com) link to manga
     */
    animePlanet?: string;
    /**
     * Bookwalker (https://bookwalker.jp/) link to manga
     */
    bookWalker?: string;
    /**
     * Mangaupdates (https://mangaupdates.com) link to manga
     */
    mangaUpdates?: string;
    /**
     * Novelupdates (https://novelupdates.com) link to manga
     */
    novelUpdates?: string;
    /**
     * MyAnimeList (https://myanimelist.net) link to manga
     */
    myAnimeList?: string;
    /**
     * Kitsu (https://kitsu.io) link to manga
     */
    kitsu?: string;
    /**
     * Amazon (https://amazon.com) link to manga
     */
    amazon?: string;
    /**
     * EBookJapan (https://ebookjapan.yahoo.co.jp) link to manga
     */
    eBookJapan?: string;
    /**
     * Link to manga raws
     */
    raw?: string;
    /**
     * Link to offical english manga translation
     */
    officialEnglishTranslation?: string;
    /**
     * CDJapan (https://www.cdjapan.co.jp/) link to manga
     */
    cdJapan?: string;

    constructor(linksObject?: Record<string, string>) {
        this.anilist = !linksObject?.al ? undefined : `https://anilist.co/manga/${linksObject.al}`;

        this.animePlanet = !linksObject?.ap ? undefined : `https://www.anime-planet.com/manga/${linksObject.ap}`;

        this.bookWalker = !linksObject?.bw ? undefined : `https://bookwalker.jp/${linksObject.bw}`;

        this.mangaUpdates = !linksObject?.mu
            ? undefined
            : `https://www.mangaupdates.com/series.html?id=${linksObject.mu}`;

        this.novelUpdates = !linksObject?.nu ? undefined : `https://www.novelupdates.com/series/${linksObject.nu}`;

        this.myAnimeList = !linksObject?.mal ? undefined : `https://myanimelist.net/manga/${linksObject.mal}`;

        if (linksObject?.kt !== undefined) {
            // Stored as either a number or slug. See official documentation
            if (isNaN(parseInt(linksObject.kt))) {
                this.kitsu = `https://kitsu.io/api/edge/manga?filter[slug]=${linksObject.kt}`;
            } else {
                this.kitsu = `https://kitsu.io/api/edge/manga/${linksObject.kt}`;
            }
        }

        this.amazon = linksObject?.amz;

        this.eBookJapan = linksObject?.ebj;

        this.raw = linksObject?.raw;

        this.officialEnglishTranslation = linksObject?.engtl;

        this.cdJapan = linksObject?.cdj;
    }
}

export default Links;
