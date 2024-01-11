import LocalizedString from '../internal/LocalizedString';
import Tag from './Tag';
import {
    fetchMD,
    fetchMDByArrayParam,
    fetchMDData,
    fetchMDDataWithBody,
    fetchMDSearch,
    fetchMDWithBody,
} from '../util/Network';
import Relationship from '../internal/Relationship';
import Links from '../internal/Links';
import IDObject from '../internal/IDObject';
import Chapter, { ChapterSearchParams } from './Chapter';
import Cover from './Cover';
import APIResponseError from '../util/APIResponseError';

import type Author from './Author';
import {
    ChapterListSchema,
    ChapterReadMarkerBatchSchema,
    GetMangaRandomParamsSchema,
    GetSearchMangaParamsSchema,
    MangaAttributesSchema,
    MangaListSchema,
    MangaResponseSchema,
    MangaSchema,
    RelationshipSchema,
    Manga as MangaNamespace,
    Rating,
    ResponseSchema,
    MappingIdBodySchema,
    MappingIdResponseSchema,
    MangaRelationAttributesSchema,
    MangaRelationResponseSchema,
    MangaRelationRequestSchema,
    MangaRelationListSchema,
    Statistics,
    GetMangaDraftsParamsSchema,
    MangaCreateSchema,
    MangaEditSchema,
    User as UserNamespace,
} from '../types/schema';
import type { DeepRequire, Merge } from '../types/helpers';
import type Group from './Group';

// This type supplements the schema type so that IDObjects can be used instead
type MangaSearchHelpers = {
    group: Group;
    includedTags: Tag[];
    excludedTags: Tag[];
    authors: Author[];
    artists: Author[];
    authorOrArtist: Author;
    ids: IDObject[];
};
type MangaSearchParams = Partial<Merge<GetSearchMangaParamsSchema, MangaSearchHelpers>>;
type OtherMangaAttributes = Omit<MangaAttributesSchema, 'tags' | 'links' | 'latestUploadedChapter'>;
type RelatedManga = { [x in RelationshipSchema['related']]: Relationship<Manga>[] };
type ReadmarkerResponse = Required<MangaNamespace.GetMangaChapterReadmarkers.ResponseBody>;
type ReadmarkerResponseGrouped = Required<MangaNamespace.GetMangaChapterReadmarkers2.ResponseBody>;
type RatingResponse = Required<Rating.GetRating.ResponseBody>;
type MangaReadingStatus = Required<MangaNamespace.GetMangaIdStatus.ResponseBody>['status'];
type MangaRelation = MangaRelationAttributesSchema['relation'];
type MangaStatsResponse = DeepRequire<Statistics.GetStatisticsManga.ResponseBody>;
type MangaStats = MangaStatsResponse['statistics'][string];
type MangaDraftSearchParams = Partial<GetMangaDraftsParamsSchema>;
type MangaAggregateResponse = DeepRequire<MangaNamespace.GetMangaAggregate.ResponseBody>;
type MangaAggregate = MangaAggregateResponse['volumes'];
type FollowedMangaParams = UserNamespace.GetUserFollowsManga.RequestQuery;

/**
 * This class represents a specific manga series.
 * There are many static methods for requesting manga from MangaDex.
 */
