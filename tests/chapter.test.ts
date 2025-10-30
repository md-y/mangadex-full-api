import { Chapter } from '../src/index';
import { expectEqualIds } from './testutil';

test('getByQuery() and search()', async () => {
    const query = { title: 'test' };
    const queriedChapters = await Chapter.getByQuery(query);
    const searchedChapters = await Chapter.search(query);
    expect(queriedChapters).not.toBeNull();
    expect(searchedChapters.length).toBeGreaterThan(0);
    expect(searchedChapters[0]).toBeInstanceOf(Chapter);
    expect(queriedChapters!.id).toEqual(searchedChapters[0].id);
});

test('getMultiple() and search()', async () => {
    const searchChapters = await Chapter.search();
    expect(searchChapters.length).toBeGreaterThan(0);
    const searchIds = searchChapters.map((a) => a.id);
    const multipleChapters = await Chapter.getMultiple(searchIds);
    expectEqualIds(multipleChapters, searchChapters);
});

test('get() and getStatistics()', async () => {
    const queryChapter = await Chapter.getByQuery();
    expect(queryChapter).not.toBeNull();
    const chapter = await Chapter.get(queryChapter!.id);
    expect(chapter).toEqual(queryChapter);
    expect(chapter).toBeInstanceOf(Chapter);

    const stats = await chapter.getStatistics();
    expect(stats).toBeDefined();
});

test('getReadablePages()', async () => {
    const chapter = await Chapter.getByQuery();
    expect(chapter).not.toBeNull();

    const pages = await chapter!.getReadablePages();
    expect(pages.length).toBeGreaterThan(0);

    const pageUrl = pages[0];
    const startTime = Date.now();
    const pageRes = await fetch(pageUrl);

    const pageCached = pageRes.headers.get('X-Cache')?.startsWith('HIT') ?? false;
    let pageData: ArrayBuffer;

    try {
        pageData = await pageRes.arrayBuffer();
    } catch (err) {
        try {
            await Chapter.reportPageURL({
                url: pageUrl,
                bytes: 0,
                cached: pageCached,
                duration: Date.now() - startTime,
                success: false,
            });
        } catch {}
        throw err;
    }

    // mangadex.network reporting seems to be deprecated as of October 2025
    try {
        await Chapter.reportPageURL({
            url: pageUrl,
            bytes: pageData.byteLength,
            cached: pageCached,
            duration: Date.now() - startTime,
            success: true,
        });
    } catch {}
});
