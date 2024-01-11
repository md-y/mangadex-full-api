import { Tag } from '../src/index';

test('getAllTags()', async () => {
    const tags = await Tag.getAllTags();
    expect(tags.length).toBeGreaterThan(0);
});

test('getByName()', async () => {
    const tag = await Tag.getByName('isekai');
    const tags = await Tag.getAllTags();
    expect(tag).toBeDefined();
    expect(tags).toContain(tag);
});

test('getByNames()', async () => {
    const names = ['isekai', 'villainess'];
    const tags = await Tag.getByNames(names);
    expect(tags.length).toEqual(names.length);
});

test('localization', async () => {
    const tags = await Tag.getAllTags();

    tags.forEach((tag) => {
        expect(tag.localName).toEqual(tag.name.localString);
        expect(tag.localDescription).toEqual(tag.description.localString);
    });
});
