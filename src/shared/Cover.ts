import IDObject from '../internal/IDObject';
import {
    fetchMD,
    fetchMDByArrayParam,
    fetchMDData,
    fetchMDDataWithBody,
    fetchMDSearch,
    fetchMDWithFormData,
} from '../util/Network';
import Relationship from '../internal/Relationship';

import type Manga from './Manga';
import type {
    CoverAttributesSchema,
    CoverEditSchema,
    CoverListSchema,
    CoverResponseSchema,
    CoverSchema,
    GetCoverParamsSchema,
    ResponseSchema,
    Cover as CoverNamespace,
} from '../types/schema';
import type { Merge } from '../types/helpers';
import type User from './User';

type CoverSearchParams = Partial<Merge<GetCoverParamsSchema, { ids: Cover[]; manga: Manga[] }>>;
type CoverExpandedTypes = CoverSearchParams['includes'];
type CoverUploadBody = Omit<CoverNamespace.UploadCover.RequestBody, 'file'> & { file: Blob };

export default class Cover extends IDObject implements CoverAttributesSchema {
    /**
     * MangaDex UUID for this object
     */
    id: string;
    /**
     * What volume is this cover for, if any
     */
    volume: string | null;
    /**
     * The file name of this cover's image
     */
    fileName: string;
    /**
     * Description of this cover. May be an empty string
     */
    description: string | null;
    /**
     * What language is this cover in
     */
    locale: string | null;
    /**
     * The version of this cover (incremented by updating the cover)
     */
    version: number;
    /**
     * The date this cover was uploaded
     */
    createdAt: Date;
    /**
     * The date this cover was last updated
     */
    updatedAt: Date;
    /**
     * Url to this cover's image
     */
    url: string;
    /**
     * Relationship to the manga this cover belongs to
     */
    manga: Relationship<Manga>;
    /**
     * Relationship to the user who uploaded this cover
     */
    uploader: Relationship<User> | null;

    constructor(schem: CoverSchema) {
        super();
        this.id = schem.id;
        this.volume = schem.attributes.volume;
        this.fileName = schem.attributes.fileName;
        this.description = schem.attributes.description;
        this.locale = schem.attributes.locale;
        this.version = schem.attributes.version;
        this.createdAt = new Date(schem.attributes.createdAt);
        this.updatedAt = new Date(schem.attributes.updatedAt);
        const parentRelationship = Relationship.createSelfRelationship('cover_art', this);
        this.manga = Relationship.convertType<Manga>('manga', schem.relationships, parentRelationship).pop()!;
        this.url = `https://mangadex.org/covers/${this.manga.id}/${this.fileName}`;
        this.uploader = Relationship.convertType<User>('user', schem.relationships).pop() ?? null;
    }

    /**
     * Retrieves a cover by its id
     */
    static async get(id: string | Manga, expandedTypes?: CoverExpandedTypes): Promise<Cover> {
        if (id instanceof IDObject) id = id.id;
        return new Cover(await fetchMDData<CoverResponseSchema>(`/cover/${id}`, { includes: expandedTypes }));
    }

    /**
     * Retrieves a list of covers according to the specified search parameters
     */
    static async search(query?: CoverSearchParams) {
        const res = await fetchMDSearch<CoverListSchema>(`/cover`, query);
        return res.map((m) => new Cover(m));
    }

    /**
     * Performs a search for a cover and returns the first one found. If no results are
     * found, null is returned
     */
    static async getByQuery(query?: CoverSearchParams): Promise<Cover | null> {
        const res = await this.search(query);
        return res[0] ?? null;
    }

    /**
     * Retrieves an array of covers by an array of ids
     */
    static async getMultiple(ids: string[]): Promise<Cover[]> {
        const res = await fetchMDByArrayParam<CoverListSchema>('/cover', ids);
        return res.map((a) => new Cover(a));
    }

    /**
     * Returns an array of covers from an array of manga ids or a single manga
     */
    static async getMangaCovers(
        manga: Manga | string | Manga[] | string[],
        expandedTypes?: CoverExpandedTypes,
    ): Promise<Cover[]> {
        if (!Array.isArray(manga)) manga = [typeof manga === 'string' ? manga : manga.id];
        if (manga.length === 0) return [];
        const ids = manga.map((m) => (typeof m === 'string' ? m : m.id));
        return Cover.search({ manga: ids, includes: expandedTypes });
    }

    /**
     * Deletes a cover by their id
     */
    static async delete(id: string) {
        await fetchMD<ResponseSchema>(`/cover/${id}`, undefined, { method: 'DELETE' });
    }

    /**
     * Deletes this cover
     */
    async delete() {
        await Cover.delete(this.id);
    }

    /**
     * Updates a cover's information.
     */
    async update(data: Omit<CoverEditSchema, 'version'>) {
        return new Cover(
            await fetchMDDataWithBody<CoverResponseSchema>(
                `/cover/${this.id}`,
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
     * Uploads a new cover
     */
    static async create(manga: string | Manga, data: CoverUploadBody) {
        if (typeof manga !== 'string') manga = manga.id;
        const res = await fetchMDWithFormData<CoverResponseSchema>(`/cover/${manga}`, data);
        return new Cover(res.data);
    }
}
