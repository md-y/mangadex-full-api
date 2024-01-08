/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** MangaRequest */
export interface MangaRequestSchema {
    title: LocalizedStringSchema;
    altTitles: LocalizedStringSchema[];
    description: LocalizedStringSchema;
    authors: string[];
    artists: string[];
    links: Record<string, string>;
    /** @pattern ^[a-z]{2}(-[a-z]{2})?$ */
    originalLanguage: string;
    lastVolume: string | null;
    lastChapter: string | null;
    publicationDemographic: 'shounen' | 'shoujo' | 'josei' | 'seinen' | null;
    status: 'completed' | 'ongoing' | 'cancelled' | 'hiatus';
    /**
     * Year of release
     * @min 1
     * @max 9999
     */
    year: number | null;
    contentRating: 'safe' | 'suggestive' | 'erotica' | 'pornographic';
    chapterNumbersResetOnNewVolume: boolean;
    tags: string[];
    /** @format uuid */
    primaryCover: string | null;
    /** @min 1 */
    version: number;
}

/** LocalizedString */
export type LocalizedStringSchema = Record<string, string>;

/** MangaResponse */
export interface MangaResponseSchema {
    result: 'ok' | 'error';
    /** @default "entity" */
    response: string;
    data: MangaSchema;
}

/** ChapterResponse */
export interface ChapterResponseSchema {
    result: 'ok' | 'error';
    /** @default "entity" */
    response: string;
    data: ChapterSchema;
}

/** Relationship */
export interface RelationshipSchema {
    /** @format uuid */
    id: string;
    type: string;
    /** Related Manga type, only present if you are on a Manga entity and a Manga relationship */
    related:
        | 'monochrome'
        | 'main_story'
        | 'adapted_from'
        | 'based_on'
        | 'prequel'
        | 'side_story'
        | 'doujinshi'
        | 'same_franchise'
        | 'shared_universe'
        | 'sequel'
        | 'spin_off'
        | 'alternate_story'
        | 'alternate_version'
        | 'preserialization'
        | 'colored'
        | 'serialization';
    /** If Reference Expansion is applied, contains objects attributes */
    attributes: object | null;
}

/** Chapter */
export interface ChapterSchema {
    /** @format uuid */
    id: string;
    type: 'chapter';
    attributes: ChapterAttributesSchema;
    relationships: RelationshipSchema[];
}

/** Manga */
export interface MangaSchema {
    /** @format uuid */
    id: string;
    type: 'manga';
    attributes: MangaAttributesSchema;
    relationships: RelationshipSchema[];
}

/** ErrorResponse */
export interface ErrorResponseSchema {
    /** @default "error" */
    result: string;
    errors: ErrorSchema[];
}

/** Error */
export interface ErrorSchema {
    id: string;
    status: number;
    title: string;
    detail: string | null;
    context: string | null;
}

/** ChapterAttributes */
export interface ChapterAttributesSchema {
    /** @maxLength 255 */
    title: string | null;
    volume: string | null;
    /** @maxLength 8 */
    chapter: string | null;
    /** Count of readable images for this chapter */
    pages: number;
    /** @pattern ^[a-z]{2}(-[a-z]{2})?$ */
    translatedLanguage: string;
    /** @format uuid */
    uploader: string;
    /**
     * Denotes a chapter that links to an external source.
     * @maxLength 512
     * @pattern ^https?://
     */
    externalUrl: string | null;
    /** @min 1 */
    version: number;
    /** @format date-time */
    createdAt: Date;
    /** @format date-time */
    updatedAt: Date;
    /** @format date-time */
    publishAt: Date;
    /** @format date-time */
    readableAt: Date;
}

/** MangaAttributes */
export interface MangaAttributesSchema {
    title: LocalizedStringSchema;
    altTitles: LocalizedStringSchema[];
    description: LocalizedStringSchema;
    isLocked: boolean;
    links: Record<string, string>;
    originalLanguage: string;
    lastVolume: string | null;
    lastChapter: string | null;
    publicationDemographic: 'shounen' | 'shoujo' | 'josei' | 'seinen' | null;
    status: 'completed' | 'ongoing' | 'cancelled' | 'hiatus';
    /** Year of release */
    year: number | null;
    contentRating: 'safe' | 'suggestive' | 'erotica' | 'pornographic';
    chapterNumbersResetOnNewVolume: boolean;
    availableTranslatedLanguages: string[];
    /** @format uuid */
    latestUploadedChapter: string;
    tags: TagSchema[];
    state: 'draft' | 'submitted' | 'published' | 'rejected';
    /** @min 1 */
    version: number;
    /** @format date-time */
    createdAt: Date;
    /** @format date-time */
    updatedAt: Date;
}

export type MangaCreateSchema = MangaRequestSchema;

export type MangaEditSchema = MangaRequestSchema;

export type ChapterEditSchema = ChapterRequestSchema;

/** Response */
export interface ResponseSchema {
    result: 'ok' | 'error';
}

/** Login */
export interface LoginSchema {
    /**
     * @minLength 1
     * @maxLength 64
     */
    username?: string;
    email?: string;
    /**
     * @minLength 8
     * @maxLength 1024
     */
    password: string;
}

/** LoginResponse */
export interface LoginResponseSchema {
    result: 'ok' | 'error';
    token: {
        session?: string;
        refresh?: string;
    };
}

/** CheckResponse */
export interface CheckResponseSchema {
    /** @default "ok" */
    result: string;
    isAuthenticated: boolean;
    roles: string[];
    permissions: string[];
}

/** LogoutResponse */
export interface LogoutResponseSchema {
    result: 'ok' | 'error';
}

/** RefreshToken */
export interface RefreshTokenSchema {
    /** @minLength 1 */
    token: string;
}

/** RefreshResponse */
export interface RefreshResponseSchema {
    result: 'ok' | 'error';
    token?: {
        session?: string;
        refresh?: string;
    };
    message?: string;
}

/** AccountActivateResponse */
export interface AccountActivateResponseSchema {
    result: 'ok';
}

/** CreateAccount */
export interface CreateAccountSchema {
    /**
     * @minLength 1
     * @maxLength 64
     */
    username: string;
    /**
     * @minLength 8
     * @maxLength 1024
     */
    password: string;
    /** @format email */
    email: string;
}

/** ScanlationGroupResponse */
export interface ScanlationGroupResponseSchema {
    result: 'ok';
    /** @default "entity" */
    response: string;
    data: ScanlationGroupSchema;
}

/** ScanlationGroup */
export interface ScanlationGroupSchema {
    /** @format uuid */
    id: string;
    type: 'scanlation_group';
    attributes: ScanlationGroupAttributesSchema;
    relationships: RelationshipSchema[];
}

/** ScanlationGroupAttributes */
export interface ScanlationGroupAttributesSchema {
    name: string;
    altNames: LocalizedStringSchema[];
    website: string | null;
    ircServer: string | null;
    ircChannel: string | null;
    discord: string | null;
    contactEmail: string | null;
    description: string | null;
    /**
     * @format uri
     * @pattern ^https?://
     */
    twitter: string | null;
    /**
     * @format uri
     * @maxLength 128
     * @pattern ^https:\/\/www\.mangaupdates\.com\/(group|publisher)(s\.html\?id=\d+|\/[\w-]+\/?([\w-]+)?(\/)?)$
     */
    mangaUpdates: string | null;
    focusedLanguage: string[] | null;
    locked: boolean;
    official: boolean;
    verified: boolean;
    inactive: boolean;
    exLicensed: boolean;
    /**
     * Should respected ISO 8601 duration specification: https://en.wikipedia.org/wiki/ISO_8601#Durations
     * @pattern ^(P([1-9]|[1-9][0-9])D)?(P?([1-9])W)?(P?T(([1-9]|1[0-9]|2[0-4])H)?(([1-9]|[1-5][0-9]|60)M)?(([1-9]|[1-5][0-9]|60)S)?)?$
     * @example "P4D"
     */
    publishDelay: string;
    /** @min 1 */
    version: number;
    /** @format date-time */
    createdAt: Date;
    /** @format date-time */
    updatedAt: Date;
}

/** User */
export interface UserSchema {
    /** @format uuid */
    id: string;
    type: 'user';
    attributes: UserAttributesSchema;
    relationships: RelationshipSchema[];
}

/** UserAttributes */
export interface UserAttributesSchema {
    username: string;
    roles: string[];
    /** @min 1 */
    version: number;
}

/** CreateScanlationGroup */
export interface CreateScanlationGroupSchema {
    name: string;
    website?: string | null;
    ircServer?: string | null;
    ircChannel?: string | null;
    discord?: string | null;
    contactEmail?: string | null;
    description?: string | null;
    /**
     * @format uri
     * @pattern ^https?://twitter\.com
     */
    twitter?: string | null;
    /**
     * @maxLength 128
     * @pattern ^https:\/\/www\.mangaupdates\.com\/(group|publisher)(s\.html\?id=\d+|\/[\w-]+\/?([\w-]+)?(\/)?)$
     */
    mangaUpdates?: string | null;
    inactive?: boolean;
    /** @pattern ^P(([1-9]|[1-9][0-9])D)?(([1-9])W)?(T(([1-9]|1[0-9]|2[0-4])H)?(([1-9]|[1-5][0-9]|60)M)?(([1-9]|[1-5][0-9]|60)S)?)?$ */
    publishDelay?: string | null;
}

/** ScanlationGroupEdit */
export interface ScanlationGroupEditSchema {
    name?: string;
    /** @format uuid */
    leader?: string;
    members?: string[];
    website?: string | null;
    ircServer?: string | null;
    ircChannel?: string | null;
    discord?: string | null;
    contactEmail?: string | null;
    description?: string | null;
    /**
     * @format uri
     * @pattern ^https?://
     */
    twitter?: string | null;
    /**
     * @format uri
     * @maxLength 128
     * @pattern ^https:\/\/www\.mangaupdates\.com\/(group|publisher)(s\.html\?id=\d+|\/[\w-]+\/?([\w-]+)?(\/)?)$
     */
    mangaUpdates?: string | null;
    focusedLanguages?: string[] | null;
    inactive?: boolean;
    locked?: boolean;
    publishDelay?: string;
    /** @min 1 */
    version: number;
}

/** CustomListCreate */
export interface CustomListCreateSchema {
    name: string;
    visibility?: 'public' | 'private';
    manga?: string[];
    /** @min 1 */
    version?: number;
}

/** CustomListEdit */
export interface CustomListEditSchema {
    name?: string;
    visibility?: 'public' | 'private';
    manga?: string[];
    /** @min 1 */
    version: number;
}

/** CustomListResponse */
export interface CustomListResponseSchema {
    result: 'ok' | 'error';
    /** @default "entity" */
    response: string;
    data: CustomListSchema;
}

/** CustomList */
export interface CustomListSchema {
    /** @format uuid */
    id: string;
    type: 'custom_list';
    attributes: CustomListAttributesSchema;
    relationships: RelationshipSchema[];
}

/** CustomListAttributes */
export interface CustomListAttributesSchema {
    name: string;
    visibility: 'private' | 'public';
    /** @min 1 */
    version: number;
}

/** CoverResponse */
export interface CoverResponseSchema {
    result: string;
    /** @default "entity" */
    response: string;
    data: CoverSchema;
}

/** Cover */
export interface CoverSchema {
    /** @format uuid */
    id: string;
    type: 'cover_art';
    attributes: CoverAttributesSchema;
    relationships: RelationshipSchema[];
}

/** CoverAttributes */
export interface CoverAttributesSchema {
    volume: string | null;
    fileName: string;
    description: string | null;
    locale: string | null;
    /** @min 1 */
    version: number;
    /** @format date-time */
    createdAt: Date;
    /** @format date-time */
    updatedAt: Date;
}

/** CoverEdit */
export interface CoverEditSchema {
    /**
     * @minLength 0
     * @maxLength 8
     */
    volume: string | null;
    /**
     * @minLength 0
     * @maxLength 512
     */
    description?: string | null;
    /** @pattern ^[a-z]{2}(-[a-z]{2})?$ */
    locale?: string | null;
    /** @min 1 */
    version: number;
}

/** AuthorResponse */
export interface AuthorResponseSchema {
    result: string;
    /** @default "entity" */
    response: string;
    data: AuthorSchema;
}

/** Author */
export interface AuthorSchema {
    /** @format uuid */
    id: string;
    type: 'author';
    attributes: AuthorAttributesSchema;
    relationships: RelationshipSchema[];
}

