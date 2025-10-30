import IDObject from '../internal/IDObject';
import {
    fetchMD,
    fetchMDByArrayParam,
    fetchMDData,
    fetchMDDataWithBody,
    fetchMDSearch,
    postToMDNetwork,
} from '../util/Network';
import Relationship from '../internal/Relationship';

import type {
    AtHome,
    ChapterAttributesSchema,
    ChapterEditSchema,
    ChapterListSchema,
    ChapterResponseSchema,
    ChapterSchema,
    GetChapterParamsSchema,
    ResponseSchema,
    Statistics,
} from '../types/schema';
import type Manga from './Manga';
import type User from './User';
import type Group from './Group';
import type { DeepRequire, Merge } from '../types/helpers';

export type ChapterSearchParams = Partial<
    Merge<GetChapterParamsSchema, { ids: Chapter[]; groups: Group[]; uploader: User | User[] }>
>;
type AtHomeServerResponse = Required<AtHome.GetAtHomeServerChapterId.ResponseBody>;
type OtherChapterAttributes = Omit<ChapterAttributesSchema, 'uploader'>;
type ChapterStatsResponse = DeepRequire<Statistics.GetStatisticsChapters.ResponseBody>;
type ChapterStats = ChapterStatsResponse['statistics'][string];

export default class Chapter extends IDObject implements OtherChapterAttributes {
    /**
     * The MangaDex UUID of this chapter
     */
    id: string;
    /**
     * The title of this chapter
     */
    title: string | null;
    /**
     * The manga volume this chapter belongs to
     */
    volume: string | null;
    /**
     * The chapter number for this chapter
     */
    chapter: string | null;
    /**
     * The number of pages in this chapter
     */
    pages: number;
    /**
     * The language of this chapter
     */
    translatedLanguage: string;
    /**
     * Relationship to the user who uploaded this chapter
     */
    uploader: Relationship<User>;
    /**
     * Url to this chapter if it's an external chapter
     */
    externalUrl: string | null;
    /**
     * The version of this chapter (incremented by updating chapter data)
     */
    version: number;
    /**
     * When this chapter was created
     */
    createdAt: Date;
    /**
     * When this chapter was last updated
     */
    updatedAt: Date;
    /**
     * When this chapter was originally published
     */
    publishAt: Date;
    /**
     * When was / when will this chapter be readable?
     */
    readableAt: Date;
    /**
     * Is this chapter an external chapter? If it is, this chapter will have an externalUrl
     */
    isExternal: boolean;
    /**
     * A relationship to the manga this chapter belongs to
     */
    manga: Relationship<Manga>;
    /**
     * Array of relationships to the groups that translated this chapter
     */
    groups: Relationship<Group>[];
    /**
     * Is this chapter unavailable?
     */
    isUnavailable: boolean;

    constructor(schem: ChapterSchema) {
        super();
        this.id = schem.id;
        this.title = schem.attributes.title;
        this.volume = schem.attributes.volume;
        this.chapter = schem.attributes.chapter;
        this.pages = schem.attributes.pages;
        this.translatedLanguage = schem.attributes.translatedLanguage;
        this.uploader = Relationship.convertType<User>('user', schem.relationships).pop()!;
        this.externalUrl = schem.attributes.externalUrl;
        this.version = schem.attributes.version;
        this.createdAt = new Date(schem.attributes.createdAt);
        this.publishAt = new Date(schem.attributes.publishAt);
        this.updatedAt = new Date(schem.attributes.updatedAt);
        this.readableAt = new Date(schem.attributes.readableAt);
        this.isExternal = schem.attributes.externalUrl !== null;
        this.manga = Relationship.convertType<Manga>('manga', schem.relationships).pop()!;
        this.groups = Relationship.convertType<Group>('scanlation_group', schem.relationships);
        this.isUnavailable = schem.attributes.isUnavailable;
    }

    /**
     * Retrieves a chapter object by its UUID
     */
    static async get(id: string, expandedTypes?: ChapterSearchParams['includes']): Promise<Chapter> {
        return new Chapter(await fetchMDData<ChapterResponseSchema>(`/chapter/${id}`, { includes: expandedTypes }));
    }

    /**
     * Retrieves an array of chapters by an array of their ids
     */
    static async getMultiple(ids: string[]): Promise<Chapter[]> {
        const res = await fetchMDByArrayParam<ChapterListSchema>(`/chapter`, ids);
        return res.map((c) => new Chapter(c));
    }

    /**
     * Retrieves a list of chapters according to the specified search parameters
     */
    static async search(query?: ChapterSearchParams): Promise<Chapter[]> {
        const res = await fetchMDSearch<ChapterListSchema>('/chapter', query);
        return res.map((c) => new Chapter(c));
    }

    /**
     * Performs a search for a chapter and returns the first one found. If no results are
     * found, null is returned
     */
    static async getByQuery(query?: ChapterSearchParams): Promise<Chapter | null> {
        const res = await this.search(query);
        return res[0] ?? null;
    }

    /**
     * Update this chapter's information
     */
    async update(data: Omit<ChapterEditSchema, 'version'>): Promise<Chapter> {
        return new Chapter(
            await fetchMDDataWithBody<ChapterResponseSchema>(
                `/chapter/${this.id}`,
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
     * Delete this chapter
     */
    static async delete(id: string) {
        await fetchMD<ResponseSchema>(`/chapter/${id}`, undefined, { method: 'DELETE' });
    }

    /**
     * Delete a chapter by its UUID
     */
    async delete() {
        await Chapter.delete(this.id);
    }

    /**
     * Returns an array of image URLs for this chapter's pages. Once an image is requested,
     * if the host is from MangaDex(at)Home, please report if it succeeds or fails by using {@link reportPageURL}.
     * @param saver - If true, the URLs will be for the compressed data-saver images (if available).
     * @param forcePort - If true, the URLs will be forced to be on port 443.
     */
    async getReadablePages(saver = false, forcePort = false): Promise<string[]> {
        if (this.isExternal) throw new Error('Cannot get readable pages for an external chapter.');
        const res = await fetchMD<AtHomeServerResponse>(`/at-home/server/${this.id}`, {
            forcePort443: forcePort,
        });
        // Get the list of image files depending on if data saver images are preferred
        const files = (saver ? res.chapter.dataSaver ?? res.chapter.data : res.chapter.data) ?? [];
        // Build image urls according to https://api.mangadex.org/docs/retrieving-chapter/
        return files.map((file) => `${res.baseUrl}/${saver ? 'data-saver' : 'data'}/${res.chapter.hash}/${file}`);
    }

    /**
     * Sends a report to MangaDex about the success/failure of a MangaDex(at)Home server.
     * Read more information: {@link https://api.mangadex.org/docs/04-chapter/retrieving-chapter/#mangadexhome-load-successes-failures-and-retries}
     */
    static async reportPageURL(report: {
        url: string;
        success: boolean;
        bytes: number;
        duration: number;
        cached: boolean;
    }): Promise<void> {
        await postToMDNetwork('/report', report);
    }

    /**
     * Gets the statistics about a list of chapters
     */
    static async getStatistics(ids: string[] | Chapter[]): Promise<Record<string, ChapterStats>> {
        const res = await fetchMD<ChapterStatsResponse>(`/statistics/chapter`, { chapter: ids });
        return res.statistics;
    }

    /**
     * Gets the statistics about this chapter
     */
    async getStatistics(): Promise<ChapterStats> {
        const res = await Chapter.getStatistics([this.id]);
        return res[this.id];
    }
}