export default class Manga extends IDObject implements OtherMangaAttributes {
    /**
     * The MangaDex UUID of this manga
     */
    id: string;
    /**
     * The manga's main title with different localization options
     */
    title: LocalizedString;
    /**
     * List of alternate titles with different localization options
     */
    altTitles: LocalizedString[];
    /**
     * Description with different localization options
     */
    description: LocalizedString;
    /**
     * Is this manga locked?
     */
    isLocked: boolean;
    /**
     * Link object representing links to other websites about this manga
     */
    links: Links;
    /**
     * 2 (or more) letter code for the original language of this manga
     */
    originalLanguage: string;
    /**
     * This manga's last volume based on the default feed order
     */
    lastVolume: string | null;
    /**
     * This manga's last chapter based on the default feed order
     */
    lastChapter: string | null;
    /**
     * Publication demographic of this manga
     */
    publicationDemographic: 'shounen' | 'shoujo' | 'josei' | 'seinen' | null;
    /**
     * Publication/Scanlation status of this manga
     */
    status: 'completed' | 'ongoing' | 'cancelled' | 'hiatus';
    /**
     * Year of this manga's publication
     */
    year: number | null;
    /**
     * The content rating of this manga
     */
    contentRating: 'safe' | 'suggestive' | 'erotica' | 'pornographic';
    /**
     * Does the chapter count reset whenever a new volume is added?
     */
    chapterNumbersResetOnNewVolume: boolean;
    /**
     * List of language codes that this manga has translated chapters for
     */
    availableTranslatedLanguages: string[];
    /**
     * UUID of the chapter that was uploaded last.
     * String is empty if there is no chapter
     */
    latestUploadedChapter: Relationship<Chapter>;
    /**
     * List of this manga's genre tags
     */
    tags: Tag[];
    /**
     * Status of this manga as a manga submission
     */
    state: 'draft' | 'submitted' | 'published' | 'rejected';
    /**
     * The version of this manga (incremented by updating manga data)
     */
    version: number;
    /**
     * Date the manga was added to the site
     */
    createdAt: Date;
    /**
     * Date the manga was last updated
     */
    updatedAt: Date;
    /**
     * An object containing all other manga entries related to this one.
     * This includes spin-offs, colorization, etc.
     */
    relatedManga: RelatedManga;
    /**
     * List of relationships to authors attributed to this manga
     */
    authors: Relationship<Author>[];
    /**
     * List of relationships to artists attributed to this manga
     */
    artists: Relationship<Author>[];
    /**
     * A relationship to the current main cover of this series
     */
    mainCover: Relationship<Cover>;

    constructor(schem: MangaSchema) {
        super();
        this.id = schem.id;
        this.altTitles = schem.attributes.altTitles.map((elem) => new LocalizedString(elem));
        this.artists = Relationship.convertType('artist', schem.relationships);
        this.authors = Relationship.convertType('author', schem.relationships);
        this.availableTranslatedLanguages = schem.attributes.availableTranslatedLanguages;
        this.chapterNumbersResetOnNewVolume = schem.attributes.chapterNumbersResetOnNewVolume;
        this.contentRating = schem.attributes.contentRating;
        this.createdAt = new Date(schem.attributes.createdAt);
        this.description = new LocalizedString(schem.attributes.description);
        this.isLocked = schem.attributes.isLocked;
        this.lastChapter = schem.attributes.lastChapter;
        this.lastVolume = schem.attributes.lastVolume;
        this.latestUploadedChapter = new Relationship({ id: schem.attributes.latestUploadedChapter, type: 'chapter' });
        this.links = new Links(schem.attributes.links);
        this.mainCover = Relationship.convertType<Cover>('cover_art', schem.relationships).pop()!;
        this.publicationDemographic = schem.attributes.publicationDemographic;
        this.relatedManga = Manga.getRelatedManga(schem.relationships);
        this.state = schem.attributes.state;
        this.status = schem.attributes.status;
        this.tags = schem.attributes.tags.map((elem) => new Tag(elem));
        this.title = new LocalizedString(schem.attributes.title);
        this.updatedAt = new Date(schem.attributes.updatedAt);
        this.version = schem.attributes.version;
        this.year = schem.attributes.year;
        this.originalLanguage = schem.attributes.originalLanguage;
    }

    private static getRelatedManga(relationships: RelationshipSchema[]): RelatedManga {
        const relatedManga: RelatedManga = {
            monochrome: [],
            main_story: [],
            adapted_from: [],
            based_on: [],
            prequel: [],
            side_story: [],
            doujinshi: [],
            same_franchise: [],
            shared_universe: [],
            sequel: [],
            spin_off: [],
            alternate_story: [],
            alternate_version: [],
            preserialization: [],
            colored: [],
            serialization: [],
        };
        for (const rel of relationships) {
            if (rel.type === 'manga') {
                relatedManga[rel.related].push(new Relationship<Manga>(rel));
            }
        }
        return relatedManga;
    }

