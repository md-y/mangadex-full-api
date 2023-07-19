import IDObject from '../internal/IDObject';
import Relationship from '../internal/Relationship';
import APIResponseError from '../util/APIResponseError';
import { fetchMD, fetchMDWithBody, fetchMDWithFormData } from '../util/Network';

import type {
    BeginUploadSessionSchema,
    CommitUploadSessionSchema,
    RelationshipSchema,
    ResponseSchema,
    UploadSessionAttributesSchema,
    UploadSessionSchema,
    Upload,
    UploadSessionFileSchema,
    ChapterDraftSchema,
    UploadSessionFileAttributesSchema,
} from '../types/schema';
import type Group from './Group';
import type Manga from './Manga';
import type User from './User';
import type Chapter from './Chapter';

type FullUploadSession = UploadSessionSchema & { relationships: RelationshipSchema[] };
type FixedFullUploadSession = FullUploadSession | { data: FullUploadSession };
type FullPageFileResponse = Required<Upload.PutUploadSessionFile.ResponseBody>;

/**
 * This class represents an in-progress manga upload session including the uploaded pages.
 */
export default class UploadSession extends IDObject implements UploadSessionAttributesSchema {
    /**
     * The MangaDex UUID of this upload session
     */
    id!: string;
    /**
     * Has this session been committed (pages published)
     */
    isCommitted!: boolean;
    /**
     * Has this session still been processed by MangaDex?
     */
    isProcessed!: boolean;
    /**
     * Has this session been deleted/aborted?
     */
    isDeleted!: boolean;
    /**
     * The version of this session (incremented by updating data)
     */
    version!: number;
    /**
     * When this upload session was started
     */
    createdAt!: Date;
    /**
     * When this upload session was last updated
     */
    updatedAt!: Date;
    /**
     * A relationship to who started this upload session
     */
    uploader!: Relationship<User>;
    /**
     * A relationship to the manga this upload session is for
     */
    manga!: Relationship<Manga>;
    /**
     * An array of relationships to the groups involved with the chapter for this session
     */
    groups!: Relationship<Group>[];
    /**
     * An array of uploaded page image files
     */
    pages!: UploadSessionFile[];

    constructor(schem: FixedFullUploadSession) {
        super();
        this.updateData(schem);
    }

    private updateData(schem: FixedFullUploadSession) {
        if ('data' in schem) schem = schem.data;
        this.id = schem.id;
        this.isCommitted = schem.attributes.isCommitted;
        this.isProcessed = schem.attributes.isProcessed;
        this.isDeleted = schem.attributes.isDeleted;
        this.version = schem.attributes.version;
        this.createdAt = new Date(schem.attributes.createdAt);
        this.updatedAt = new Date(schem.attributes.updatedAt);
        this.uploader = Relationship.convertType<User>('user', schem.relationships).pop()!;
        this.manga = Relationship.convertType<Manga>('manga', schem.relationships).pop()!;
        this.groups = Relationship.convertType<Group>('scanlation_group', schem.relationships);

        // Directly parse uploaded file relationships into UploadSessionFile instances
        // We can't use a regular Relationship since uploaded session files don't have a get endpoint
        this.pages = schem.relationships
            .filter((rel) => rel.type === 'upload_session_file')
            .map((rel) => {
                if (!rel.attributes) {
                    throw new Error(
                        'MangaDex did not return session file attributes in a relationship. Did you forget a reference expansion (ie includes[])?',
                    );
                }
                return new UploadSessionFile({
                    id: rel.id,
                    attributes: rel.attributes as UploadSessionFileAttributesSchema,
                    type: 'upload_session_file',
                });
            });
        this.pages.sort((a, b) => a.num - b.num);
    }

    /**
     * Begin a new upload session for a specified manga. At least one group must be specified
     * @param cancelCurrentSession - Stop any current upload session before creating this one
     */
    static async begin(
        manga: string | Manga,
        groups: string[] | Group[] = [],
        cancelCurrentSession = false,
    ): Promise<UploadSession> {
        if (cancelCurrentSession) await UploadSession.cancelCurrentSession();
        return new UploadSession(
            await fetchMDWithBody<FixedFullUploadSession>(
                '/upload/begin',
                {
                    manga: typeof manga === 'string' ? manga : manga.id,
                    groups: groups.map((g) => (typeof g === 'string' ? g : g.id)),
                } as BeginUploadSessionSchema,
                { includes: ['upload_session_file'] },
            ),
        );
    }

    /**
     * Start a new upload session for editing an existing chapter. The upload session will
     * act the same as one for new chapter.
     * @param cancelCurrentSession - Stop any current upload session before creating this one
     */
    static async beginChapterEdit(chapter: Chapter, cancelCurrentSession = false) {
        if (cancelCurrentSession) await UploadSession.cancelCurrentSession();
        return new UploadSession(
            await fetchMDWithBody<FixedFullUploadSession>(
                `/upload/begin/${chapter.id}`,
                {
                    version: chapter.version,
                },
                { includes: ['upload_session_file'] },
            ),
        );
    }

