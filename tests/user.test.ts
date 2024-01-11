import { User } from '../src/index';
import { ensureLogin, expectEqualIds } from './testutil';

beforeAll(async () => {
    await ensureLogin();
});

test('search() and getMultiple()', async () => {
    const searchUsers = await User.search();
    expect(searchUsers.length).toBeGreaterThan(0);
    const searchIds = searchUsers.map((a) => a.id);
    const multipleUsers = await User.getMultiple(searchIds);
    expectEqualIds(multipleUsers, searchUsers);
});

test('getByQuery() and get()', async () => {
    const queriedUser = await User.getByQuery();
    expect(queriedUser).toBeDefined();
    const user = await User.get(queriedUser!.id);
    expect(user).toEqual(queriedUser);
    expect(user).toBeInstanceOf(User);
});

test('getFollowedUsers() and get()', async () => {
    const followedUsers = await User.getFollowedUsers();
    for (const user of followedUsers) {
        expect(user).toBeInstanceOf(User);
        expect(user).toEqual(await User.get(user.id));
    }
});

test('getLoggedInUser()', async () => {
    const user = await User.getLoggedInUser();
    expect(user).toBeInstanceOf(User);
    expect(user).toEqual(await User.get(user.id));
});