    /**
     * The title of this manga according to the global locale.
     * @see {@link LocalizedString.localString}
     */
    get localTitle() {
        return this.title.localString;
    }

    /**
     * List of alternate titles for manga according to the global locale.
     * @see {@link LocalizedString.localString}
     */
    get localAltTitles() {
        return this.altTitles.map((title) => title.localString);
    }

    /**
     * The description of this manga according to the global locale.
     * @see {@link LocalizedString.localString}
     */
    get localDescription() {
        return this.description.localString;
    }

    /**
     * Retrieves a manga object by its UUID
     */
    static async get(id: string, expandedTypes?: MangaSearchParams['includes']): Promise<Manga> {
        return new Manga(await fetchMDData<MangaResponseSchema>(`/manga/${id}`, { includes: expandedTypes }));
    }

    /**
     * Retrieves a list of manga according to the specified search parameters
     * @see {@link Relationship.cached} for information on how to automatically resolve Relationships
     */
    static async search(query?: MangaSearchParams): Promise<Manga[]> {
        const res = await fetchMDSearch<MangaListSchema>(`/manga`, query);
        return res.map((m) => new Manga(m));
    }

    /**
     * Retrieves an array of manga by an array of their ids
     */
    static async getMultiple(ids: string[], extraParams?: Omit<MangaSearchParams, 'ids'>): Promise<Manga[]> {
        const res = await fetchMDByArrayParam<MangaListSchema>('/manga', ids, extraParams);
        return res.map((m) => new Manga(m));
    }

    /**
     * Returns how many manga there are total for a search query
     */
    static async getTotalSearchResults(query?: Omit<MangaSearchParams, 'limit' | 'offset'>): Promise<number> {
        const res = await fetchMD<MangaListSchema>('/manga', { ...query, limit: 1, offset: 0 });
        return res.total;
    }

    /**
     * Returns an array of a manga's chapters
     */
    static async getFeed(id: string, params?: ChapterSearchParams): Promise<Chapter[]> {
        const res = await fetchMDSearch<ChapterListSchema>(`/manga/${id}/feed`, params);
        return res.map((c) => new Chapter(c));
    }

    /**
     * Returns an array of this manga's chapters
     */
    async getFeed(params?: ChapterSearchParams): Promise<Chapter[]> {
        return Manga.getFeed(this.id, params);
    }

    /**
     * Marks lists of chapters read or unread for a single manga
     */
    static async updateReadChapters(
        manga: string,
        chapters: { read?: (string | Chapter)[]; unread?: (string | Chapter)[] },
        updateHistory = false,
    ) {
        if (!chapters.read && !chapters.unread) return [];
        const body = {
            chapterIdsRead: chapters.read?.map((c) => (typeof c === 'string' ? c : c.id)) ?? [],
            chapterIdsUnread: chapters.unread?.map((c) => (typeof c === 'string' ? c : c.id)) ?? [],
        } as ChapterReadMarkerBatchSchema;
        await fetchMDWithBody(`/manga/${manga}/read`, body, { updateHistory: updateHistory });
    }

    /**
     * Marks lists of chapters read or unread for this manga
     */
    async updateReadChapters(chapters: Parameters<typeof Manga.updateReadChapters>[1], updateHistory = false) {
        return Manga.updateReadChapters(this.id, chapters, updateHistory);
    }

    /**
     * Returns an array of read chapters for a list of manga. The response is a record with the manga ids
     * as the keys and chapter arrays as the values.
     */
    static async getReadChapters(ids: string[] | Manga[]): Promise<Record<string, Chapter[]>> {
        const mangaData: Record<string, string[]> = {};

        // Split requests because there is a maximum URI length for each
        for (let i = 0; i < ids.length; i += 100) {
            let res = await fetchMDData<ReadmarkerResponseGrouped>('/manga/read', {
                ids: ids.slice(i, i + 100),
                grouped: true,
            });
            if (Array.isArray(res)) {
                // The response won't be grouped if there is only one manga
                if (ids.length === 1) {
                    const id = typeof ids[0] === 'string' ? ids[0] : ids[0].id;
                    res = { [id]: res };
                } else {
                    throw new APIResponseError('MangaDex did not respond with a grouped body.');
                }
            }
            for (const [key, value] of Object.entries(res)) {
                if (key in mangaData) mangaData[key].push(...value);
                else mangaData[key] = value;
            }
        }

        // Flatten all the chapters so only one request needs to be made
        const allChapters = await Chapter.getMultiple(Object.values(mangaData).flat());
        const returnObj: Record<string, Chapter[]> = {};
        for (const key in mangaData) {
            returnObj[key] = allChapters.filter((c) => mangaData[key].includes(c.id));
        }
        return returnObj;
    }

