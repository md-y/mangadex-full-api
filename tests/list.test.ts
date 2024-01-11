import { List, Manga, User, resolveArray } from '../src/index';
import APIResponseError from '../src/util/APIResponseError';
import { ensureLogin } from './testutil';

beforeAll(async () => {
    await ensureLogin();
});

test('getLoggedInUserLists() and getLoggedInUserLists()', async () => {
    const lists = await List.getLoggedInUserLists();
    expect(lists.length).toBeGreaterThan(0);
    for (const list of lists) {
        expect(list).toBeInstanceOf(List);
        expect(list).toEqual(await List.get(list.id));
    }
});

test('getLoggedInUserLists() with manga and user resolution', async () => {
    const lists = await List.getLoggedInUserLists();
    expect(lists.length).toBeGreaterThan(0);
    lists.sort((a, b) => b.manga.length - a.manga.length);
    const list = lists[0];

    const manga = await resolveArray(list.manga);
    manga.forEach((m) => expect(m).toBeInstanceOf(Manga));

    const owner = await list.creator.resolve();
    expect(owner).toBeInstanceOf(User);
});

test('Intentionally fail get()', async () => {
    try {
        await List.get('apple');
        fail('get() should throw an error');
    } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(APIResponseError);
    }
});
