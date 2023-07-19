import { Tag } from '../src/index';

test('getAllTags()', async () => {
    const tags = await Tag.getAllTags();
    expect(tags.length).toBeGreaterThan(0);
});

test('getByName()', async () => {
    const tag = await Tag.getByName('isekai');
    const tags = await Tag.getAllTags();
    expect(tag).not.toBeNull();
    expect(tags).toContain(tag);

    const nullTag = await Tag.getByName('324987ynabfzoiasfudhajkbzxkfhgasf');
    expect(nullTag).toBeNull();
});

test('localization', async () => {
    const tags = await Tag.getAllTags();

    tags.forEach((tag) => {
        expect(tag.localName).toEqual(tag.name.localString);
        expect(tag.localDescription).toEqual(tag.description.localString);
    });
});