    /**
     * Returns an array of read chapters for this manga
     */
    async getReadChapters() {
        const res = await fetchMDData<ReadmarkerResponse>(`/manga/${this.id}/read`);
        return await Chapter.getMultiple(res);
    }

    /**
     * Retrieves a random manga
     */
    static async getRandom(query?: Pick<MangaSearchParams, keyof GetMangaRandomParamsSchema>) {
        const res = await fetchMDData<MangaResponseSchema>('/manga/random', query);
        return new Manga(res);
    }

    /**
     * Performs a search for a manga and returns the first one found. If no results are
     * found, null is returned
     */
    static async getByQuery(query?: MangaSearchParams): Promise<Manga | null> {
        const res = await this.search(query);
        return res[0] ?? null;
    }

    /**
     * Gets all covers for this manga
     */
    async getCovers() {
        return Cover.getMangaCovers(this.id);
    }

    /**
     * Returns all manga followed by the currently authenticated user
     */
    static async getFollowedManga(query: FollowedMangaParams = { limit: Infinity, offset: 0 }): Promise<Manga[]> {
        const res = await fetchMDSearch<MangaListSchema>('/user/follows/manga', query);
        return res.map((u) => new Manga(u));
    }

    /**
     * Returns a record of all ratings given by the currently authenticated user. The object is indexed by the manga
     * ids and each value contains the numerical rating and when that rating was given. If a manga has no rating,
     * 'null' is used as the value.
     */
    static async getUserRatings(
        ids: string[] | Manga[],
    ): Promise<Record<string, { rating: number; createdAt: Date } | null>> {
        const res = await fetchMD<RatingResponse>('/rating', { manga: ids });
        const parsedObj: Record<string, { rating: number; createdAt: Date } | null> = {};
        for (let i of ids) {
            if (typeof i !== 'string') i = i.id;
            if (i in res.ratings) {
                parsedObj[i] = {
                    rating: res.ratings[i].rating!,
                    createdAt: new Date(res.ratings[i].createdAt!),
                };
            } else {
                parsedObj[i] = null;
            }
        }
        return parsedObj;
    }

    /**
     * Returns the rating that the currently authenticated user gave to this manga on a scale of 1-10,
     * or returns null if there is no rating.
     */
    async getUserRating(): Promise<number | null> {
        const res = await Manga.getUserRatings([this.id]);
        return res[this.id]?.rating ?? null;
    }

    /**
     * Makes the currently authenticated user give a manga a rating between 1-10 (inclusive).
     */
    static async giveRating(mangaId: string, rating: number) {
        if (rating > 10 || rating < 1) throw new Error('Rating must be in the range of 1-10 (inclusive).');
        await fetchMDWithBody<ResponseSchema>(`/rating/${mangaId}`, { rating: rating });
    }

    /**
     * Makes the currently authenticated user give this manga a rating between 1-10 (inclusive).
     */
    async giveRating(rating: number) {
        await Manga.giveRating(this.id, rating);
    }

    /**
     * Removes the currently authenticated user's rating for a manga
     */
    static async removeRating(mangaId: string) {
        await fetchMD<ResponseSchema>(`/rating/${mangaId}`, undefined, { method: 'DELETE' });
    }

    /**
     * Removes the currently authenticated user's rating for this manga
     */
    async removeRating() {
        await Manga.removeRating(this.id);
    }

    /**
     * Gets the combined feed of every manga followed by the logged in user
     */
    static async getFollowedFeed(query?: ChapterSearchParams): Promise<Chapter[]> {
        const res = await fetchMDSearch<ChapterListSchema>('/user/follows/manga/feed', query);
        return res.map((c) => new Chapter(c));
    }