/** AuthorAttributes */
export interface AuthorAttributesSchema {
    name: string;
    imageUrl: string | null;
    biography: LocalizedStringSchema;
    /**
     * @format uri
     * @pattern ^https?://twitter\.com(/|$)
     */
    twitter: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?pixiv\.net(/|$)
     */
    pixiv: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?melonbooks\.co\.jp(/|$)
     */
    melonBook: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?fanbox\.cc(/|$)
     */
    fanBox: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?booth\.pm(/|$)
     */
    booth: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?nicovideo\.jp(/|$)
     */
    nicoVideo: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?skeb\.jp(/|$)
     */
    skeb: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?fantia\.jp(/|$)
     */
    fantia: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?tumblr\.com(/|$)
     */
    tumblr: string | null;
    /**
     * @format uri
     * @pattern ^https?://www\.youtube\.com(/|$)
     */
    youtube: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?weibo\.(cn|com)(/|$)
     */
    weibo: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?naver\.com(/|$)
     */
    naver: string | null;
    /**
     * @format uri
     * @pattern ^https?://
     */
    website: string | null;
    /** @min 1 */
    version: number;
    /** @format date-time */
    createdAt: Date;
    /** @format date-time */
    updatedAt: Date;
}

/** AuthorEdit */
export interface AuthorEditSchema {
    name?: string;
    biography?: LocalizedStringSchema;
    /**
     * @format uri
     * @pattern ^https?://twitter\.com(/|$)
     */
    twitter?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?pixiv\.net(/|$)
     */
    pixiv?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?melonbooks\.co\.jp(/|$)
     */
    melonBook?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?fanbox\.cc(/|$)
     */
    fanBox?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?booth\.pm(/|$)
     */
    booth?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?nicovideo\.jp(/|$)
     */
    nicoVideo?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?skeb\.jp(/|$)
     */
    skeb?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?fantia\.jp(/|$)
     */
    fantia?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?tumblr\.com(/|$)
     */
    tumblr?: string | null;
    /**
     * @format uri
     * @pattern ^https?://www\.youtube\.com(/|$)
     */
    youtube?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?weibo\.(cn|com)(/|$)
     */
    weibo?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?naver\.com(/|$)
     */
    naver?: string | null;
    /**
     * @format uri
     * @pattern ^https?://
     */
    website?: string | null;
    /** @min 1 */
    version: number;
}

/** AuthorCreate */
export interface AuthorCreateSchema {
    name: string;
    biography?: LocalizedStringSchema;
    /**
     * @format uri
     * @pattern ^https?://twitter\.com(/|$)
     */
    twitter?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?pixiv\.net(/|$)
     */
    pixiv?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?melonbooks\.co\.jp(/|$)
     */
    melonBook?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?fanbox\.cc(/|$)
     */
    fanBox?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?booth\.pm(/|$)
     */
    booth?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?nicovideo\.jp(/|$)
     */
    nicoVideo?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?skeb\.jp(/|$)
     */
    skeb?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?fantia\.jp(/|$)
     */
    fantia?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?tumblr\.com(/|$)
     */
    tumblr?: string | null;
    /**
     * @format uri
     * @pattern ^https?://www\.youtube\.com(/|$)
     */
    youtube?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?weibo\.(cn|com)(/|$)
     */
    weibo?: string | null;
    /**
     * @format uri
     * @pattern ^https?://([\w-]+\.)?naver\.com(/|$)
     */
    naver?: string | null;
    /**
     * @format uri
     * @pattern ^https?://
     */
    website?: string | null;
}

/** ApiClientResponse */
export interface ApiClientResponseSchema {
    result: string;
    /** @default "entity" */
    response: string;
    data: ApiClientSchema;
}

/** ApiClient */
export interface ApiClientSchema {
    /** @format uuid */
    id: string;
    type: 'api_client';
    attributes: ApiClientAttributesSchema;
    relationships: RelationshipSchema[];
}

/** ApiClientAttributes */
export interface ApiClientAttributesSchema {
    name: string;
    description: string | null;
    profile: string;
    clientId: string | null;
    /** @min 1 */
    version: number;
    /** @format date-time */
    createdAt: Date;
    /** @format date-time */
    updatedAt: Date;
}

/** ApiClient */
export interface ApiClientEditSchema {
    description?: string | null;
    /** @min 1 */
    version: number;
}

/** ApiClientCreate */
export interface ApiClientCreateSchema {
    /**
     * @minLength 5
     * @maxLength 32
     */
    name: string;
    /** @maxLength 1024 */
    description?: string | null;
    profile: 'personal';
    /** @min 1 */
    version?: number;
}

/** MappingIdBody */
export interface MappingIdBodySchema {
    type: 'group' | 'manga' | 'chapter' | 'tag';
    ids: number[];
}

/** MappingIdResponse */
export interface MappingIdResponseSchema {
    /** @default "ok" */
    result: string;
    /** @default "collection" */
    response: string;
    data: MappingIdSchema[];
    limit: number;
    offset: number;
    total: number;
}

/** MappingId */
export interface MappingIdSchema {
    /** @format uuid */
    id: string;
    type: 'mapping_id';
    attributes: MappingIdAttributesSchema;
    relationships: RelationshipSchema[];
}

/** MappingIdAttributes */
export interface MappingIdAttributesSchema {
    type: 'manga' | 'chapter' | 'group' | 'tag';
    legacyId: number;
    /** @format uuid */
    newId: string;
}

/** TagResponse */
export interface TagResponseSchema {
    /** @default "ok" */
    result: string;
    /** @default "collection" */
    response: string;
    data: TagSchema[];
    limit: number;
    offset: number;
    total: number;
}

/** Tag */
export interface TagSchema {
    /** @format uuid */
    id: string;
    type: 'tag';
    attributes: TagAttributesSchema;
    relationships: RelationshipSchema[];
}

/** TagAttributes */
export interface TagAttributesSchema {
    name: LocalizedStringSchema;
    description: LocalizedStringSchema;
    group: 'content' | 'format' | 'genre' | 'theme';
    /** @min 1 */
    version: number;
}

/** UserResponse */
export interface UserResponseSchema {
    result: 'ok';
    /** @default "entity" */
    response: string;
    data: UserSchema;
}

/** SendAccountActivationCode */
export interface SendAccountActivationCodeSchema {
    /** @format email */
    email: string;
}

/** RecoverCompleteBody */
export interface RecoverCompleteBodySchema {
    /**
     * @minLength 8
     * @maxLength 1024
     */
    newPassword: string;
}

/** UpdateMangaStatus */
export interface UpdateMangaStatusSchema {
    status: 'reading' | 'on_hold' | 'plan_to_read' | 'dropped' | 're_reading' | 'completed' | null;
}

/** ChapterRequest */
export interface ChapterRequestSchema {
    /** @maxLength 255 */
    title: string | null;
    volume: string | null;
    /** @maxLength 8 */
    chapter: string | null;
    /** @pattern ^[a-z]{2}(-[a-z]{2})?$ */
    translatedLanguage: string;
    /** @maxItems 10 */
    groups: string[];
    /** @min 1 */
    version: number;
}

/** CoverList */
export interface CoverListSchema {
    /** @default "ok" */
    result: string;
    /** @default "collection" */
    response: string;
    data: CoverSchema[];
    limit: number;
    offset: number;
    total: number;
}

/** AuthorList */
export interface AuthorListSchema {
    /** @default "ok" */
    result: string;
    /** @default "collection" */
    response: string;
    data: AuthorSchema[];
    limit: number;
    offset: number;
    total: number;
}

/** ApiClientList */
export interface ApiClientListSchema {
    /** @default "ok" */
    result: string;
    /** @default "collection" */
    response: string;
    data: ApiClientSchema[];
    limit: number;
    offset: number;
    total: number;
}

/** ChapterList */
export interface ChapterListSchema {
    /** @default "ok" */
    result: string;
    /** @default "collection" */
    response: string;
    data: ChapterSchema[];
    limit: number;
    offset: number;
    total: number;
}

/** ScanlationGroupList */
export interface ScanlationGroupListSchema {
    /** @default "ok" */
    result: string;
    /** @default "collection" */
    response: string;
    data: ScanlationGroupSchema[];
    limit: number;
    offset: number;
    total: number;
}

export type MangaRelationCreateSchema = MangaRelationRequestSchema;

/** MangaRelationRequest */
export interface MangaRelationRequestSchema {
    /** @format uuid */
    targetManga: string;
    relation:
        | 'monochrome'
        | 'main_story'
        | 'adapted_from'
        | 'based_on'
        | 'prequel'
        | 'side_story'
        | 'doujinshi'
        | 'same_franchise'
        | 'shared_universe'
        | 'sequel'
        | 'spin_off'
        | 'alternate_story'
        | 'alternate_version'
        | 'preserialization'
        | 'colored'
        | 'serialization';
}

/** MangaRelationList */
export interface MangaRelationListSchema {
    /** @default "ok" */
    result: string;
    /** @default "collection" */
    response: string;
    data: MangaRelationSchema[];
    limit: number;
    offset: number;
    total: number;
}

/** MangaRelationResponse */
export interface MangaRelationResponseSchema {
    result: 'ok' | 'error';
    /** @default "entity" */
    response: string;
    data: MangaRelationSchema;
}

/** MangaRelation */
export interface MangaRelationSchema {
    /** @format uuid */
    id: string;
    type: 'manga_relation';
    attributes: MangaRelationAttributesSchema;
    relationships: RelationshipSchema[];
}

/** MangaRelationAttributes */
export interface MangaRelationAttributesSchema {
    relation:
        | 'monochrome'
        | 'main_story'
        | 'adapted_from'
        | 'based_on'
        | 'prequel'
        | 'side_story'
        | 'doujinshi'
        | 'same_franchise'
        | 'shared_universe'
        | 'sequel'
        | 'spin_off'
        | 'alternate_story'
        | 'alternate_version'
        | 'preserialization'
        | 'colored'
        | 'serialization';
    /** @min 1 */
    version: number;
}

/** MangaList */
export interface MangaListSchema {
    /** @default "ok" */
    result: string;
    /** @default "collection" */
    response: string;
    data: MangaSchema[];
    limit: number;
    offset: number;
    total: number;
}

/** CustomListList */
export interface CustomListListSchema {
    /** @default "ok" */
    result: string;
    /** @default "collection" */
    response: string;
    data: CustomListSchema[];
    limit: number;
    offset: number;
    total: number;
}

/** UserList */
export interface UserListSchema {
    /** @default "ok" */
    result: string;
    /** @default "collection" */
    response: string;
    data: UserSchema[];
    limit: number;
    offset: number;
    total: number;
}

/** UploadSession */
export interface UploadSessionSchema {
    /** @format uuid */
    id: string;
    type: 'upload_session';
    attributes: UploadSessionAttributesSchema;
}

/** UploadSessionAttributes */
export interface UploadSessionAttributesSchema {
    isCommitted: boolean;
    isProcessed: boolean;
    isDeleted: boolean;
    /** @min 1 */
    version: number;
    /** @format date-time */
    createdAt: Date;
    /** @format date-time */
    updatedAt: Date;
}

/** UploadSessionFile */
export interface UploadSessionFileSchema {
    /** @format uuid */
    id: string;
    type: 'upload_session_file';
    attributes: UploadSessionFileAttributesSchema;
}

/** UploadSessionFileAttributes */
export interface UploadSessionFileAttributesSchema {
    originalFileName: string;
    fileHash: string;
    fileSize: number;
    mimeType: string;
    source: 'local' | 'remote';
    /** @min 1 */
    version: number;
}

/** ChapterReadMarkersBatch */
export type ChapterReadMarkerBatchSchema = {
    chapterIdsRead: string[];
    chapterIdsUnread: string[];
};

/** BeginUploadSession */
export interface BeginUploadSessionSchema {
    /** @maxItems 10 */
    groups: string[];
    /**
     * @format uuid
     * @minLength 36
     * @maxLength 36
     */
    manga: string;
}

/** BeginEditSession */
export interface BeginEditSessionSchema {
    /** @min 1 */
    version: number;
}

/** BeginUploadSession */
export interface CommitUploadSessionSchema {
    chapterDraft: ChapterDraftSchema;
    /**
     * ordered list of Upload Session File ids
     * @maxItems 500
     * @minItems 1
     */
    pageOrder: string[];
}

