import { Chapter, Cover, Manga, Tag } from '../src/index';
import { ensureLogin, expectEqualIds } from './testutil';

beforeAll(async () => {
    await ensureLogin();
});

test('getByQuery() and search()', async () => {
    const query = { title: 'isekai' };
    const queriedManga = await Manga.getByQuery(query);
    const searchedManga = await Manga.search(query);
    expect(queriedManga).not.toBeNull();
    expect(searchedManga.length).toBeGreaterThan(0);
    expect(searchedManga[0]).toBeInstanceOf(Manga);
    expect(queriedManga!.id).toEqual(searchedManga[0].id);
});

test('getMultiple() and search() with a high limit', async () => {
    const searchManga = await Manga.search({ limit: 200 });
    expect(searchManga.length).toBeGreaterThan(0);
    const searchIds = searchManga.map((m) => m.id);
    const multipleManga = await Manga.getMultiple(searchIds);
    expectEqualIds(multipleManga, searchManga);
});

test('get() and search()', async () => {
    const searchManga = await Manga.search({ limit: 1 });
    expect(searchManga.length).toEqual(1);
    const mangaId = searchManga[0].id;
    const manga = await Manga.get(mangaId);
    expect(manga).toEqual(searchManga[0]);
    expect(manga).toBeInstanceOf(Manga);
});

test('getRandom() and localizations', async () => {
    const manga = await Manga.getRandom();
    expect(manga).toBeInstanceOf(Manga);
    expect(manga.localTitle).toEqual(manga.title.localString);
    expect(manga.localDescription).toEqual(manga.description.localString);
    expect(manga.localAltTitles).toEqual(manga.altTitles.map((t) => t.localString));
});

test('getFeed()', async () => {
    const manga = await Manga.getByQuery({ hasAvailableChapters: true });
    expect(manga).not.toBeNull();
    const feed = await manga!.getFeed();
    expect(feed.length).toBeGreaterThan(0);
    expect(feed[0].manga.id).toEqual(manga!.id);
    expect(feed[0]).toBeInstanceOf(Chapter);
});

test('getCovers()', async () => {
    const manga = await Manga.getRandom();
    const covers = await manga.getCovers();
    expect(covers.length).toBeGreaterThan(0);
    expect(covers[0]).toBeInstanceOf(Cover);
    expect(covers[0].manga.id).toEqual(manga.id);
});

test('getRelations()', async () => {
    // Find a manga with the most relations
    const searchedManga = await Manga.search({ includedTags: [await Tag.getByName('Fan Colored')], limit: 100 });
    searchedManga.sort(
        (a, b) => Object.values(b.relatedManga).flat().length - Object.values(a.relatedManga).flat().length,
    );
    const manga = searchedManga[0];
    expect(manga).toBeDefined();

    // Check if the requested relations are cached and that they match the given relations
    const requestedRelations = await manga!.getRelations(true);
    const givenRelations = manga!.relatedManga;
    for (const [relType, relatedManga] of Object.entries(requestedRelations)) {
        for (const related of relatedManga) {
            // Sometimes the related manga don't exist, so if they're not cached, resolving should cause an error
            if (!related.cached) {
                expect(related.resolve()).rejects.not.toBeNull();
            }
        }

        const ids1 = relatedManga.map((m) => m.id);
        const ids2 = givenRelations[relType as keyof typeof givenRelations].map((m) => m.id);
        ids1.sort();
        ids2.sort();
        expect(ids1).toEqual(ids2);
    }
});

test('getStatistics()', async () => {
    const manga = await Manga.getRandom();
    const stats = await manga.getStatistics();
    expect(stats).toBeDefined();
});

test('getAggregate()', async () => {
    const manga = await Manga.getByQuery({ hasAvailableChapters: true, order: { followedCount: 'desc' } });
    expect(manga).not.toBeNull();

    // Get chapter to look for in aggregate
    const feed = await manga!.getFeed({ limit: 1 });
    const testChapter = feed[0];
    expect(testChapter).toBeDefined();
    const testGroup = testChapter.groups[0].id;
    const testLang = testChapter.translatedLanguage;
    expect(testGroup).toBeDefined();
    expect(testLang).toBeDefined();

    const aggregate = await manga!.getAggregate([testGroup], [testLang]);
    const chapterIds: string[] = Object.values(aggregate).flatMap((vol) =>
        Object.values(vol.chapters).map((c) => c.id),
    );
    expect(chapterIds).toContain(testChapter.id);
});

test('getTotalSearchResults()', async () => {
    const amount = await Manga.getTotalSearchResults({ title: 'isekai' });
    expect(amount).toBeGreaterThan(0);
});

test('getFollowedManga() and getReadChapters()', async () => {
    const followedManga = await Manga.getFollowedManga({ limit: 101 });
    if (followedManga.length === 0) {
        console.warn('No followed manga found, skipping test');
        return;
    }
    expect(followedManga[0]).toBeInstanceOf(Manga);

    const chapters = await Manga.getReadChapters(followedManga.map((m) => m.id));
    const readChapters = Object.values(chapters);
    readChapters.sort((a, b) => b.length - a.length);
    if (readChapters[0].length === 0) {
        console.warn('No read chapters found, skipping test');
        return;
    }

    const mostReadManga = await readChapters[0][0].manga.resolve();
    const mostReadMangaChapters = await mostReadManga.getReadChapters();
    expect(mostReadMangaChapters.map((m) => m.id).sort()).toEqual(readChapters[0].map((m) => m.id).sort());
});

test('getUserRating() and getRandom()', async () => {
    const manga = await Manga.getRandom();
    expect(manga).toBeInstanceOf(Manga);
    const rating = await manga.getUserRating();
    if (rating !== null) {
        expect(typeof rating).toBe('number');
    }
});

test('getFollowedFeed()', async () => {
    const feed = await Manga.getFollowedFeed();
    for (const chapter of feed) {
        expect(chapter).toBeInstanceOf(Chapter);
    }
});

test('getReadingStatus() and getAllReadingStatus()', async () => {
    const statuses = await Manga.getAllReadingStatus();
    expect(statuses).toBeDefined();

    const markedMangaIds = Object.keys(statuses);
    if (markedMangaIds.length === 0) {
        console.warn('No reading statuses found, skipping test');
        return;
    }

    const mangaId = markedMangaIds[0];
    const manga = await Manga.get(mangaId); // Inefficient, but it tests 2 functions at once
    const mangaStatus = await manga.getReadingStatus();
    expect(statuses[mangaId]).toEqual(mangaStatus);
});