    /**
     * Converts legacy pre-V5 MangaDex ids to modern UUIDs. Returns a record with legacy ids as the keys
     * and new ids as the values.
     */
    static async convertLegacyId(type: MappingIdBodySchema['type'], ids: number[]): Promise<Record<number, string>> {
        const res = await fetchMDDataWithBody<MappingIdResponseSchema>('/legacy/mapping', {
            type: type,
            ids: ids,
        } as MappingIdBodySchema);
        return Object.fromEntries(res.map((i) => [i.attributes.legacyId, i.attributes.newId]));
    }

    /**
     * Get every reading status (eg completed, reading, dropped, etc) for every manga marked by
     * the currently authenticated user.
     * @param filter - If specified, only manga with this status will be returned
     */
    static async getAllReadingStatus(filter?: MangaReadingStatus): Promise<Record<string, MangaReadingStatus>> {
        const res = await fetchMD<Required<MangaNamespace.GetMangaStatus.ResponseBody>>('/manga/status', {
            status: filter,
        });
        return res.statuses;
    }

    /**
     * Gets the reading status (eg completed, reading, dropped, etc) for a manga for the currently
     * authenticated user
     */
    static async getReadingStatus(id: string): Promise<MangaReadingStatus> {
        const res = await fetchMD<Required<MangaNamespace.GetMangaIdStatus.ResponseBody>>(`/manga/${id}/status`);
        return res.status;
    }

    /**
     * Gets the reading status (eg completed, reading, dropped, etc) for this manga for the currently
     * authenticated user
     */
    async getReadingStatus(): Promise<MangaReadingStatus> {
        return await Manga.getReadingStatus(this.id);
    }

    /**
     * Sets a manga's reading status (eg completed, reading, dropped, etc) for the currently authenticated user.
     * If the status is null, the current reading status will be removed.
     */
    static async setReadingStatus(id: string, status: MangaReadingStatus | null): Promise<void> {
        await fetchMDWithBody(`/manga/${id}/status`, { status: status });
    }

    /**
     * Sets this manga's reading status (eg completed, reading, dropped, etc) for the currently authenticated user.
     * If the status is null, the current reading status will be removed.
     */
    async setReadingStatus(status: MangaReadingStatus | null) {
        await Manga.setReadingStatus(this.id, status);
    }

    /**
     * Gets all of a manga's relations to other manga.
     */
    static async getRelations(id: string, expandTypes = false): Promise<RelatedManga> {
        const res = await fetchMDData<MangaRelationListSchema>(`/manga/${id}/relation`, {
            includes: expandTypes ? ['manga'] : undefined,
        });
        const relationships = res.flatMap((relation) =>
            relation.relationships.map((rel) => ({ ...rel, related: relation.attributes.relation })),
        );
        return Manga.getRelatedManga(relationships);
    }

    /**
     * Gets all of this manga's relations to other manga.
     */
    async getRelations(expandTypes = false): Promise<RelatedManga> {
        return await Manga.getRelations(this.id, expandTypes);
    }

    /**
     * Creates a relation between two manga (eg sequel/prequel, monochrome/colored, spin-off, etc)
     * @param id - The origin manga
     * @param targetId - The target manga for the relation (eg the sequel, spin-off, etc)
     */
    static async addRelation(id: string, targetId: string, relationType: MangaRelation): Promise<void> {
        await fetchMDDataWithBody<MangaRelationResponseSchema>(`/manga/${id}/relation`, {
            targetManga: targetId,
            relation: relationType,
        } as MangaRelationRequestSchema);
    }

    /**
     * Creates a relation (eg sequel/prequel, monochrome/colored, spin-off, etc) between this manga and another
     * @param id - The origin manga
     * @param targetId - The target manga for the relation (eg the sequel, spin-off, etc)
     */
    async addRelation(targetId: string, relationType: MangaRelation): Promise<void> {
        await Manga.addRelation(this.id, targetId, relationType);
    }

