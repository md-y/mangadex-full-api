import IDObject from '../internal/IDObject.js';
import { fetchMD, fetchMDByArrayParam, fetchMDData, fetchMDDataWithBody, fetchMDSearch } from '../util/Network.js';
import Relationship from './Relationship.js';
import LocalizedString from '../internal/LocalizedString.js';

import type {
    CreateScanlationGroupSchema,
    GetSearchGroupParamsSchema,
    ResponseSchema,
    ScanlationGroupAttributesSchema,
    ScanlationGroupListSchema,
    ScanlationGroupResponseSchema,
    ScanlationGroupSchema,
    Statistics,
} from '../types/schema.js';
import type { DeepRequire, Merge } from '../types/helpers.js';
import type User from './User.js';

type GroupSearchParams = Partial<Merge<GetSearchGroupParamsSchema, { ids: Group[] }>>;
type GroupStatsResponse = DeepRequire<Statistics.GetStatisticsGroups.ResponseBody>;
type GroupStats = GroupStatsResponse['statistics'][string];

export default class Group extends IDObject implements ScanlationGroupAttributesSchema {
    /**
     * The MangaDex UUID of this group
     */
    id: string;
    /**
     * The name of this group
     */
    name: string;
    /**
     * Alternate names for this group, including localized names
     */
    altNames: LocalizedString[];
    /**
     * Url to this group's website
     */
    website: string | null;
    /**
     * IRC server of this group
     */
    ircServer: string | null;
    /**
     * IRC channel of this group
     */
    ircChannel: string | null;
    /**
     * Discord server of this group
     */
    discord: string | null;
    /**
     * Email of this group
     */
    contactEmail: string | null;
    /**
     * Description of this group (not localized)
     */
    description: string | null;
    /**
     * Twitter profile of this group
     */
    twitter: string | null;
    /**
     * MangaUpdates profile of this group
     */
    mangaUpdates: string | null;
    /**
     * Languages this group focusses on translating
     */
    focusedLanguage: string[] | null;
    /**
     * Is this group locked from uploading?
     */
    locked: boolean;
    /**
     * Is this an official scanlation group?
     */
    official: boolean;
    /**
     * Is this group inactive?
     */
    inactive: boolean;
    /**
     * The delay between when this group uploads a chapter and when that chapter becomes readable
     */
    publishDelay: string;
    /**
     * The version of this group (incremented by updating the group data)
     */
    version: number;
    /**
     * When this group was created
     */
    createdAt: Date;
    /**
     * When this group was last updated
     */
    updatedAt: Date;
    /**
     * Relationship to the user profile of the user
     */
    leader: Relationship<User> | null;
    /**
     * Array of relationships to the member users of this group
     */
    members: Relationship<User>[];

    constructor(schem: ScanlationGroupSchema) {
        super();
        this.id = schem.id;
        this.name = schem.attributes.name;
        this.altNames = schem.attributes.altNames.map((name) => new LocalizedString(name));
        this.website = schem.attributes.website;
        this.ircServer = schem.attributes.ircServer;
        this.ircChannel = schem.attributes.ircChannel;
        this.discord = schem.attributes.discord;
        this.contactEmail = schem.attributes.contactEmail;
        this.description = schem.attributes.description;
        this.twitter = schem.attributes.twitter;
        this.mangaUpdates = schem.attributes.mangaUpdates;
        this.focusedLanguage = schem.attributes.focusedLanguage;
        this.locked = schem.attributes.locked;
        this.official = schem.attributes.official;
        this.inactive = schem.attributes.inactive;
        this.publishDelay = schem.attributes.publishDelay;
        this.version = schem.attributes.version;
        this.createdAt = new Date(schem.attributes.createdAt);
        this.updatedAt = new Date(schem.attributes.updatedAt);
        this.leader = Relationship.convertType<User>('leader', schem.relationships).pop() ?? null;
        this.members = Relationship.convertType<User>('member', schem.relationships);
    }

    /**
     * Retrieves a group by their id
     */
    static async get(id: string): Promise<Group> {
        return new Group(await fetchMDData<ScanlationGroupResponseSchema>(`/group/${id}`));
    }

    /**
     * Retrieves a list of groups according to the specified search parameters
     */
    static async search(query?: GroupSearchParams): Promise<Group[]> {
        const res = await fetchMDSearch<ScanlationGroupListSchema>(`/group`, query);
        return res.map((u) => new Group(u));
    }

    /**
     * Retrieves an array of groups by an array of ids
     */
    static async getMultiple(ids: string[]): Promise<Group[]> {
        const res = await fetchMDByArrayParam<ScanlationGroupListSchema>('/group', ids);
        return res.map((u) => new Group(u));
    }

    /**
     * Performs a search for a group and returns the first one found. If no results are
     * found, null is returned
     */
    static async getByQuery(query?: GroupSearchParams): Promise<Group | null> {
        const res = await this.search(query);
        return res[0] ?? null;
    }

    /**
     * Create a new group
     */
    static async create(data: CreateScanlationGroupSchema) {
        return new Group(await fetchMDDataWithBody<ScanlationGroupResponseSchema>('/group', data));
    }

    /**
     * Deletes a group by their id
     */
    static async delete(id: string) {
        await fetchMD<ResponseSchema>(`/group/${id}`, undefined, { method: 'DELETE' });
    }

    /**
     * Deletes this group
     */
    async delete() {
        await Group.delete(this.id);
    }

    /**
     * Updates a group's information.
     */
    async update(data: Omit<CreateScanlationGroupSchema, 'version'>) {
        return new Group(
            await fetchMDDataWithBody<ScanlationGroupResponseSchema>(
                `/group/${this.id}`,
                {
                    ...data,
                    version: this.version + 1,
                },
                undefined,
                'PUT',
            ),
        );
    }

    /**
     * Make the currently authenticated user follow a scanlation group
     */
    static async follow(id: string): Promise<void> {
        await fetchMD(`/group/${id}/follow`, undefined, { method: 'POST' });
    }

    /**
     * Make the currently authenticated user follow this group
     */
    async follow(): Promise<void> {
        await Group.follow(this.id);
    }

    /**
     * Make the currently authenticated user unfollow a scanlation group
     */
    static async unfollow(id: string): Promise<void> {
        await fetchMD(`/group/${id}/follow`, undefined, { method: 'DELETE' });
    }

    /**
     * Make the currently authenticated user unfollow this group
     */
    async unfollow(): Promise<void> {
        await Group.unfollow(this.id);
    }

    /**
     * Gets the statistics about a list of groups
     */
    static async getStatistics(ids: string[] | Group[]): Promise<Record<string, GroupStats>> {
        const res = await fetchMD<GroupStatsResponse>(`/statistics/group`, { manga: ids });
        return res.statistics;
    }

    /**
     * Gets the statistics about this group
     */
    async getStatistics(): Promise<GroupStats> {
        const res = await Group.getStatistics([this.id]);
        return res[this.id];
    }
}
