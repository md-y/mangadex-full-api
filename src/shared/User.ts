import IDObject from '../internal/IDObject.js';
import { fetchMDByArrayParam, fetchMDData, fetchMDSearch } from '../util/Network.js';

import type { Merge } from '../types/helpers.js';
import type {
    GetUserParamsSchema,
    UserAttributesSchema,
    UserListSchema,
    UserResponseSchema,
    UserSchema,
    User as UserNamespace
} from '../types/schema.js';

type UserSearchParams = Partial<Merge<GetUserParamsSchema, { ids: User[] }>>;
type FollowedUserParams = UserNamespace.GetUserFollowsUser.RequestQuery;

export default class User extends IDObject implements UserAttributesSchema {
    id: string;
    username: string;
    roles: string[];
    version: number;
    // groups: // TODO: Add groups

    constructor(schem: UserSchema) {
        super();
        this.id = schem.id;
        this.username = schem.attributes.username;
        this.roles = schem.attributes.roles;
        this.version = schem.attributes.version;
    }

    /**
     * Retrieves a user by their id
     */
    static async get(id: string): Promise<User> {
        return new User(await fetchMDData<UserResponseSchema>(`/user/${id}`));
    }

    /**
     * Retrieves a list of users according to the specified search parameters
     */
    static async search(query?: UserSearchParams): Promise<User[]> {
        const res = await fetchMDSearch<UserListSchema>(`/user`, query);
        return res.map((u) => new User(u));
    }

    /**
     * Retrieves an array of users by an array of ids
     */
    static async getMultiple(ids: string[]): Promise<User[]> {
        const res = await fetchMDByArrayParam<UserListSchema>('/user', ids);
        return res.map((u) => new User(u));
    }

    /**
     * Performs a search for a user and returns the first one found. If no results are
     * found, null is returned
     */
    static async getByQuery(query?: UserSearchParams): Promise<User | null> {
        const res = await this.search(query);
        return res[0] ?? null;
    }

    /**
     * Returns a user object for the currently authenticated user.
     */
    static async getLoggedInUser(): Promise<User> {
        return new User(await fetchMDData<UserResponseSchema>('/user/me'));
    }

    /**
     * Returns all users followed by the currently authenticated user.
     */
    static async getFollowedUsers(query: FollowedUserParams = { limit: Infinity, offset: 0 }): Promise<User[]> {
        const res = await fetchMDSearch<UserListSchema>('/user/follows/user', query);
        return res.map((u) => new User(u));
    }
}