    /**
     * Removes a relation from a manga by the relation's id
     */
    static async removeRelation(mangaId: string, relationId: string) {
        await fetchMD(`/manga/${mangaId}/relation/${relationId}`, undefined, { method: 'DELETE' });
    }

    /**
     * Removes a relation from this manga by the relation's id
     */
    async removeRelation(relationId: string) {
        await Manga.removeRelation(this.id, relationId);
    }

    /**
     * Gets the statistics about manga including their rating distribution, comment count, and follow count
     */
    static async getStatistics(ids: string[] | Manga[]): Promise<Record<string, MangaStats>> {
        const res = await fetchMD<MangaStatsResponse>(`/statistics/manga`, { manga: ids });
        return res.statistics;
    }

    /**
     * Gets the statistics about this manga including its rating distribution, comment count, and follow count
     */
    async getStatistics(): Promise<MangaStats> {
        const res = await Manga.getStatistics([this.id]);
        return res[this.id];
    }

    /**
     * Retrieves a manga draft by its UUID
     */
    static async getDraft(id: string, expandedTypes?: MangaDraftSearchParams['includes']): Promise<Manga> {
        return new Manga(await fetchMDData<MangaResponseSchema>(`/manga/draft/${id}`, { includes: expandedTypes }));
    }

    /**
     * Retrieves a list of manga drafts according to the specified search parameters
     * @see {@link Relationship.cached} for information on how to automatically resolve Relationships
     */
    static async searchDrafts(query?: MangaDraftSearchParams): Promise<Manga[]> {
        const res = await fetchMDSearch<MangaListSchema>(`/manga/draft`, query);
        return res.map((m) => new Manga(m));
    }

    /**
     * Commits a manga object as a draft. A Manga draft that is to be submitted must have at least one cover in
     * the original language, must be in the "draft" state, and must be passed the correct version in the request body.
     */
    static async commitDraft(draftId: string, manga: Partial<MangaAttributesSchema>): Promise<Manga> {
        const res = await fetchMDDataWithBody<MangaResponseSchema>(`/manga/draft/${draftId}/commit`, manga);
        return new Manga(res);
    }

    /**
     * Create a new manga. MangaDex only allows admins to use this endpoint. Use the a manga draft instead
     */
    static async create(data: MangaCreateSchema) {
        return new Manga(await fetchMDDataWithBody<MangaResponseSchema>('/manga', data));
    }

    /**
     * Deletes a manga by its id
     */
    static async delete(id: string) {
        await fetchMD<ResponseSchema>(`/manga/${id}`, undefined, { method: 'DELETE' });
    }

    /**
     * Deletes this manga
     */
    async delete() {
        await Manga.delete(this.id);
    }

    /**
     * Updates this manga's information.
     */
    async update(data: Omit<MangaCreateSchema, 'version'>) {
        return new Manga(
            await fetchMDDataWithBody<MangaResponseSchema>(
                `/author/${this.id}`,
                {
                    ...data,
                    version: this.version + 1,
                } as MangaEditSchema,
                undefined,
                'PUT',
            ),
        );
    }

    /**
     * Returns an abridged list of chapter ids for a manga separated by their volumes
     */
    static async getAggregate(id: string, groups?: string[] | Group[], languages?: string[]): Promise<MangaAggregate> {
        const res = await fetchMD<MangaAggregateResponse>(`/manga/${id}/aggregate`, {
            groups: groups,
            translatedLanguage: languages,
        });
        return res.volumes;
    }

    /**
     * Returns an abridged list of chapter ids for this manga separated by their volumes
     */
    async getAggregate(groups?: string[] | Group[], languages?: string[]): Promise<MangaAggregate> {
        return Manga.getAggregate(this.id, groups, languages);
    }

    /**
     * Makes the logged in user follow or unfollow a manga
     */
    static async changeFollowship(id: string, follow = true): Promise<void> {
        await fetchMD(`/manga/${id}/follow`, undefined, { method: follow ? 'POST' : 'DELETE' });
    }

    /**
     * Makes the user follow or unfollow this manga
     */
    async changeFollowship(follow = true): Promise<void> {
        await Manga.changeFollowship(this.id, follow);
    }
}
