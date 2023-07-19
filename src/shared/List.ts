import IDObject from '../internal/IDObject';
import { fetchMD, fetchMDData, fetchMDDataWithBody, fetchMDSearch } from '../util/Network';
import Relationship from '../internal/Relationship';
import Chapter from './Chapter';

import type {
    ChapterListSchema,
    CustomListAttributesSchema,
    CustomListCreateSchema,
    CustomListListSchema,
    CustomListResponseSchema,
    CustomListSchema,
    GetListIdFeedParamsSchema,
    ResponseSchema,
} from '../types/schema';
import type Manga from './Manga';
import type User from './User';

export default class List extends IDObject implements CustomListAttributesSchema {
    /**
     * The MangaDex UUID of this custom list
     */
    id: string;
    /**
     * The display name of this custom list
     */
    name: string;
    /**
     * Is this list public or private?
     */
    visibility: 'private' | 'public';
    /**
     * The version of this custom list (incremented by updating data)
     */
    version: number;
    /**
     * A relationship to the user who created and owns this list
     */
    creator: Relationship<User>;
    /**
     * An array of relationships to the manga in this custom list
     */
    manga: Relationship<Manga>[];

    constructor(schem: CustomListSchema) {
        super();
        this.id = schem.id;
        this.name = schem.attributes.name;
        this.visibility = schem.attributes.visibility;
        this.version = schem.attributes.version;
        this.creator = Relationship.convertType<User>('user', schem.relationships).pop()!;
        this.manga = Relationship.convertType<Manga>('manga', schem.relationships);
    }

    /**
     * Retrieves a list by its id
     */
    static async get(id: string): Promise<List> {
        return new List(await fetchMDData<CustomListResponseSchema>(`/list/${id}`));
    }

    /**
     * Create a new list
     */
    static async create(data: CustomListCreateSchema): Promise<List> {
        return new List(await fetchMDDataWithBody<CustomListResponseSchema>('/list', data));
    }

    /**
     * Deletes a list by its id
     */
    static async delete(id: string) {
        await fetchMD<ResponseSchema>(`/list/${id}`, undefined, { method: 'DELETE' });
    }

    /**
     * Deletes this list
     */
    async delete() {
        await List.delete(this.id);
    }

    /**
     * Updates a list's information.
     */
    async update(data: Partial<Omit<CustomListCreateSchema, 'version'>>) {
        return new List(
            await fetchMDDataWithBody<CustomListResponseSchema>(
                `/list/${this.id}`,
                {
                    ...data,
                    name: data.name ?? this.name,
                    version: this.version + 1,
                } as CustomListCreateSchema,
                undefined,
                'PUT',
            ),
        );
    }

    /**
     * Make the currently authenticated user follow a list
     */
    static async follow(id: string): Promise<void> {
        await fetchMD(`/list/${id}/follow`, undefined, { method: 'POST' });
    }

    /**
     * Make the currently authenticated user follow this list
     */
    async follow(): Promise<void> {
        await List.follow(this.id);
    }

    /**
     * Make the currently authenticated user unfollow a list
     */
    static async unfollow(id: string): Promise<void> {
        await fetchMD(`/list/${id}/follow`, undefined, { method: 'DELETE' });
    }

    /**
     * Make the currently authenticated user unfollow this list
     */
    async unfollow(): Promise<void> {
        await List.unfollow(this.id);
    }

    /**
     * Add a manga to a list
     */
    static async addManga(listId: string, manga: Manga | string): Promise<void> {
        if (typeof manga !== 'string') manga = manga.id;
        await fetchMD<ResponseSchema>(`/manga/${manga}/list/${listId}`, undefined, { method: 'POST' });
    }

    /**
     * Add a manga to this list
     */
    async addManga(manga: Manga | string): Promise<void> {
        await List.addManga(this.id, manga);
    }

    /**
     * Remove a manga from a list
     */
    static async removeManga(listId: string, manga: Manga | string): Promise<void> {
        if (typeof manga !== 'string') manga = manga.id;
        await fetchMD<ResponseSchema>(`/manga/${manga}/list/${listId}`, undefined, { method: 'DELETE' });
    }

    /**
     * Remove a manga from this list
     */
    async removeManga(manga: Manga | string): Promise<void> {
        await List.removeManga(this.id, manga);
    }

    /**
     * Returns all of the currently authenticated user's custom manga lists
     */
    static async getLoggedInUserLists(limit = Infinity, offset = 0): Promise<List[]> {
        const res = await fetchMDSearch<CustomListListSchema>('/user/list', { limit: limit, offset: offset });
        return res.map((u) => new List(u));
    }

    /**
     * Returns all of a user's custom manga lists
     */
    static async getUserLists(user: string | User, limit = Infinity, offset = 0): Promise<List[]> {
        if (typeof user !== 'string') user = user.id;
        const res = await fetchMDSearch<CustomListListSchema>(`/user/${user}/list`, { limit: limit, offset: offset });
        return res.map((u) => new List(u));
    }

    /**
     * Returns an array of chapters from the manga in a list
     */
    static async getFeed(listId: string, query?: Partial<GetListIdFeedParamsSchema>): Promise<Chapter[]> {
        const res = await fetchMDSearch<ChapterListSchema>(`/list/${listId}/feed`, query);
        return res.map((c) => new Chapter(c));
    }

    /**
     * Returns an array of chapters from the manga in this list
     */
    async getFeed(query?: Partial<GetListIdFeedParamsSchema>): Promise<Chapter[]> {
        return await List.getFeed(this.id, query);
    }

    /**
     * Returns all lists followed by the currently authenticated user
     */
    static async getFollowedLists(limit = Infinity, offset = 0): Promise<List[]> {
        const res = await fetchMDSearch<CustomListListSchema>('/user/follows/list', { limit: limit, offset: offset });
        return res.map((u) => new List(u));
    }

    /**
     * Changes the visibility of this custom list
     */
    async changeVisibility(newVis: 'public' | 'private'): Promise<List> {
        return await this.update({ visibility: newVis });
    }

    /**
     * Renames this custom list
     */
    async rename(name: string): Promise<List> {
        return await this.update({ name: name });
    }

    /**
     *
     */
    async updateMangaList(newList: Manga[] | string[]): Promise<List> {
        newList = newList.map((i) => (typeof i === 'string' ? i : i.id));
        return await this.update({ manga: newList });
    }
}
