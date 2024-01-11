import { Author } from '../src/index';
import APIResponseError from '../src/util/APIResponseError';
import { expectEqualIds } from './testutil';

test('getByQuery() and search()', async () => {
    const query = { name: 'mangadex' };
    const queriedAuthors = await Author.getByQuery(query);
    const searchedAuthors = await Author.search(query);
    expect(queriedAuthors).not.toBeNull();
    expect(searchedAuthors.length).toBeGreaterThan(0);
    expect(searchedAuthors[0]).toBeInstanceOf(Author);
    expect(queriedAuthors!.id).toEqual(searchedAuthors[0].id);
});

test('getMultiple() and search()', async () => {
    const searchAuthors = await Author.search();
    expect(searchAuthors.length).toBeGreaterThan(0);
    const searchIds = searchAuthors.map((a) => a.id);
    const multipleAuthors = await Author.getMultiple(searchIds);
    expectEqualIds(searchAuthors, multipleAuthors);
});

test('get() and search()', async () => {
    const authors = await Author.search({ limit: 1 });
    expect(authors.length).toEqual(1);
    const authorId = authors[0].id;
    const author = await Author.get(authorId);
    expect(author).toEqual(authors[0]);
    expect(author).toBeInstanceOf(Author);
});

test('Intentionally fail get()', async () => {
    try {
        await Author.get('apple');
        fail('get() should throw an error');
    } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(APIResponseError);
    }
});
