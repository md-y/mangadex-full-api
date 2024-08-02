import IDObject from '../internal/IDObject';
import LocalizedString from '../internal/LocalizedString';
import { fetchMDData, fetchMDSearch, fetchMDByArrayParam, fetchMDDataWithBody, fetchMD } from '../util/Network';
import Relationship from '../internal/Relationship';

import {
    AuthorAttributesSchema,
    AuthorCreateSchema,
    AuthorEditSchema,
    AuthorListSchema,
    AuthorResponseSchema,
    AuthorSchema,
    GetAuthorParamsSchema,
    ResponseSchema,
} from '../types/schema';
import type Manga from './Manga';
import type { Merge } from '../types/helpers';

type AuthorSearchParams = Partial<Merge<GetAuthorParamsSchema, { ids: Author[] }>>;

/**
 * This represents an author or artist of a manga
 */
export default class Author extends IDObject implements AuthorAttributesSchema {
    /**
     * The MangaDex UUID for the author/artist
     */
    id: string;
    /**
     * The name of the author/artist
     */
    name: string;
    /**
     * A url to an image of the author/artist
     */
    imageUrl: string | null;
    /**
     * The biography of the author/artist
     */
    biography: LocalizedString;
    /**
     * URL to the author/artist's twitter
     */
    twitter: string | null;
    /**
     * URL to the author/artist's pixiv
     */
    pixiv: string | null;
    /**
     *  URL to the author/artist's melon book
     */
    melonBook: string | null;
    /**
     *  URL to the author/artist's fanbox
     */
    fanBox: string | null;
    /**
     *  URL to the author/artist's booth
     */
    booth: string | null;
    /**
     *  URL to the author/artist's nico video
     */
    nicoVideo: string | null;
    /**
     *  URL to the author/artist's skeb
     */
    skeb: string | null;
    /**
     *  URL to the author/artist's fantia
     */
    fantia: string | null;
    /**
     *  URL to the author/artist's tumblr
     */
    tumblr: string | null;
    /**
     *  URL to the author/artist's youtube
     */
    youtube: string | null;
    /**
     *  URL to the author/artist's weibo
     */
    weibo: string | null;
    /**
     *  URL to the author/artist's naver
     */
    naver: string | null;
    /**
     * URL to the author/artist's namicomi
     */
    namicomi: string | null;
    /**
     *  URL to the author/artist's website
     */
    website: string | null;
    /**
     *  The version of this author/artist's entry (incremented by updating author data)
     */
    version: number;
    /**
     * When the author/artist's entry was added
     */
    createdAt: Date;
    /**
     * The last time the author/artist's entry was updated
     */
    updatedAt: Date;
    /**
     * The manga the author/artist has worked on
     */
    manga: Relationship<Manga>[];

    constructor(schem: AuthorSchema) {
        super();
        this.id = schem.id;
        this.name = schem.attributes.name;
        this.imageUrl = schem.attributes.imageUrl;
        this.biography = new LocalizedString(schem.attributes.biography);
        this.twitter = schem.attributes.twitter;
        this.pixiv = schem.attributes.pixiv;
        this.melonBook = schem.attributes.melonBook;
        this.fanBox = schem.attributes.fanBox;
        this.booth = schem.attributes.booth;
        this.nicoVideo = schem.attributes.nicoVideo;
        this.skeb = schem.attributes.skeb;
        this.fantia = schem.attributes.fantia;
        this.tumblr = schem.attributes.tumblr;
        this.youtube = schem.attributes.youtube;
        this.weibo = schem.attributes.weibo;
        this.naver = schem.attributes.naver;
        this.namicomi = schem.attributes.namicomi;
        this.website = schem.attributes.website;
        this.version = schem.attributes.version;
        this.createdAt = new Date(schem.attributes.createdAt);
        this.updatedAt = new Date(schem.attributes.updatedAt);
        this.manga = Relationship.convertType('manga', schem.relationships);
    }

    /**
     * Retrieve a chapter object by its id
     */
    static async get(id: string, expandedTypes?: AuthorSearchParams['includes']): Promise<Author> {
        return new Author(await fetchMDData<AuthorResponseSchema>(`/author/${id}`, { includes: expandedTypes }));
    }

    /**
     * Retrieves a list of authors/artists according to the specified search parameters
     */
    static async search(query?: AuthorSearchParams) {
        const res = await fetchMDSearch<AuthorListSchema>(`/author`, query);
        return res.map((m) => new Author(m));
    }

    /**
     * Performs a search for an author/artist and returns the first one found. If no results are
     * found, null is returned
     */
    static async getByQuery(query?: AuthorSearchParams): Promise<Author | null> {
        const res = await this.search(query);
        return res[0] ?? null;
    }

    /**
     * Retrieves an array of authors/artists by an array of ids
     */
    static async getMultiple(ids: string[]): Promise<Author[]> {
        const res = await fetchMDByArrayParam<AuthorListSchema>('/author', ids);
        return res.map((a) => new Author(a));
    }

    /**
     * Create a new Author
     */
    static async create(data: AuthorCreateSchema) {
        return new Author(await fetchMDDataWithBody<AuthorResponseSchema>('/author', data));
    }

    /**
     * Deletes an author by their id
     */
    static async delete(id: string) {
        await fetchMD<ResponseSchema>(`/author/${id}`, undefined, { method: 'DELETE' });
    }

    /**
     * Deletes this author
     */
    async delete() {
        await Author.delete(this.id);
    }

    /**
     * Updates an author's information.
     */
    async update(data: Omit<AuthorCreateSchema, 'version'>) {
        return new Author(
            await fetchMDDataWithBody<AuthorResponseSchema>(
                `/author/${this.id}`,
                {
                    ...data,
                    version: this.version + 1,
                } as AuthorEditSchema,
                undefined,
                'PUT',
            ),
        );
    }
}
