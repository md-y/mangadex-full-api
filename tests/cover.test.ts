import { Cover } from '../src/index';
import { expectEqualIds } from './testutil';

test('getByQuery() and search()', async () => {
    const query = {};
    const queryRes = await Cover.getByQuery(query);
    const searchRes = await Cover.search(query);
    expect(queryRes).not.toBeNull();
    expect(searchRes.length).toBeGreaterThan(0);
    expect(searchRes[0]).toBeInstanceOf(Cover);
    expect(queryRes!.id).toEqual(searchRes[0].id);
});

test('getMultiple() and search()', async () => {
    const searchRes = await Cover.search();
    expect(searchRes.length).toBeGreaterThan(0);
    const searchIds = searchRes.map((a) => a.id);
    const multipleRes = await Cover.getMultiple(searchIds);
    expectEqualIds(searchRes, multipleRes);
});

test('get() and getMangaCovers()', async () => {
    const queryRes = await Cover.getByQuery();
    expect(queryRes).not.toBeNull();
    const cover = await Cover.get(queryRes!.id);
    expect(cover).toEqual(queryRes);
    expect(cover).toBeInstanceOf(Cover);

    const mangaId = await cover.manga.id;
    const covers = await Cover.getMangaCovers(mangaId);
    expect(covers.map((c) => c.id)).toContain(cover.id);
});

test('Download Cover.url', async () => {
    const cover = await Cover.getByQuery();
    expect(cover).not.toBeNull();
    const url = cover!.url;

    const coverRes = await fetch(url);
    const coverData = await coverRes.arrayBuffer();
    expect(coverData.byteLength).toBeGreaterThan(0);
});