    /**
     * Get the current upload session owned by the currently authenticated user
     */
    static async getCurrentSession(): Promise<UploadSession> {
        return new UploadSession(
            await fetchMD<FixedFullUploadSession>('/upload', { includes: ['upload_session_file'] }),
        );
    }

    /**
     * Cancel the current user's current upload session if it exists
     */
    static async cancelCurrentSession(): Promise<void> {
        let current;
        try {
            current = await UploadSession.getCurrentSession();
        } catch (_) {}
        if (current) await current.close();
    }

    /**
     * Closes this upload session and removes all associated uploaded files
     */
    async close(): Promise<void> {
        await fetchMD<ResponseSchema>(`/upload/${this.id}`, undefined, { method: 'DELETE' });
        this.isDeleted = true;
    }

    /**
     * Commit and publish this chapter to MangaDex.
     * @param pageOrder - By default, the page order is decided by the 'pages' array of this upload session object.
     * If this parameter is supplied an array, the order of elements in that array is used instead.
     */
    async commit(chapterData: ChapterDraftSchema, pageOrder?: string[] | UploadSessionFile[]): Promise<void> {
        if (pageOrder) pageOrder = pageOrder.map((p) => (typeof p === 'string' ? p : p.id));
        else pageOrder = this.pages.map((p) => p.id);
        this.updateData(
            await fetchMDWithBody<FixedFullUploadSession>(
                `/upload/${this.id}/commit`,
                {
                    chapterDraft: chapterData,
                    pageOrder: pageOrder,
                } as CommitUploadSessionSchema,
                {
                    includes: ['upload_session_file'],
                },
            ),
        );
    }

    /**
     * Upload new page image files as blobs. The blobs should contain the binary image data, and although not necessary,
     * it is recommended that the image MIME type is included as well. The resulting uploaded file data will be appended
     * to this object's 'pages' property.
     */
    async uploadPages(files: Blob[]): Promise<void> {
        const maxExistingPage = Math.max(...this.pages.map((p) => p.num), 0);
        const newFiles = files.map((file, i) => ({
            data: file,
            name: (i + maxExistingPage).toString(),
        }));
        const promises = [];
        while (newFiles.length > 0) {
            promises.push(
                fetchMDWithFormData<FullPageFileResponse>(`/upload/${this.id}`, { files: newFiles.splice(0, 10) }),
            );
        }
        const allResults = await Promise.all(promises);
        const errors = allResults.flatMap((res) => res.errors ?? []);
        if (errors.length > 0) throw new APIResponseError(errors);
        const data = allResults.flatMap((res) => res.data ?? []).map((page) => new UploadSessionFile(page));
        data.sort((a, b) => a.num - b.num);
        this.pages.push(...data);
    }

    /**
     * Delete previously uploaded page image files by their ids
     */
    async deletePages(pages: string[] | UploadSessionFileSchema[]): Promise<void> {
        const ids = pages.map((p) => (typeof p === 'string' ? p : p.id));
        await fetchMDWithBody<ResponseSchema>(`/upload/${this.id}/batch`, ids, undefined, 'DELETE');
        this.pages = this.pages.filter((p) => !ids.includes(p.id));
    }
}

class UploadSessionFile extends IDObject implements UploadSessionFileAttributesSchema {
    /**
     * The MangaDex UUID of this uploaded file
     */
    id: string;
    /**
     * The original filename of the file. May be an empty string
     */
    originalFileName: string;
    /**
     * The hash of this file. May be an empty string
     */
    fileHash: string;
    /**
     * The file size in bytes of this file
     */
    fileSize: number;
    /**
     * The MIME image type of this file
     */
    mimeType: string;
    /**
     * Is this file stored on MangaDex's server or elsewhere
     */
    source: 'local' | 'remote';
    /**
     * The version number of this file (incremented by updating the file's data)
     */
    version: number;
    /**
     * A number assigned to this file. It is usually from the order it was uploaded, but it can also
     * be the file hash or another number.
     */
    num: number;

    constructor(schem: UploadSessionFileSchema) {
        super();
        this.id = schem.id;
        this.originalFileName = schem.attributes.originalFileName;
        this.fileHash = schem.attributes.fileHash;
        this.fileSize = schem.attributes.fileSize;
        this.mimeType = schem.attributes.mimeType;
        this.source = schem.attributes.source;
        this.version = schem.attributes.version;

        this.num = parseInt(this.originalFileName);
        // Even if the filename is an invalid number, we would still like a unique number like the hash
        if (isNaN(this.num)) this.num = parseInt(this.fileHash, 16);
        if (isNaN(this.num)) this.num = 1000;
    }
}
