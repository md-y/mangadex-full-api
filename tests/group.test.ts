import { Group } from '../src/index';
import { ensureLogin, expectEqualIds } from './testutil';

beforeAll(async () => {
    await ensureLogin();
});

test('search() and getMultiple()', async () => {
    const searchGroups = await Group.search();
    expect(searchGroups.length).toBeGreaterThan(0);
    const searchIds = searchGroups.map((a) => a.id);
    const multipleGroups = await Group.getMultiple(searchIds);
    expectEqualIds(multipleGroups, searchGroups);
});

test('getByQuery() and get()', async () => {
    const queriedGroup = await Group.getByQuery();
    expect(queriedGroup).toBeDefined();
    const group = await Group.get(queriedGroup!.id);
    expect(group).toEqual(queriedGroup);
    expect(group).toBeInstanceOf(Group);
});

test('getFollowedGroups() and get()', async () => {
    const followedGroups = await Group.getFollowedGroups();
    for (const group of followedGroups) {
        expect(group).toBeInstanceOf(Group);
        expect(group).toEqual(await Group.get(group.id));
    }
});

test('getByQuery() and getStatistics()', async () => {
    const queriedGroup = await Group.getByQuery();
    expect(queriedGroup).toBeDefined();
    const stats = await queriedGroup!.getStatistics();
    expect(stats).toBeDefined();
});