export interface ChapterDraftSchema {
    /**
     * @maxLength 8
     * @pattern ^((0|[1-9]\d*)(\.\d+)?[a-z]?)?$
     */
    volume: string | null;
    /**
     * @maxLength 8
     * @pattern ^((0|[1-9]\d*)(\.\d+)?[a-z]?)?$
     */
    chapter: string | null;
    /** @maxLength 255 */
    title: string | null;
    /** @pattern ^[a-z]{2}(-[a-z]{2})?$ */
    translatedLanguage: string;
    /**
     * @maxLength 512
     * @pattern ^https?://
     */
    externalUrl?: string | null;
    /**
     * @format date-time
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    publishAt?: Date;
}

/** ReportListResponse */
export interface ReportListResponseSchema {
    result: 'ok' | 'error';
    /** @default "collection" */
    response: string;
    data: ReportSchema[];
    limit: number;
    offset: number;
    total: number;
}

/** Report */
export interface ReportSchema {
    /** @format uuid */
    id: string;
    type: 'report';
    attributes: ReportAttributesSchema;
    relationships: RelationshipSchema[];
}

/** ReportAttributes */
export interface ReportAttributesSchema {
    details: string;
    objectId: string;
    status: 'waiting' | 'accepted' | 'refused' | 'autoresolved';
    /** @format date-time */
    createdAt: Date;
}

/** ForumsThreadResponse */
export interface ForumsThreadResponseSchema {
    /** @default "ok" */
    result: string;
    /** @default "entity" */
    response: string;
    data: {
        /** @default "thread" */
        type?: string;
        /** The id for the thread on the forums, accessible at `https://forums.mangadex.org/threads/:id` */
        id?: number;
        attributes?: {
            /** The number of replies so far in the forums thread returned */
            repliesCount?: number;
        };
    };
}

/**
 * ReferenceExpansionAuthor
 * Reference expansion options for author/artist entities or lists
 */
export type ReferenceExpansionAuthorSchema = 'manga'[];

/**
 * ReferenceExpansionApiClient
 * Reference expansion options for api_client entities or lists
 */
export type ReferenceExpansionApiClientSchema = 'creator'[];

/**
 * ReferenceExpansionChapter
 * Reference expansion options for chapter entities or lists
 */
export type ReferenceExpansionChapterSchema = ('manga' | 'scanlation_group' | 'user')[];

/**
 * ReferenceExpansionCoverArt
 * Reference expansion options for cover art entities or lists
 */
export type ReferenceExpansionCoverArtSchema = ('manga' | 'user')[];

/**
 * ReferenceExpansionManga
 * Reference expansion options for manga entities or lists
 */
export type ReferenceExpansionMangaSchema = ('manga' | 'cover_art' | 'author' | 'artist' | 'tag' | 'creator')[];

/**
 * ReferenceExpansionMangaRelation
 * Reference expansion options for manga relation entities or lists
 */
export type ReferenceExpansionMangaRelationSchema = 'manga'[];

/**
 * ReferenceExpansionReport
 * Reference expansion options for user report entities or lists
 */
export type ReferenceExpansionReportSchema = ('user' | 'reason')[];

/**
 * ReferenceExpansionScanlationGroup
 * Reference expansion options for scanlation group entities or lists
 */
export type ReferenceExpansionScanlationGroupSchema = ('leader' | 'member')[];

/**
 * StatisticsDetailsComments
 * Comments-related statistics of an entity.
 * If it is `null`, the entity doesn't have a backing comments thread, and therefore has no comments yet.
 */
export type StatisticsDetailsCommentsSchema = {
    /**
     * The id of the thread backing the comments for that entity on the MangaDex Forums.
     * @min 1
     */
    threadId: number;
    /**
     * The number of replies on the MangaDex Forums thread backing this entity's comments. This excludes the initial comment that opens the thread, which is created by our systems.
     * @min 0
     */
    repliesCount: number;
} | null;

export interface GetSearchMangaParamsSchema {
    /**
     * @min 0
     * @max 100
     * @default 10
     * @pattern ^\d+$
     */
    limit: number;
    /**
     * @min 0
     * @pattern ^\d+$
     */
    offset: number;
    title: string;
    /** @format uuid */
    authorOrArtist: string;
    authors: string[];
    artists: string[];
    /** Year of release or none */
    year: number | 'none';
    includedTags: string[];
    /** @default "AND" */
    includedTagsMode: 'AND' | 'OR';
    excludedTags: string[];
    /** @default "OR" */
    excludedTagsMode: 'AND' | 'OR';
    status: ('ongoing' | 'completed' | 'hiatus' | 'cancelled')[];
    originalLanguage: string[];
    excludedOriginalLanguage: string[];
    availableTranslatedLanguage: string[];
    publicationDemographic: ('shounen' | 'shoujo' | 'josei' | 'seinen' | 'none')[];
    /** Manga ids (limited to 100 per request) */
    ids: string[];
    /** @default ["safe","suggestive","erotica"] */
    contentRating: ('safe' | 'suggestive' | 'erotica' | 'pornographic')[];
    /**
     * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    createdAtSince: string;
    /**
     * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    updatedAtSince: string;
    /** @default {"latestUploadedChapter":"desc"} */
    order: {
        title?: 'asc' | 'desc';
        year?: 'asc' | 'desc';
        createdAt?: 'asc' | 'desc';
        updatedAt?: 'asc' | 'desc';
        latestUploadedChapter?: 'asc' | 'desc';
        followedCount?: 'asc' | 'desc';
        relevance?: 'asc' | 'desc';
        rating?: 'asc' | 'desc';
    };
    /** Reference expansion options for manga entities or lists */
    includes: ReferenceExpansionMangaSchema;
    hasAvailableChapters: boolean;
    /** @format uuid */
    group: string;
}

export interface GetMangaAggregateParamsSchema {
    translatedLanguage: string[];
    groups: string[];
    /**
     * Manga ID
     * @format uuid
     */
    id: string;
}

export interface GetMangaIdParamsSchema {
    /** Reference expansion options for manga entities or lists */
    includes: ReferenceExpansionMangaSchema;
    /**
     * Manga ID
     * @format uuid
     */
    id: string;
}

export interface GetAccountAvailableParamsSchema {
    /**
     * Username to check for avaibility
     * @minLength 1
     * @maxLength 64
     * @pattern ^[a-zA-Z0-9_-]+$
     */
    username: string;
}

export interface GetListApiclientsParamsSchema {
    /**
     * @min 0
     * @max 100
     * @default 10
     */
    limit: number;
    /** @min 0 */
    offset: number;
    state: 'requested' | 'approved' | 'rejected' | 'autoapproved';
    name: string;
    /** Reference expansion options for api_client entities or lists */
    includes: ReferenceExpansionApiClientSchema;
    /** @default {"createdAt":"desc"} */
    order: {
        name?: 'asc' | 'desc';
        createdAt?: 'asc' | 'desc';
        updatedAt?: 'asc' | 'desc';
    };
}

export interface GetApiclientParamsSchema {
    /** Reference expansion options for api_client entities or lists */
    includes: ReferenceExpansionApiClientSchema;
    /**
     * ApiClient ID
     * @format uuid
     */
    id: string;
}

export interface DeleteApiclientParamsSchema {
    /** @pattern ^\d+$ */
    version: string;
    /**
     * ApiClient ID
     * @format uuid
     */
    id: string;
}

export interface GetSearchGroupParamsSchema {
    /**
     * @min 0
     * @max 100
     * @default 10
     */
    limit: number;
    /** @min 0 */
    offset: number;
    /** ScanlationGroup ids (limited to 100 per request) */
    ids: string[];
    name: string;
    focusedLanguage: string;
    /** Reference expansion options for scanlation group entities or lists */
    includes: ReferenceExpansionScanlationGroupSchema;
    /** @default {"latestUploadedChapter":"desc"} */
    order: {
        name?: 'asc' | 'desc';
        createdAt?: 'asc' | 'desc';
        updatedAt?: 'asc' | 'desc';
        followedCount?: 'asc' | 'desc';
        relevance?: 'asc' | 'desc';
    };
}

export interface GetGroupIdParamsSchema {
    /** Reference expansion options for scanlation group entities or lists */
    includes: ReferenceExpansionScanlationGroupSchema;
    /**
     * Scanlation Group ID
     * @format uuid
     */
    id: string;
}

export interface GetUserListParamsSchema {
    /**
     * @min 0
     * @max 100
     * @default 10
     */
    limit: number;
    /** @min 0 */
    offset: number;
}

export interface GetUserIdListParamsSchema {
    /**
     * @min 0
     * @max 100
     * @default 10
     */
    limit: number;
    /** @min 0 */
    offset: number;
    /**
     * User ID
     * @format uuid
     */
    id: string;
}

export interface GetUserParamsSchema {
    /**
     * @min 0
     * @max 100
     * @default 10
     */
    limit: number;
    /** @min 0 */
    offset: number;
    /** User ids (limited to 100 per request) */
    ids: string[];
    username: string;
    order: {
        username?: 'asc' | 'desc';
    };
}

export interface GetChapterParamsSchema {
    /**
     * @min 0
     * @max 100
     * @default 10
     */
    limit: number;
    /** @min 0 */
    offset: number;
    /** Chapter ids (limited to 100 per request) */
    ids: string[];
    title: string;
    groups: string[];
    uploader: string | string[];
    /** @format uuid */
    manga: string;
    volume: string | string[];
    chapter: string | string[];
    translatedLanguage: string[];
    originalLanguage: string[];
    excludedOriginalLanguage: string[];
    /** @default ["safe","suggestive","erotica"] */
    contentRating: ('safe' | 'suggestive' | 'erotica' | 'pornographic')[];
    excludedGroups: string[];
    excludedUploaders: string[];
    /** @default "1" */
    includeFutureUpdates: '0' | '1';
    includeEmptyPages: 0 | 1;
    includeFuturePublishAt: 0 | 1;
    includeExternalUrl: 0 | 1;
    /**
     * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    createdAtSince: string;
    /**
     * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    updatedAtSince: string;
    /**
     * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    publishAtSince: string;
    order: {
        createdAt?: 'asc' | 'desc';
        updatedAt?: 'asc' | 'desc';
        publishAt?: 'asc' | 'desc';
        readableAt?: 'asc' | 'desc';
        volume?: 'asc' | 'desc';
        chapter?: 'asc' | 'desc';
    };
    includes: ('manga' | 'scanlation_group' | 'user')[];
}

export interface GetChapterIdParamsSchema {
    /** Reference expansion options for chapter entities or lists */
    includes: ReferenceExpansionChapterSchema;
    /**
     * Chapter ID
     * @format uuid
     */
    id: string;
}

export interface GetUserFollowsMangaFeedParamsSchema {
    /**
     * @min 1
     * @max 500
     * @default 100
     */
    limit: number;
    /** @min 0 */
    offset: number;
    translatedLanguage: string[];
    originalLanguage: string[];
    excludedOriginalLanguage: string[];
    /** @default ["safe","suggestive","erotica"] */
    contentRating: ('safe' | 'suggestive' | 'erotica' | 'pornographic')[];
    excludedGroups: string[];
    excludedUploaders: string[];
    /** @default "1" */
    includeFutureUpdates: '0' | '1';
    /**
     * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    createdAtSince: string;
    /**
     * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    updatedAtSince: string;
    /**
     * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    publishAtSince: string;
    order: {
        createdAt?: 'asc' | 'desc';
        updatedAt?: 'asc' | 'desc';
        publishAt?: 'asc' | 'desc';
        readableAt?: 'asc' | 'desc';
        volume?: 'asc' | 'desc';
        chapter?: 'asc' | 'desc';
    };
    /** Reference expansion options for chapter entities or lists */
    includes: ReferenceExpansionChapterSchema;
    includeEmptyPages: 0 | 1;
    includeFuturePublishAt: 0 | 1;
    includeExternalUrl: 0 | 1;
}

export interface GetListIdFeedParamsSchema {
    /**
     * @min 1
     * @max 500
     * @default 100
     */
    limit: number;
    /** @min 0 */
    offset: number;
    translatedLanguage: string[];
    originalLanguage: string[];
    excludedOriginalLanguage: string[];
    /** @default ["safe","suggestive","erotica"] */
    contentRating: ('safe' | 'suggestive' | 'erotica' | 'pornographic')[];
    excludedGroups: string[];
    excludedUploaders: string[];
    /** @default "1" */
    includeFutureUpdates: '0' | '1';
    /**
     * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    createdAtSince: string;
    /**
     * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    updatedAtSince: string;
    /**
     * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    publishAtSince: string;
    order: {
        createdAt?: 'asc' | 'desc';
        updatedAt?: 'asc' | 'desc';
        publishAt?: 'asc' | 'desc';
        readableAt?: 'asc' | 'desc';
        volume?: 'asc' | 'desc';
        chapter?: 'asc' | 'desc';
    };
    /** Reference expansion options for chapter entities or lists */
    includes: ReferenceExpansionChapterSchema;
    includeEmptyPages: 0 | 1;
    includeFuturePublishAt: 0 | 1;
    includeExternalUrl: 0 | 1;
    /** @format uuid */
    id: string;
}

export interface GetCoverParamsSchema {
    /**
     * @min 0
     * @max 100
     * @default 10
     */
    limit: number;
    /** @min 0 */
    offset: number;
    /** Manga ids (limited to 100 per request) */
    manga: string[];
    /** Covers ids (limited to 100 per request) */
    ids: string[];
    /** User ids (limited to 100 per request) */
    uploaders: string[];
    /** Locales of cover art (limited to 100 per request) */
    locales: string[];
    order: {
        createdAt?: 'asc' | 'desc';
        updatedAt?: 'asc' | 'desc';
        volume?: 'asc' | 'desc';
    };
    /** Reference expansion options for cover art entities or lists */
    includes: ReferenceExpansionCoverArtSchema;
}

export interface GetCoverIdParamsSchema {
    /** Reference expansion options for cover art entities or lists */
    includes: ReferenceExpansionCoverArtSchema;
    /**
     * Is Manga UUID on POST
     * @format uuid
     */
    mangaOrCoverId: string;
}

export interface GetAuthorParamsSchema {
    /**
     * @min 0
     * @max 100
     * @default 10
     */
    limit: number;
    /** @min 0 */
    offset: number;
    /** Author ids (limited to 100 per request) */
    ids: string[];
    name: string;
    order: {
        name?: 'asc' | 'desc';
    };
    /** Reference expansion options for author/artist entities or lists */
    includes: ReferenceExpansionAuthorSchema;
}

export interface GetAuthorIdParamsSchema {
    /** Reference expansion options for author/artist entities or lists */
    includes: ReferenceExpansionAuthorSchema;
    /**
     * Author ID
     * @format uuid
     */
    id: string;
}

export interface GetMangaIdFeedParamsSchema {
    /**
     * @min 1
     * @max 500
     * @default 100
     */
    limit: number;
    /** @min 0 */
    offset: number;
    translatedLanguage: string[];
    originalLanguage: string[];
    excludedOriginalLanguage: string[];
    /** @default ["safe","suggestive","erotica"] */
    contentRating: ('safe' | 'suggestive' | 'erotica' | 'pornographic')[];
    excludedGroups: string[];
    excludedUploaders: string[];
    /** @default "1" */
    includeFutureUpdates: '0' | '1';
    /**
     * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    createdAtSince: string;
    /**
     * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    updatedAtSince: string;
    /**
     * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
     * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
     */
    publishAtSince: string;
    order: {
        createdAt?: 'asc' | 'desc';
        updatedAt?: 'asc' | 'desc';
        publishAt?: 'asc' | 'desc';
        readableAt?: 'asc' | 'desc';
        volume?: 'asc' | 'desc';
        chapter?: 'asc' | 'desc';
    };
    /** Reference expansion options for chapter entities or lists */
    includes: ReferenceExpansionChapterSchema;
    includeEmptyPages: 0 | 1;
    includeFuturePublishAt: 0 | 1;
    includeExternalUrl: 0 | 1;
    /**
     * Manga ID
     * @format uuid
     */
    id: string;
}

export interface PostMangaChapterReadmarkersParamsSchema {
    /** Adding this will cause the chapter to be stored in the user's reading history */
    updateHistory?: boolean;
    /** @format uuid */
    id: string;
}

export interface GetMangaChapterReadmarkers2ParamsSchema {
    /** Manga ids */
    ids: string[];
    /** Group results by manga ids */
    grouped?: boolean;
}

export interface GetMangaRandomParamsSchema {
    /** Reference expansion options for manga entities or lists */
    includes: ReferenceExpansionMangaSchema;
    /** @default ["safe","suggestive","erotica"] */
    contentRating: ('safe' | 'suggestive' | 'erotica' | 'pornographic')[];
    includedTags: string[];
    /** @default "AND" */
    includedTagsMode: 'AND' | 'OR';
    excludedTags: string[];
    /** @default "OR" */
    excludedTagsMode: 'AND' | 'OR';
}

export interface GetAtHomeServerChapterIdParamsSchema {
    /**
     * Force selecting from MangaDex@Home servers that use the standard HTTPS port 443.
     *
     * While the conventional port for HTTPS traffic is 443 and servers are encouraged to use it, it is not a hard requirement as it technically isn't
     * anything special.
     *
     * However, some misbehaving school/office network will at time block traffic to non-standard ports, and setting this flag to `true` will ensure
     * selection of a server that uses these.
     * @default false
     */
    forcePort443: boolean;
    /**
     * Chapter ID
     * @format uuid
     */
    chapterId: string;
}

export interface GetUserFollowsGroupParamsSchema {
    /**
     * @min 1
     * @max 100
     * @default 10
     */
    limit: number;
    /** @min 0 */
    offset: number;
    /** Reference expansion options for scanlation group entities or lists */
    includes: ReferenceExpansionScanlationGroupSchema;
}

export interface GetUserFollowsUserParamsSchema {
    /**
     * @min 1
     * @max 100
     * @default 10
     */
    limit: number;
    /** @min 0 */
    offset: number;
}

export interface GetUserFollowsMangaParamsSchema {
    /**
     * @min 1
     * @max 100
     * @default 10
     */
    limit: number;
    /** @min 0 */
    offset: number;
    /** Reference expansion options for manga entities or lists */
    includes: ReferenceExpansionMangaSchema;
}

export interface GetUserFollowsListParamsSchema {
    /**
     * @min 1
     * @max 100
     * @default 10
     */
    limit: number;
    /** @min 0 */
    offset: number;
}

export interface GetMangaStatusParamsSchema {
    /** Used to filter the list by given status */
    status: 'reading' | 'on_hold' | 'plan_to_read' | 'dropped' | 're_reading' | 'completed';
}

export interface GetMangaIdDraftParamsSchema {
    /** Reference expansion options for manga entities or lists */
    includes: ReferenceExpansionMangaSchema;
    /** @format uuid */
    id: string;
}

export interface GetMangaDraftsParamsSchema {
    /**
     * @min 1
     * @max 100
     * @default 10
     */
    limit: number;
    /** @min 0 */
    offset: number;
    state: 'draft' | 'submitted' | 'rejected';
    /** @default {"createdAt":"desc"} */
    order: {
        title?: 'asc' | 'desc';
        year?: 'asc' | 'desc';
        createdAt?: 'asc' | 'desc';
        updatedAt?: 'asc' | 'desc';
    };
    /** Reference expansion options for manga entities or lists */
    includes: ReferenceExpansionMangaSchema;
}

export interface GetReportsParamsSchema {
    /**
     * @min 1
     * @max 100
     * @default 10
     */
    limit: number;
    /** @min 0 */
    offset: number;
    category: 'manga' | 'chapter' | 'scanlation_group' | 'user' | 'author';
    /**
     * @format uuid
     * @minLength 36
     * @maxLength 36
     */
    reasonId: string;
    /**
     * @format uuid
     * @minLength 36
     * @maxLength 36
     */
    objectId: string;
    status: 'waiting' | 'accepted' | 'refused' | 'autoresolved';
    /** @default {"createdAt":"desc"} */
    order: {
        createdAt?: 'asc' | 'desc';
    };
    /** Reference expansion options for user report entities or lists */
    includes: ReferenceExpansionReportSchema;
}

export interface GetMangaRelationParamsSchema {
    /** Reference expansion options for manga relation entities or lists */
    includes: ReferenceExpansionMangaRelationSchema;
    /** @format uuid */
    mangaId: string;
}

export interface GetRatingParamsSchema {
    manga: string[];
}

export interface GetStatisticsChaptersParamsSchema {
    chapter: string[];
}

export interface GetStatisticsGroupsParamsSchema {
    group: string[];
}

export interface GetStatisticsMangaParamsSchema {
    manga: string[];
}

export namespace Ping {
    /**
     * @description Returns a plaintext response containing only the word "pong" if the API is healthy
     * @tags Infrastructure
     * @name GetPing
     * @summary Ping healthcheck
     * @request GET:/ping
     */
    export namespace GetPing {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = string;
    }
}

export namespace Manga {
    /**
     * @description Search a list of Manga.
     * @tags Manga
     * @name GetSearchManga
     * @summary Manga list
     * @request GET:/manga
     */
    export namespace GetSearchManga {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 0
             * @max 100
             * @default 10
             * @pattern ^\d+$
             */
            limit?: number;
            /**
             * @min 0
             * @pattern ^\d+$
             */
            offset?: number;
            title?: string;
            /** @format uuid */
            authorOrArtist?: string;
            authors?: string[];
            artists?: string[];
            /** Year of release or none */
            year?: number | 'none';
            includedTags?: string[];
            /** @default "AND" */
            includedTagsMode?: 'AND' | 'OR';
            excludedTags?: string[];
            /** @default "OR" */
            excludedTagsMode?: 'AND' | 'OR';
            status?: ('ongoing' | 'completed' | 'hiatus' | 'cancelled')[];
            originalLanguage?: string[];
            excludedOriginalLanguage?: string[];
            availableTranslatedLanguage?: string[];
            publicationDemographic?: ('shounen' | 'shoujo' | 'josei' | 'seinen' | 'none')[];
            /** Manga ids (limited to 100 per request) */
            ids?: string[];
            /** @default ["safe","suggestive","erotica"] */
            contentRating?: ('safe' | 'suggestive' | 'erotica' | 'pornographic')[];
            /**
             * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
             * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
             */
            createdAtSince?: string;
            /**
             * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
             * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
             */
            updatedAtSince?: string;
            /** @default {"latestUploadedChapter":"desc"} */
            order?: {
                title?: 'asc' | 'desc';
                year?: 'asc' | 'desc';
                createdAt?: 'asc' | 'desc';
                updatedAt?: 'asc' | 'desc';
                latestUploadedChapter?: 'asc' | 'desc';
                followedCount?: 'asc' | 'desc';
                relevance?: 'asc' | 'desc';
                rating?: 'asc' | 'desc';
            };
            /** Reference expansion options for manga entities or lists */
            includes?: ReferenceExpansionMangaSchema;
            hasAvailableChapters?: '0' | '1' | 'true' | 'false';
            /** @format uuid */
            group?: string;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = MangaListSchema;
    }
    /**
     * @description Create a new Manga.
     * @tags Manga
     * @name PostManga
     * @summary Create Manga
     * @request POST:/manga
     * @secure
     */
    export namespace PostManga {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = MangaCreateSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = MangaResponseSchema;
    }
    /**
     * No description
     * @tags Manga
     * @name GetMangaAggregate
     * @summary Get Manga volumes & chapters
     * @request GET:/manga/{id}/aggregate
     */
    export namespace GetMangaAggregate {
        export type RequestParams = {
            /**
             * Manga ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {
            translatedLanguage?: string[];
            groups?: string[];
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            volumes?: Record<
                string,
                {
                    volume?: string;
                    count?: number;
                    chapters?: Record<
                        string,
                        {
                            chapter?: string;
                            /** @format uuid */
                            id?: string;
                            others?: string[];
                            count?: number;
                        }
                    >;
                }
            >;
        };
    }
    /**
     * @description Get Manga.
     * @tags Manga
     * @name GetMangaId
     * @summary Get Manga
     * @request GET:/manga/{id}
     */
    export namespace GetMangaId {
        export type RequestParams = {
            /**
             * Manga ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {
            /** Reference expansion options for manga entities or lists */
            includes?: ReferenceExpansionMangaSchema;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = MangaResponseSchema;
    }
    /**
     * No description
     * @tags Manga
     * @name PutMangaId
     * @summary Update Manga
     * @request PUT:/manga/{id}
     * @secure
     */
    export namespace PutMangaId {
        export type RequestParams = {
            /**
             * Manga ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = MangaEditSchema & {
            artists?: string[];
            authors?: string[];
        };
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = MangaResponseSchema;
    }
    /**
     * No description
     * @tags Manga
     * @name DeleteMangaId
     * @summary Delete Manga
     * @request DELETE:/manga/{id}
     * @secure
     */
    export namespace DeleteMangaId {
        export type RequestParams = {
            /**
             * Manga ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags CustomList
     * @name PostMangaIdListListId
     * @summary Add Manga in CustomList
     * @request POST:/manga/{id}/list/{listId}
     * @secure
     */
    export namespace PostMangaIdListListId {
        export type RequestParams = {
            /**
             * Manga ID
             * @format uuid
             */
            id: string;
            /**
             * CustomList ID
             * @format uuid
             */
            listId: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags CustomList
     * @name DeleteMangaIdListListId
     * @summary Remove Manga in CustomList
     * @request DELETE:/manga/{id}/list/{listId}
     * @secure
     */
    export namespace DeleteMangaIdListListId {
        export type RequestParams = {
            /**
             * Manga ID
             * @format uuid
             */
            id: string;
            /**
             * CustomList ID
             * @format uuid
             */
            listId: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags Manga
     * @name DeleteMangaIdFollow
     * @summary Unfollow Manga
     * @request DELETE:/manga/{id}/follow
     * @secure
     */
    export namespace DeleteMangaIdFollow {
        export type RequestParams = {
            /** @format uuid */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags Manga
     * @name PostMangaIdFollow
     * @summary Follow Manga
     * @request POST:/manga/{id}/follow
     * @secure
     */
    export namespace PostMangaIdFollow {
        export type RequestParams = {
            /** @format uuid */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags Manga
     * @name GetMangaIdFeed
     * @summary Manga feed
     * @request GET:/manga/{id}/feed
     */
    export namespace GetMangaIdFeed {
        export type RequestParams = {
            /**
             * Manga ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {
            /**
             * @min 1
             * @max 500
             * @default 100
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
            translatedLanguage?: string[];
            originalLanguage?: string[];
            excludedOriginalLanguage?: string[];
            /** @default ["safe","suggestive","erotica"] */
            contentRating?: ('safe' | 'suggestive' | 'erotica' | 'pornographic')[];
            excludedGroups?: string[];
            excludedUploaders?: string[];
            /** @default "1" */
            includeFutureUpdates?: '0' | '1';
            /**
             * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
             * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
             */
            createdAtSince?: string;
            /**
             * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
             * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
             */
            updatedAtSince?: string;
            /**
             * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
             * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
             */
            publishAtSince?: string;
            order?: {
                createdAt?: 'asc' | 'desc';
                updatedAt?: 'asc' | 'desc';
                publishAt?: 'asc' | 'desc';
                readableAt?: 'asc' | 'desc';
                volume?: 'asc' | 'desc';
                chapter?: 'asc' | 'desc';
            };
            /** Reference expansion options for chapter entities or lists */
            includes?: ReferenceExpansionChapterSchema;
            includeEmptyPages?: 0 | 1;
            includeFuturePublishAt?: 0 | 1;
            includeExternalUrl?: 0 | 1;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ChapterListSchema;
    }
    /**
     * @description A list of chapter ids that are marked as read for the specified manga
     * @tags ReadMarker
     * @name GetMangaChapterReadmarkers
     * @summary Manga read markers
     * @request GET:/manga/{id}/read
     * @secure
     */
    export namespace GetMangaChapterReadmarkers {
        export type RequestParams = {
            /** @format uuid */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            result?: 'ok';
            data?: string[];
        };
    }
    /**
     * @description Send a lot of chapter ids for one manga to mark as read and/or unread
     * @tags ReadMarker
     * @name PostMangaChapterReadmarkers
     * @summary Manga read markers batch
     * @request POST:/manga/{id}/read
     * @secure
     */
    export namespace PostMangaChapterReadmarkers {
        export type RequestParams = {
            /** @format uuid */
            id: string;
        };
        export type RequestQuery = {
            /** Adding this will cause the chapter to be stored in the user's reading history */
            updateHistory?: boolean;
        };
        export type RequestBody = ChapterReadMarkerBatchSchema;
        export type RequestHeaders = {};
        export type ResponseBody = {
            result?: 'ok';
        };
    }
    /**
     * @description A list of chapter ids that are marked as read for the given manga ids
     * @tags ReadMarker
     * @name GetMangaChapterReadmarkers2
     * @summary Manga read markers
     * @request GET:/manga/read
     * @secure
     */
    export namespace GetMangaChapterReadmarkers2 {
        export type RequestParams = {};
        export type RequestQuery = {
            /** Manga ids */
            ids: string[];
            /** Group results by manga ids */
            grouped?: boolean;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            result?: 'ok';
            data?: string[] | Record<string, string[]>;
        };
    }
    /**
     * No description
     * @tags Manga
     * @name GetMangaRandom
     * @summary Get a random Manga
     * @request GET:/manga/random
     */
    export namespace GetMangaRandom {
        export type RequestParams = {};
        export type RequestQuery = {
            /** Reference expansion options for manga entities or lists */
            includes?: ReferenceExpansionMangaSchema;
            /** @default ["safe","suggestive","erotica"] */
            contentRating?: ('safe' | 'suggestive' | 'erotica' | 'pornographic')[];
            includedTags?: string[];
            /** @default "AND" */
            includedTagsMode?: 'AND' | 'OR';
            excludedTags?: string[];
            /** @default "OR" */
            excludedTagsMode?: 'AND' | 'OR';
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = MangaResponseSchema;
    }
    /**
     * No description
     * @tags Manga
     * @name GetMangaTag
     * @summary Tag list
     * @request GET:/manga/tag
     */
    export namespace GetMangaTag {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = TagResponseSchema;
    }
    /**
     * No description
     * @tags Manga
     * @name GetMangaStatus
     * @summary Get all Manga reading status for logged User
     * @request GET:/manga/status
     * @secure
     */
    export namespace GetMangaStatus {
        export type RequestParams = {};
        export type RequestQuery = {
            /** Used to filter the list by given status */
            status?: 'reading' | 'on_hold' | 'plan_to_read' | 'dropped' | 're_reading' | 'completed';
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            statuses?: Record<string, 'reading' | 'on_hold' | 'plan_to_read' | 'dropped' | 're_reading' | 'completed'>;
        };
    }
    /**
     * No description
     * @tags Manga
     * @name GetMangaIdStatus
     * @summary Get a Manga reading status
     * @request GET:/manga/{id}/status
     * @secure
     */
    export namespace GetMangaIdStatus {
        export type RequestParams = {
            /** @format uuid */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            status?: 'reading' | 'on_hold' | 'plan_to_read' | 'dropped' | 're_reading' | 'completed';
        };
    }
    /**
     * No description
     * @tags Manga
     * @name PostMangaIdStatus
     * @summary Update Manga reading status
     * @request POST:/manga/{id}/status
     * @secure
     */
    export namespace PostMangaIdStatus {
        export type RequestParams = {
            /** @format uuid */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = UpdateMangaStatusSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags Manga
     * @name GetMangaIdDraft
     * @summary Get a specific Manga Draft
     * @request GET:/manga/draft/{id}
     * @secure
     */
    export namespace GetMangaIdDraft {
        export type RequestParams = {
            /** @format uuid */
            id: string;
        };
        export type RequestQuery = {
            /** Reference expansion options for manga entities or lists */
            includes?: ReferenceExpansionMangaSchema;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = MangaResponseSchema;
    }
    /**
     * No description
     * @tags Manga
     * @name CommitMangaDraft
     * @summary Submit a Manga Draft
     * @request POST:/manga/draft/{id}/commit
     * @secure
     */
    export namespace CommitMangaDraft {
        export type RequestParams = {
            /** @format uuid */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = {
            /** @min 1 */
            version?: number;
        };
        export type RequestHeaders = {};
        export type ResponseBody = MangaResponseSchema;
    }
    /**
     * No description
     * @tags Manga
     * @name GetMangaDrafts
     * @summary Get a list of Manga Drafts
     * @request GET:/manga/draft
     * @secure
     */
    export namespace GetMangaDrafts {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 1
             * @max 100
             * @default 10
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
            state?: 'draft' | 'submitted' | 'rejected';
            /** @default {"createdAt":"desc"} */
            order?: {
                title?: 'asc' | 'desc';
                year?: 'asc' | 'desc';
                createdAt?: 'asc' | 'desc';
                updatedAt?: 'asc' | 'desc';
            };
            /** Reference expansion options for manga entities or lists */
            includes?: ReferenceExpansionMangaSchema;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = MangaResponseSchema;
    }
    /**
     * No description
     * @tags Manga
     * @name GetMangaRelation
     * @summary Manga relation list
     * @request GET:/manga/{mangaId}/relation
     */
    export namespace GetMangaRelation {
        export type RequestParams = {
            /** @format uuid */
            mangaId: string;
        };
        export type RequestQuery = {
            /** Reference expansion options for manga relation entities or lists */
            includes?: ReferenceExpansionMangaRelationSchema;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = MangaRelationListSchema;
    }
    /**
     * @description Create a new Manga relation.
     * @tags Manga
     * @name PostMangaRelation
     * @summary Create Manga relation
     * @request POST:/manga/{mangaId}/relation
     * @secure
     */
    export namespace PostMangaRelation {
        export type RequestParams = {
            /** @format uuid */
            mangaId: string;
        };
        export type RequestQuery = {};
        export type RequestBody = MangaRelationCreateSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = MangaRelationResponseSchema;
    }
    /**
     * No description
     * @tags Manga
     * @name DeleteMangaRelationId
     * @summary Delete Manga relation
     * @request DELETE:/manga/{mangaId}/relation/{id}
     * @secure
     */
    export namespace DeleteMangaRelationId {
        export type RequestParams = {
            /** @format uuid */
            mangaId: string;
            /** @format uuid */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
}

export namespace Auth {
    /**
     * No description
     * @tags Authentication
     * @name PostAuthLogin
     * @summary Login
     * @request POST:/auth/login
     * @deprecated
     */
    export namespace PostAuthLogin {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = LoginSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = LoginResponseSchema;
    }
    /**
     * @description The returned list of permissions is computed depending on the generic role permissions that the token user has, their personal overrides, and the OpenID scopes of the token (we do not offer granular token permissions yet)
     * @tags Authentication
     * @name GetAuthCheck
     * @summary Check the set of permissions associated with the current token
     * @request GET:/auth/check
     * @secure
     */
    export namespace GetAuthCheck {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = CheckResponseSchema;
    }
    /**
     * No description
     * @tags Authentication
     * @name PostAuthLogout
     * @summary Logout
     * @request POST:/auth/logout
     * @deprecated
     * @secure
     */
    export namespace PostAuthLogout {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = LogoutResponseSchema;
    }
    /**
     * No description
     * @tags Authentication
     * @name PostAuthRefresh
     * @summary Refresh token
     * @request POST:/auth/refresh
     * @deprecated
     */
    export namespace PostAuthRefresh {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = RefreshTokenSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = RefreshResponseSchema;
    }
}

export namespace Account {
    /**
     * No description
     * @tags Account
     * @name GetAccountAvailable
     * @summary Account username available
     * @request GET:/account/available
     * @deprecated
     */
    export namespace GetAccountAvailable {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * Username to check for avaibility
             * @minLength 1
             * @maxLength 64
             * @pattern ^[a-zA-Z0-9_-]+$
             */
            username: string;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            available?: boolean;
        };
    }
    /**
     * No description
     * @tags Account
     * @name PostAccountCreate
     * @summary Create Account
     * @request POST:/account/create
     * @deprecated
     */
    export namespace PostAccountCreate {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = CreateAccountSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = UserResponseSchema;
    }
    /**
     * No description
     * @tags Account
     * @name GetAccountActivateCode
     * @summary Activate account
     * @request POST:/account/activate/{code}
     * @deprecated
     */
    export namespace GetAccountActivateCode {
        export type RequestParams = {
            /** @pattern [0-9a-fA-F-]+ */
            code: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = AccountActivateResponseSchema;
    }
    /**
     * No description
     * @tags Account
     * @name PostAccountActivateResend
     * @summary Resend Activation code
     * @request POST:/account/activate/resend
     * @deprecated
     */
    export namespace PostAccountActivateResend {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = SendAccountActivationCodeSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = AccountActivateResponseSchema;
    }
    /**
     * @description You can only request Account Recovery once per Hour for the same Email Address
     * @tags Account
     * @name PostAccountRecover
     * @summary Recover given Account
     * @request POST:/account/recover
     * @deprecated
     */
    export namespace PostAccountRecover {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = SendAccountActivationCodeSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = AccountActivateResponseSchema;
    }
    /**
     * No description
     * @tags Account
     * @name PostAccountRecoverCode
     * @summary Complete Account recover
     * @request POST:/account/recover/{code}
     * @deprecated
     */
    export namespace PostAccountRecoverCode {
        export type RequestParams = {
            code: string;
        };
        export type RequestQuery = {};
        export type RequestBody = RecoverCompleteBodySchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = AccountActivateResponseSchema;
    }
}

export namespace Client {
    /**
     * No description
     * @tags ApiClient
     * @name GetListApiclients
     * @summary List own Api Clients
     * @request GET:/client
     * @secure
     */
    export namespace GetListApiclients {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 0
             * @max 100
             * @default 10
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
            state?: 'requested' | 'approved' | 'rejected' | 'autoapproved';
            name?: string;
            /** Reference expansion options for api_client entities or lists */
            includes?: ReferenceExpansionApiClientSchema;
            /** @default {"createdAt":"desc"} */
            order?: {
                name?: 'asc' | 'desc';
                createdAt?: 'asc' | 'desc';
                updatedAt?: 'asc' | 'desc';
            };
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ApiClientListSchema;
    }
    /**
     * No description
     * @tags ApiClient
     * @name PostCreateApiclient
     * @summary Create ApiClient
     * @request POST:/client
     * @secure
     */
    export namespace PostCreateApiclient {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = ApiClientCreateSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = ApiClientResponseSchema;
    }
    /**
     * No description
     * @tags ApiClient
     * @name GetApiclient
     * @summary Get Api Client by ID
     * @request GET:/client/{id}
     * @secure
     */
    export namespace GetApiclient {
        export type RequestParams = {
            /**
             * ApiClient ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {
            /** Reference expansion options for api_client entities or lists */
            includes?: ReferenceExpansionApiClientSchema;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ApiClientResponseSchema;
    }
    /**
     * No description
     * @tags ApiClient
     * @name PostEditApiclient
     * @summary Edit ApiClient
     * @request POST:/client/{id}
     * @secure
     */
    export namespace PostEditApiclient {
        export type RequestParams = {
            /**
             * ApiClient ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = ApiClientEditSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = ApiClientResponseSchema;
    }
    /**
     * No description
     * @tags ApiClient
     * @name DeleteApiclient
     * @summary Delete Api Client
     * @request DELETE:/client/{id}
     * @secure
     */
    export namespace DeleteApiclient {
        export type RequestParams = {
            /**
             * ApiClient ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {
            /** @pattern ^\d+$ */
            version?: string;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
        };
    }
    /**
     * No description
     * @tags ApiClient
     * @name GetApiclientSecret
     * @summary Get Secret for Client by ID
     * @request GET:/client/{id}/secret
     * @secure
     */
    export namespace GetApiclientSecret {
        export type RequestParams = {
            /**
             * ApiClient ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            result?: 'ok';
            data?: string;
        };
    }
    /**
     * No description
     * @tags ApiClient
     * @name PostRegenerateApiclientSecret
     * @summary Regenerate Client Secret
     * @request POST:/client/{id}/secret
     * @secure
     */
    export namespace PostRegenerateApiclientSecret {
        export type RequestParams = {
            /**
             * ApiClient ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = object;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = {
            result?: 'ok';
            data?: string;
        };
    }
}

export namespace Group {
    /**
     * No description
     * @tags ScanlationGroup
     * @name GetSearchGroup
     * @summary Scanlation Group list
     * @request GET:/group
     */
    export namespace GetSearchGroup {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 0
             * @max 100
             * @default 10
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
            /** ScanlationGroup ids (limited to 100 per request) */
            ids?: string[];
            name?: string;
            focusedLanguage?: string;
            /** Reference expansion options for scanlation group entities or lists */
            includes?: ReferenceExpansionScanlationGroupSchema;
            /** @default {"latestUploadedChapter":"desc"} */
            order?: {
                name?: 'asc' | 'desc';
                createdAt?: 'asc' | 'desc';
                updatedAt?: 'asc' | 'desc';
                followedCount?: 'asc' | 'desc';
                relevance?: 'asc' | 'desc';
            };
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ScanlationGroupListSchema;
    }
    /**
     * No description
     * @tags ScanlationGroup
     * @name PostGroup
     * @summary Create Scanlation Group
     * @request POST:/group
     * @secure
     */
    export namespace PostGroup {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = CreateScanlationGroupSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = ScanlationGroupResponseSchema;
    }
    /**
     * No description
     * @tags ScanlationGroup
     * @name GetGroupId
     * @summary Get Scanlation Group
     * @request GET:/group/{id}
     */
    export namespace GetGroupId {
        export type RequestParams = {
            /**
             * Scanlation Group ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {
            /** Reference expansion options for scanlation group entities or lists */
            includes?: ReferenceExpansionScanlationGroupSchema;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ScanlationGroupResponseSchema;
    }
    /**
     * No description
     * @tags ScanlationGroup
     * @name PutGroupId
     * @summary Update Scanlation Group
     * @request PUT:/group/{id}
     * @secure
     */
    export namespace PutGroupId {
        export type RequestParams = {
            /**
             * Scanlation Group ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = ScanlationGroupEditSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = ScanlationGroupResponseSchema;
    }
    /**
     * No description
     * @tags ScanlationGroup
     * @name DeleteGroupId
     * @summary Delete Scanlation Group
     * @request DELETE:/group/{id}
     * @secure
     */
    export namespace DeleteGroupId {
        export type RequestParams = {
            /**
             * Scanlation Group ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags ScanlationGroup
     * @name PostGroupIdFollow
     * @summary Follow Scanlation Group
     * @request POST:/group/{id}/follow
     * @secure
     */
    export namespace PostGroupIdFollow {
        export type RequestParams = {
            /** @format uuid */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags ScanlationGroup
     * @name DeleteGroupIdFollow
     * @summary Unfollow Scanlation Group
     * @request DELETE:/group/{id}/follow
     * @secure
     */
    export namespace DeleteGroupIdFollow {
        export type RequestParams = {
            /** @format uuid */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
}

export namespace List {
    /**
     * No description
     * @tags CustomList
     * @name PostList
     * @summary Create CustomList
     * @request POST:/list
     * @secure
     */
    export namespace PostList {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = CustomListCreateSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = CustomListResponseSchema;
    }
    /**
     * No description
     * @tags CustomList
     * @name GetListId
     * @summary Get CustomList
     * @request GET:/list/{id}
     */
    export namespace GetListId {
        export type RequestParams = {
            /**
             * CustomList ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = CustomListResponseSchema;
    }
    /**
     * @description The size of the body is limited to 8KB.
     * @tags CustomList
     * @name PutListId
     * @summary Update CustomList
     * @request PUT:/list/{id}
     * @secure
     */
    export namespace PutListId {
        export type RequestParams = {
            /**
             * CustomList ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = CustomListEditSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = CustomListResponseSchema;
    }
    /**
     * No description
     * @tags CustomList
     * @name DeleteListId
     * @summary Delete CustomList
     * @request DELETE:/list/{id}
     * @secure
     */
    export namespace DeleteListId {
        export type RequestParams = {
            /**
             * CustomList ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * @description The request body is empty
     * @tags CustomList
     * @name FollowListId
     * @summary Follow CustomList
     * @request POST:/list/{id}/follow
     * @secure
     */
    export namespace FollowListId {
        export type RequestParams = {
            /**
             * CustomList ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = object;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = {
            result?: 'ok';
        };
    }
    /**
     * @description The request body is empty
     * @tags CustomList
     * @name UnfollowListId
     * @summary Unfollow CustomList
     * @request DELETE:/list/{id}/follow
     * @secure
     */
    export namespace UnfollowListId {
        export type RequestParams = {
            /**
             * CustomList ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = object;
        export type RequestHeaders = {};
        export type ResponseBody = {
            result?: 'ok';
        };
    }
    /**
     * No description
     * @tags Feed
     * @name GetListIdFeed
     * @summary CustomList Manga feed
     * @request GET:/list/{id}/feed
     */
    export namespace GetListIdFeed {
        export type RequestParams = {
            /** @format uuid */
            id: string;
        };
        export type RequestQuery = {
            /**
             * @min 1
             * @max 500
             * @default 100
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
            translatedLanguage?: string[];
            originalLanguage?: string[];
            excludedOriginalLanguage?: string[];
            /** @default ["safe","suggestive","erotica"] */
            contentRating?: ('safe' | 'suggestive' | 'erotica' | 'pornographic')[];
            excludedGroups?: string[];
            excludedUploaders?: string[];
            /** @default "1" */
            includeFutureUpdates?: '0' | '1';
            /**
             * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
             * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
             */
            createdAtSince?: string;
            /**
             * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
             * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
             */
            updatedAtSince?: string;
            /**
             * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
             * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
             */
            publishAtSince?: string;
            order?: {
                createdAt?: 'asc' | 'desc';
                updatedAt?: 'asc' | 'desc';
                publishAt?: 'asc' | 'desc';
                readableAt?: 'asc' | 'desc';
                volume?: 'asc' | 'desc';
                chapter?: 'asc' | 'desc';
            };
            /** Reference expansion options for chapter entities or lists */
            includes?: ReferenceExpansionChapterSchema;
            includeEmptyPages?: 0 | 1;
            includeFuturePublishAt?: 0 | 1;
            includeExternalUrl?: 0 | 1;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ChapterListSchema;
    }
}

export namespace User {
    /**
     * @description This will list public and private CustomList
     * @tags CustomList
     * @name GetUserList
     * @summary Get logged User CustomList list
     * @request GET:/user/list
     * @secure
     */
    export namespace GetUserList {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 0
             * @max 100
             * @default 10
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = CustomListListSchema;
    }
    /**
     * @description This will list only public CustomList
     * @tags CustomList
     * @name GetUserIdList
     * @summary Get User's CustomList list
     * @request GET:/user/{id}/list
     */
    export namespace GetUserIdList {
        export type RequestParams = {
            /**
             * User ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {
            /**
             * @min 0
             * @max 100
             * @default 10
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = CustomListListSchema;
    }
    /**
     * No description
     * @tags User
     * @name GetUser
     * @summary User list
     * @request GET:/user
     * @secure
     */
    export namespace GetUser {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 0
             * @max 100
             * @default 10
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
            /** User ids (limited to 100 per request) */
            ids?: string[];
            username?: string;
            order?: {
                username?: 'asc' | 'desc';
            };
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = UserListSchema;
    }
    /**
     * No description
     * @tags User
     * @name GetUserId
     * @summary Get User
     * @request GET:/user/{id}
     */
    export namespace GetUserId {
        export type RequestParams = {
            /**
             * User ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = UserResponseSchema;
    }
    /**
     * No description
     * @tags User
     * @name DeleteUserId
     * @summary Delete User
     * @request DELETE:/user/{id}
     * @deprecated
     * @secure
     */
    export namespace DeleteUserId {
        export type RequestParams = {
            /**
             * User ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags User
     * @name PostUserDeleteCode
     * @summary Approve User deletion
     * @request POST:/user/delete/{code}
     * @deprecated
     */
    export namespace PostUserDeleteCode {
        export type RequestParams = {
            /**
             * User delete code
             * @format uuid
             */
            code: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags User
     * @name PostUserPassword
     * @summary Update User password
     * @request POST:/user/password
     * @deprecated
     * @secure
     */
    export namespace PostUserPassword {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = {
            /**
             * @minLength 8
             * @maxLength 1024
             */
            oldPassword: string;
            /**
             * @minLength 8
             * @maxLength 1024
             */
            newPassword: string;
        };
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags User
     * @name PostUserEmail
     * @summary Update User email
     * @request POST:/user/email
     * @deprecated
     * @secure
     */
    export namespace PostUserEmail {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = {
            /** @format email */
            email: string;
        };
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags Feed
     * @name GetUserFollowsMangaFeed
     * @summary Get logged User followed Manga feed (Chapter list)
     * @request GET:/user/follows/manga/feed
     * @secure
     */
    export namespace GetUserFollowsMangaFeed {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 1
             * @max 500
             * @default 100
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
            translatedLanguage?: string[];
            originalLanguage?: string[];
            excludedOriginalLanguage?: string[];
            /** @default ["safe","suggestive","erotica"] */
            contentRating?: ('safe' | 'suggestive' | 'erotica' | 'pornographic')[];
            excludedGroups?: string[];
            excludedUploaders?: string[];
            /** @default "1" */
            includeFutureUpdates?: '0' | '1';
            /**
             * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
             * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
             */
            createdAtSince?: string;
            /**
             * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
             * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
             */
            updatedAtSince?: string;
            /**
             * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
             * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
             */
            publishAtSince?: string;
            order?: {
                createdAt?: 'asc' | 'desc';
                updatedAt?: 'asc' | 'desc';
                publishAt?: 'asc' | 'desc';
                readableAt?: 'asc' | 'desc';
                volume?: 'asc' | 'desc';
                chapter?: 'asc' | 'desc';
            };
            /** Reference expansion options for chapter entities or lists */
            includes?: ReferenceExpansionChapterSchema;
            includeEmptyPages?: 0 | 1;
            includeFuturePublishAt?: 0 | 1;
            includeExternalUrl?: 0 | 1;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ChapterListSchema;
    }
    /**
     * No description
     * @tags User
     * @name GetUserMe
     * @summary Logged User details
     * @request GET:/user/me
     * @secure
     */
    export namespace GetUserMe {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = UserResponseSchema;
    }
    /**
     * No description
     * @tags Follows
     * @name GetUserFollowsGroup
     * @summary Get logged User followed Groups
     * @request GET:/user/follows/group
     * @secure
     */
    export namespace GetUserFollowsGroup {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 1
             * @max 100
             * @default 10
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
            /** Reference expansion options for scanlation group entities or lists */
            includes?: ReferenceExpansionScanlationGroupSchema;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ScanlationGroupListSchema;
    }
    /**
     * No description
     * @tags Follows
     * @name GetUserFollowsGroupId
     * @summary Check if logged User follows a Group
     * @request GET:/user/follows/group/{id}
     * @secure
     */
    export namespace GetUserFollowsGroupId {
        export type RequestParams = {
            /**
             * Scanlation Group id
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags Follows
     * @name GetUserFollowsUser
     * @summary Get logged User followed User list
     * @request GET:/user/follows/user
     * @secure
     */
    export namespace GetUserFollowsUser {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 1
             * @max 100
             * @default 10
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = UserListSchema;
    }
    /**
     * No description
     * @tags Follows
     * @name GetUserFollowsUserId
     * @summary Check if logged User follows a User
     * @request GET:/user/follows/user/{id}
     * @secure
     */
    export namespace GetUserFollowsUserId {
        export type RequestParams = {
            /**
             * User id
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags Follows
     * @name GetUserFollowsManga
     * @summary Get logged User followed Manga list
     * @request GET:/user/follows/manga
     * @secure
     */
    export namespace GetUserFollowsManga {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 1
             * @max 100
             * @default 10
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
            /** Reference expansion options for manga entities or lists */
            includes?: ReferenceExpansionMangaSchema;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = MangaListSchema;
    }
    /**
     * No description
     * @tags Follows
     * @name GetUserFollowsMangaId
     * @summary Check if logged User follows a Manga
     * @request GET:/user/follows/manga/{id}
     * @secure
     */
    export namespace GetUserFollowsMangaId {
        export type RequestParams = {
            /**
             * Manga id
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags Follows
     * @name GetUserFollowsList
     * @summary Get logged User followed CustomList list
     * @request GET:/user/follows/list
     * @secure
     */
    export namespace GetUserFollowsList {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 1
             * @max 100
             * @default 10
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = CustomListListSchema;
    }
    /**
     * No description
     * @tags Follows
     * @name GetUserFollowsListId
     * @summary Check if logged User follows a CustomList
     * @request GET:/user/follows/list/{id}
     * @secure
     */
    export namespace GetUserFollowsListId {
        export type RequestParams = {
            /**
             * CustomList id
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags ReadMarker
     * @name GetReadingHistory
     * @summary Get users reading history
     * @request GET:/user/history
     * @secure
     */
    export namespace GetReadingHistory {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            ratings?: {
                chapterId?: string;
                /** @format date-time */
                readDate?: Date;
            }[];
        };
    }
}

export namespace Chapter {
    /**
     * @description Chapter list. If you want the Chapters of a given Manga, please check the feed endpoints.
     * @tags Chapter
     * @name GetChapter
     * @summary Chapter list
     * @request GET:/chapter
     */
    export namespace GetChapter {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 0
             * @max 100
             * @default 10
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
            /** Chapter ids (limited to 100 per request) */
            ids?: string[];
            title?: string;
            groups?: string[];
            uploader?: string | string[];
            /** @format uuid */
            manga?: string;
            volume?: string | string[];
            chapter?: string | string[];
            translatedLanguage?: string[];
            originalLanguage?: string[];
            excludedOriginalLanguage?: string[];
            /** @default ["safe","suggestive","erotica"] */
            contentRating?: ('safe' | 'suggestive' | 'erotica' | 'pornographic')[];
            excludedGroups?: string[];
            excludedUploaders?: string[];
            /** @default "1" */
            includeFutureUpdates?: '0' | '1';
            includeEmptyPages?: 0 | 1;
            includeFuturePublishAt?: 0 | 1;
            includeExternalUrl?: 0 | 1;
            /**
             * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
             * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
             */
            createdAtSince?: string;
            /**
             * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
             * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
             */
            updatedAtSince?: string;
            /**
             * DateTime string with following format: YYYY-MM-DDTHH:MM:SS in timezone UTC+0
             * @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
             */
            publishAtSince?: string;
            order?: {
                createdAt?: 'asc' | 'desc';
                updatedAt?: 'asc' | 'desc';
                publishAt?: 'asc' | 'desc';
                readableAt?: 'asc' | 'desc';
                volume?: 'asc' | 'desc';
                chapter?: 'asc' | 'desc';
            };
            includes?: ('manga' | 'scanlation_group' | 'user')[];
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ChapterListSchema;
    }
    /**
     * No description
     * @tags Chapter
     * @name GetChapterId
     * @summary Get Chapter
     * @request GET:/chapter/{id}
     */
    export namespace GetChapterId {
        export type RequestParams = {
            /**
             * Chapter ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {
            /** Reference expansion options for chapter entities or lists */
            includes?: ReferenceExpansionChapterSchema;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ChapterResponseSchema;
    }
    /**
     * No description
     * @tags Chapter
     * @name PutChapterId
     * @summary Update Chapter
     * @request PUT:/chapter/{id}
     * @secure
     */
    export namespace PutChapterId {
        export type RequestParams = {
            /**
             * Chapter ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = ChapterEditSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = ChapterResponseSchema;
    }
    /**
     * No description
     * @tags Chapter
     * @name DeleteChapterId
     * @summary Delete Chapter
     * @request DELETE:/chapter/{id}
     * @secure
     */
    export namespace DeleteChapterId {
        export type RequestParams = {
            /**
             * Chapter ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
}

export namespace Cover {
    /**
     * No description
     * @tags Cover
     * @name GetCover
     * @summary CoverArt list
     * @request GET:/cover
     */
    export namespace GetCover {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 0
             * @max 100
             * @default 10
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
            /** Manga ids (limited to 100 per request) */
            manga?: string[];
            /** Covers ids (limited to 100 per request) */
            ids?: string[];
            /** User ids (limited to 100 per request) */
            uploaders?: string[];
            /** Locales of cover art (limited to 100 per request) */
            locales?: string[];
            order?: {
                createdAt?: 'asc' | 'desc';
                updatedAt?: 'asc' | 'desc';
                volume?: 'asc' | 'desc';
            };
            /** Reference expansion options for cover art entities or lists */
            includes?: ReferenceExpansionCoverArtSchema;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = CoverListSchema;
    }
    /**
     * No description
     * @tags Cover
     * @name UploadCover
     * @summary Upload Cover
     * @request POST:/cover/{mangaOrCoverId}
     * @secure
     */
    export namespace UploadCover {
        export type RequestParams = {
            /**
             * Is Manga UUID on POST
             * @format uuid
             */
            mangaOrCoverId: string;
        };
        export type RequestQuery = {};
        export type RequestBody = {
            /** @format binary */
            file?: File;
            /**
             * @maxLength 8
             * @pattern ^(0|[1-9]\\d*)((\\.\\d+){1,2})?[a-z]?$
             */
            volume?: string | null;
            description?: string;
            /** @pattern ^[a-z]{2}(-[a-z]{2})?$ */
            locale?: string;
        };
        export type RequestHeaders = {
            /** @default "multipart/form-data" */
            'Content-Type': string;
        };
        export type ResponseBody = CoverResponseSchema;
    }
    /**
     * No description
     * @tags Cover
     * @name GetCoverId
     * @summary Get Cover
     * @request GET:/cover/{mangaOrCoverId}
     */
    export namespace GetCoverId {
        export type RequestParams = {
            /**
             * Is Manga UUID on POST
             * @format uuid
             */
            mangaOrCoverId: string;
        };
        export type RequestQuery = {
            /** Reference expansion options for cover art entities or lists */
            includes?: ReferenceExpansionCoverArtSchema;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = CoverResponseSchema;
    }
    /**
     * No description
     * @tags Cover
     * @name EditCover
     * @summary Edit Cover
     * @request PUT:/cover/{mangaOrCoverId}
     * @secure
     */
    export namespace EditCover {
        export type RequestParams = {
            /**
             * Is Manga UUID on POST
             * @format uuid
             */
            mangaOrCoverId: string;
        };
        export type RequestQuery = {};
        export type RequestBody = CoverEditSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = CoverResponseSchema;
    }
    /**
     * No description
     * @tags Cover
     * @name DeleteCover
     * @summary Delete Cover
     * @request DELETE:/cover/{mangaOrCoverId}
     * @secure
     */
    export namespace DeleteCover {
        export type RequestParams = {
            /**
             * Is Manga UUID on POST
             * @format uuid
             */
            mangaOrCoverId: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
}

export namespace Author {
    /**
     * No description
     * @tags Author
     * @name GetAuthor
     * @summary Author list
     * @request GET:/author
     */
    export namespace GetAuthor {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 0
             * @max 100
             * @default 10
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
            /** Author ids (limited to 100 per request) */
            ids?: string[];
            name?: string;
            order?: {
                name?: 'asc' | 'desc';
            };
            /** Reference expansion options for author/artist entities or lists */
            includes?: ReferenceExpansionAuthorSchema;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = AuthorListSchema;
    }
    /**
     * No description
     * @tags Author
     * @name PostAuthor
     * @summary Create Author
     * @request POST:/author
     * @secure
     */
    export namespace PostAuthor {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = AuthorCreateSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = AuthorResponseSchema;
    }
    /**
     * No description
     * @tags Author
     * @name GetAuthorId
     * @summary Get Author
     * @request GET:/author/{id}
     */
    export namespace GetAuthorId {
        export type RequestParams = {
            /**
             * Author ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {
            /** Reference expansion options for author/artist entities or lists */
            includes?: ReferenceExpansionAuthorSchema;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = AuthorResponseSchema;
    }
    /**
     * No description
     * @tags Author
     * @name PutAuthorId
     * @summary Update Author
     * @request PUT:/author/{id}
     * @secure
     */
    export namespace PutAuthorId {
        export type RequestParams = {
            /**
             * Author ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = AuthorEditSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = AuthorResponseSchema;
    }
    /**
     * No description
     * @tags Author
     * @name DeleteAuthorId
     * @summary Delete Author
     * @request DELETE:/author/{id}
     * @secure
     */
    export namespace DeleteAuthorId {
        export type RequestParams = {
            /**
             * Author ID
             * @format uuid
             */
            id: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
}

export namespace Legacy {
    /**
     * No description
     * @tags Legacy
     * @name PostLegacyMapping
     * @summary Legacy ID mapping
     * @request POST:/legacy/mapping
     */
    export namespace PostLegacyMapping {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = MappingIdBodySchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = MappingIdResponseSchema;
    }
}

export namespace AtHome {
    /**
     * No description
     * @tags AtHome
     * @name GetAtHomeServerChapterId
     * @summary Get MangaDex@Home server URL
     * @request GET:/at-home/server/{chapterId}
     */
    export namespace GetAtHomeServerChapterId {
        export type RequestParams = {
            /**
             * Chapter ID
             * @format uuid
             */
            chapterId: string;
        };
        export type RequestQuery = {
            /**
             * Force selecting from MangaDex@Home servers that use the standard HTTPS port 443.
             *
             * While the conventional port for HTTPS traffic is 443 and servers are encouraged to use it, it is not a hard requirement as it technically isn't
             * anything special.
             *
             * However, some misbehaving school/office network will at time block traffic to non-standard ports, and setting this flag to `true` will ensure
             * selection of a server that uses these.
             * @default false
             */
            forcePort443?: boolean;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            /**
             * The base URL to construct final image URLs from.
             * The URL returned is valid for the requested chapter only, and for a duration of 15 minutes from the time of the response.
             */
            baseUrl?: string;
            chapter?: {
                hash?: string;
                data?: string[];
                dataSaver?: string[];
            };
        };
    }
}

export namespace Captcha {
    /**
     * @description Captchas can be solved explicitly through this endpoint, another way is to add a `X-Captcha-Result` header to any request. The same logic will verify the captcha and is probably more convenient because it takes one less request. Authentication is optional. Captchas are tracked for both the client ip and for the user id, if you are logged in you want to send your session token but that is not required.
     * @tags Captcha
     * @name PostCaptchaSolve
     * @summary Solve Captcha
     * @request POST:/captcha/solve
     * @secure
     */
    export namespace PostCaptchaSolve {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = {
            /** @minLength 1 */
            captchaChallenge: string;
        };
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = {
            result?: 'ok' | 'error';
        };
    }
}

export namespace Report {
    /**
     * No description
     * @tags Report
     * @name GetReportReasonsByCategory
     * @summary Get a list of report reasons
     * @request GET:/report/reasons/{category}
     * @secure
     */
    export namespace GetReportReasonsByCategory {
        export type RequestParams = {
            category: 'manga' | 'chapter' | 'scanlation_group' | 'user' | 'author';
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            /** @default "collection" */
            response?: string;
            data?: {
                /** @format uuid */
                id?: string;
                /** @default "report_reason" */
                type?: string;
                attributes?: {
                    reason?: LocalizedStringSchema;
                    detailsRequired?: boolean;
                    category?: 'manga' | 'chapter' | 'scanlation_group' | 'user' | 'author';
                    /** @min 1 */
                    version?: number;
                };
            }[];
            limit?: number;
            offset?: number;
            total?: number;
        };
    }
    /**
     * No description
     * @tags Report
     * @name GetReports
     * @summary Get a list of reports by the user
     * @request GET:/report
     * @secure
     */
    export namespace GetReports {
        export type RequestParams = {};
        export type RequestQuery = {
            /**
             * @min 1
             * @max 100
             * @default 10
             */
            limit?: number;
            /** @min 0 */
            offset?: number;
            category?: 'manga' | 'chapter' | 'scanlation_group' | 'user' | 'author';
            /**
             * @format uuid
             * @minLength 36
             * @maxLength 36
             */
            reasonId?: string;
            /**
             * @format uuid
             * @minLength 36
             * @maxLength 36
             */
            objectId?: string;
            status?: 'waiting' | 'accepted' | 'refused' | 'autoresolved';
            /** @default {"createdAt":"desc"} */
            order?: {
                createdAt?: 'asc' | 'desc';
            };
            /** Reference expansion options for user report entities or lists */
            includes?: ReferenceExpansionReportSchema;
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ReportListResponseSchema;
    }
    /**
     * No description
     * @tags Report
     * @name PostReport
     * @summary Create a new Report
     * @request POST:/report
     * @secure
     */
    export namespace PostReport {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = {
            category?: 'manga' | 'chapter' | 'user' | 'scanlation_group' | 'author';
            /**
             * @format uuid
             * @minLength 36
             * @maxLength 36
             */
            reason?: string;
            /**
             * @format uuid
             * @minLength 36
             * @maxLength 36
             */
            objectId?: string;
            details?: string;
        };
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = ResponseSchema;
    }
}

export namespace Upload {
    /**
     * No description
     * @tags Upload
     * @name GetUploadSession
     * @summary Get the current User upload session
     * @request GET:/upload
     * @secure
     */
    export namespace GetUploadSession {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = UploadSessionSchema;
    }
    /**
     * No description
     * @tags Upload
     * @name BeginUploadSession
     * @summary Start an upload session
     * @request POST:/upload/begin
     * @secure
     */
    export namespace BeginUploadSession {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = BeginUploadSessionSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = UploadSessionSchema;
    }
    /**
     * No description
     * @tags Upload
     * @name BeginEditSession
     * @summary Start an edit chapter session
     * @request POST:/upload/begin/{chapterId}
     * @secure
     */
    export namespace BeginEditSession {
        export type RequestParams = {
            /** @format uuid */
            chapterId: string;
        };
        export type RequestQuery = {};
        export type RequestBody = BeginEditSessionSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = UploadSessionSchema;
    }
    /**
     * No description
     * @tags Upload
     * @name PutUploadSessionFile
     * @summary Upload images to the upload session
     * @request POST:/upload/{uploadSessionId}
     * @secure
     */
    export namespace PutUploadSessionFile {
        export type RequestParams = {
            /** @format uuid */
            uploadSessionId: string;
        };
        export type RequestQuery = {};
        export type RequestBody = {
            /** @format binary */
            file?: File;
        };
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = {
            result?: 'ok' | 'error';
            errors?: ErrorSchema[];
            data?: UploadSessionFileSchema[];
        };
    }
    /**
     * No description
     * @tags Upload
     * @name AbandonUploadSession
     * @summary Abandon upload session
     * @request DELETE:/upload/{uploadSessionId}
     * @secure
     */
    export namespace AbandonUploadSession {
        export type RequestParams = {
            /** @format uuid */
            uploadSessionId: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags Upload
     * @name CommitUploadSession
     * @summary Commit the upload session and specify chapter data
     * @request POST:/upload/{uploadSessionId}/commit
     * @secure
     */
    export namespace CommitUploadSession {
        export type RequestParams = {
            /** @format uuid */
            uploadSessionId: string;
        };
        export type RequestQuery = {};
        export type RequestBody = CommitUploadSessionSchema;
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = ChapterSchema;
    }
    /**
     * No description
     * @tags Upload
     * @name DeleteUploadedSessionFile
     * @summary Delete an uploaded image from the Upload Session
     * @request DELETE:/upload/{uploadSessionId}/{uploadSessionFileId}
     * @secure
     */
    export namespace DeleteUploadedSessionFile {
        export type RequestParams = {
            /** @format uuid */
            uploadSessionId: string;
            /** @format uuid */
            uploadSessionFileId: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags Upload
     * @name DeleteUploadedSessionFiles
     * @summary Delete a set of uploaded images from the Upload Session
     * @request DELETE:/upload/{uploadSessionId}/batch
     * @secure
     */
    export namespace DeleteUploadedSessionFiles {
        export type RequestParams = {
            /** @format uuid */
            uploadSessionId: string;
        };
        export type RequestQuery = {};
        export type RequestBody = string[];
        export type RequestHeaders = {
            /** @default "application/json" */
            'Content-Type': string;
        };
        export type ResponseBody = ResponseSchema;
    }
}

export namespace Rating {
    /**
     * No description
     * @tags Rating
     * @name GetRating
     * @summary Get your ratings
     * @request GET:/rating
     * @secure
     */
    export namespace GetRating {
        export type RequestParams = {};
        export type RequestQuery = {
            manga: string[];
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            ratings?: Record<
                string,
                {
                    rating?: number;
                    /** @format date-time */
                    createdAt?: Date;
                }
            >;
        };
    }
    /**
     * No description
     * @tags Rating
     * @name PostRatingMangaId
     * @summary Create or update Manga rating
     * @request POST:/rating/{mangaId}
     * @secure
     */
    export namespace PostRatingMangaId {
        export type RequestParams = {
            /** @format uuid */
            mangaId: string;
        };
        export type RequestQuery = {};
        export type RequestBody = {
            /**
             * @min 1
             * @max 10
             */
            rating?: number;
        };
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
    /**
     * No description
     * @tags Rating
     * @name DeleteRatingMangaId
     * @summary Delete Manga rating
     * @request DELETE:/rating/{mangaId}
     * @secure
     */
    export namespace DeleteRatingMangaId {
        export type RequestParams = {
            /** @format uuid */
            mangaId: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = ResponseSchema;
    }
}

export namespace Statistics {
    /**
     * No description
     * @tags Statistics
     * @name GetStatisticsChapterUuid
     * @summary Get statistics about given chapter
     * @request GET:/statistics/chapter/{uuid}
     * @secure
     */
    export namespace GetStatisticsChapterUuid {
        export type RequestParams = {
            /** @format uuid */
            uuid: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            statistics?: Record<
                string,
                {
                    /**
                     * Comments-related statistics of an entity.
                     * If it is `null`, the entity doesn't have a backing comments thread, and therefore has no comments yet.
                     */
                    comments?: StatisticsDetailsCommentsSchema;
                }
            >;
        };
    }
    /**
     * No description
     * @tags Statistics
     * @name GetStatisticsChapters
     * @summary Get statistics about given chapters
     * @request GET:/statistics/chapter
     * @secure
     */
    export namespace GetStatisticsChapters {
        export type RequestParams = {};
        export type RequestQuery = {
            chapter: string[];
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            statistics?: Record<
                string,
                {
                    /**
                     * Comments-related statistics of an entity.
                     * If it is `null`, the entity doesn't have a backing comments thread, and therefore has no comments yet.
                     */
                    comments?: StatisticsDetailsCommentsSchema;
                }
            >;
        };
    }
    /**
     * No description
     * @tags Statistics
     * @name GetStatisticsGroupUuid
     * @summary Get statistics about given scanlation group
     * @request GET:/statistics/group/{uuid}
     * @secure
     */
    export namespace GetStatisticsGroupUuid {
        export type RequestParams = {
            /** @format uuid */
            uuid: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            statistics?: Record<
                string,
                {
                    /**
                     * Comments-related statistics of an entity.
                     * If it is `null`, the entity doesn't have a backing comments thread, and therefore has no comments yet.
                     */
                    comments?: StatisticsDetailsCommentsSchema;
                }
            >;
        };
    }
    /**
     * No description
     * @tags Statistics
     * @name GetStatisticsGroups
     * @summary Get statistics about given groups
     * @request GET:/statistics/group
     * @secure
     */
    export namespace GetStatisticsGroups {
        export type RequestParams = {};
        export type RequestQuery = {
            group: string[];
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            statistics?: Record<
                string,
                {
                    /**
                     * Comments-related statistics of an entity.
                     * If it is `null`, the entity doesn't have a backing comments thread, and therefore has no comments yet.
                     */
                    comments?: StatisticsDetailsCommentsSchema;
                }
            >;
        };
    }
    /**
     * No description
     * @tags Statistics
     * @name GetStatisticsMangaUuid
     * @summary Get statistics about given Manga
     * @request GET:/statistics/manga/{uuid}
     * @secure
     */
    export namespace GetStatisticsMangaUuid {
        export type RequestParams = {
            /** @format uuid */
            uuid: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            statistics?: Record<
                string,
                {
                    /**
                     * Comments-related statistics of an entity.
                     * If it is `null`, the entity doesn't have a backing comments thread, and therefore has no comments yet.
                     */
                    comments?: StatisticsDetailsCommentsSchema;
                    rating?: {
                        /** Will be nullable if no ratings has been given */
                        average?: number | null;
                        /** Average weighted on all the Manga population */
                        bayesian?: number;
                        distribution?: {
                            '1'?: number;
                            '2'?: number;
                            '3'?: number;
                            '4'?: number;
                            '5'?: number;
                            '6'?: number;
                            '7'?: number;
                            '8'?: number;
                            '9'?: number;
                            '10'?: number;
                        };
                    };
                    follows?: number;
                }
            >;
        };
    }
    /**
     * No description
     * @tags Statistics
     * @name GetStatisticsManga
     * @summary Find statistics about given Manga
     * @request GET:/statistics/manga
     * @secure
     */
    export namespace GetStatisticsManga {
        export type RequestParams = {};
        export type RequestQuery = {
            manga: string[];
        };
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            statistics?: Record<
                string,
                {
                    /**
                     * Comments-related statistics of an entity.
                     * If it is `null`, the entity doesn't have a backing comments thread, and therefore has no comments yet.
                     */
                    comments?: StatisticsDetailsCommentsSchema;
                    rating?: {
                        /** Will be nullable if no ratings has been done */
                        average?: number | null;
                        /** Average weighted on all the Manga population */
                        bayesian?: number;
                    };
                    follows?: number;
                }
            >;
        };
    }
}

export namespace Settings {
    /**
     * No description
     * @tags Settings
     * @name GetSettingsTemplate
     * @summary Get latest Settings template
     * @request GET:/settings/template
     * @secure
     */
    export namespace GetSettingsTemplate {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = object;
    }
    /**
     * No description
     * @tags Settings
     * @name PostSettingsTemplate
     * @summary Create Settings template
     * @request POST:/settings/template
     * @secure
     */
    export namespace PostSettingsTemplate {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = object;
        export type RequestHeaders = {};
        export type ResponseBody = object;
    }
    /**
     * No description
     * @tags Settings
     * @name GetSettingsTemplateVersion
     * @summary Get Settings template by version id
     * @request GET:/settings/template/{version}
     * @secure
     */
    export namespace GetSettingsTemplateVersion {
        export type RequestParams = {
            /** @format uuid */
            version: string;
        };
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = object;
    }
    /**
     * No description
     * @tags Settings
     * @name GetSettings
     * @summary Get an User Settings
     * @request GET:/settings
     * @secure
     */
    export namespace GetSettings {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = never;
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            /** @format date-time */
            updatedAt?: Date;
            /** Settings that were validated by linked template */
            settings?: object;
            /**
             * Settings template UUID
             * @format uuid
             */
            template?: string;
        };
    }
    /**
     * No description
     * @tags Settings
     * @name PostSettings
     * @summary Create or update an User Settings
     * @request POST:/settings
     * @secure
     */
    export namespace PostSettings {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = {
            /** A JSON object that can be validated against the lastest available template */
            settings?: object;
            /**
             * Format: 2022-03-14T13:19:37
             * @format date-time
             */
            updatedAt?: Date;
        };
        export type RequestHeaders = {};
        export type ResponseBody = {
            /** @default "ok" */
            result?: string;
            /** @format date-time */
            updatedAt?: Date;
            /** Settings that were validated against the linked template */
            settings?: object;
            /**
             * Settings template UUID
             * @format uuid
             */
            template?: string;
        };
    }
}

export namespace Forums {
    /**
     * @description Creates a thread in the forums for the given resource, which backs the comments functionality. A thread is only created if it doesn't exist yet; otherwise the preexisting thread is returned.
     * @tags Forums
     * @name ForumsThreadCreate
     * @summary Create forums thread
     * @request POST:/forums/thread
     * @secure
     */
    export namespace ForumsThreadCreate {
        export type RequestParams = {};
        export type RequestQuery = {};
        export type RequestBody = {
            /** The type of the resource */
            type?: 'manga' | 'group' | 'chapter';
            /**
             * The id of the resource
             * @format uuid
             */
            id?: string;
        };
        export type RequestHeaders = {};
        export type ResponseBody = ForumsThreadResponseSchema;
    }
}
