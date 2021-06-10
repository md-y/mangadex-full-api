declare module 'mangadex-full-api' {
	/**
	 * Converts old (pre v5, numeric ids) Mangadex ids to v5 ids.
	 * Any invalid legacy ids will be skipped by Mangadex when remapping, so
	 * call this function for each individual id if this is an issue.
	 * @param {'group'|'manga'|'chapter'|'tag'} type Type of id
	 * @param {...Number|Number[]} ids Array of ids to convert
	 * @returns {Promise<String[]>}
	 */
	export function convertLegacyId(type: 'group' | 'manga' | 'chapter' | 'tag', ...ids: (number | number[])[]): Promise<string[]>;
	/**
	 * Sets the global locaization for LocalizedStrings.
	 * Uses 2-letter Mangadex region codes.
	 * @param {String} newLocale
	 */
	export function setGlobalLocale(newLocale: string): void;
	/**
	 * Required for authorization
	 * https://api.mangadex.org/docs.html#operation/post-auth-login
	 * @param {String} username
	 * @param {String} password
	 * @param {String} [cacheLocation] File location to store the persistent token (Warning: saved in plaintext)
	 * @returns {Promise<void>}
	 */
	export function login(username: string, password: string, cacheLocation?: string): Promise<void>;
	
	/**
	 * Represents an author or artist
	 * https://api.mangadex.org/docs.html#tag/Author
	 */
	export class Author {
	    /**
	     * @private
	     * @typedef {Object} AuthorParameterObject
	     * @property {String} AuthorParameterObject.name
	     * @property {String[]} AuthorParameterObject.ids Max of 100 per request
	     * @property {Number} AuthorParameterObject.limit Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	     * @property {Number} AuthorParameterObject.offset
	     * @property {Object} AuthorParameterObject.order
	     * @property {'asc'|'desc'} AuthorParameterObject.order.name
	     */
	    /**
	     * Peforms a search and returns an array of a authors/artists.
	     * https://api.mangadex.org/docs.html#operation/get-author
	     * @param {AuthorParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the name
	     * @returns {Promise<Author[]>}
	     */
	    static search(searchParameters?: string | {
	        name: string;
	        /**
	         * Max of 100 per request
	         */
	        ids: string[];
	        /**
	         * Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	         */
	        limit: number;
	        offset: number;
	        order: {
	            name: 'asc' | 'desc';
	        };
	    }): Promise<Author[]>;
	    /**
	     * Gets multiple authors
	     * @param {...String|Relationship} ids
	     * @returns {Promise<Author[]>}
	     */
	    static getMultiple(...ids: (string | Relationship)[]): Promise<Author[]>;
	    /**
	     * Retrieves and returns a author by its id
	     * @param {String} id Mangadex id
	     * @returns {Promise<Author>}
	     */
	    static get(id: string): Promise<Author>;
	    /**
	     * Performs a search for one author and returns that author
	     * @param {AuthorParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the name
	     * @returns {Promise<Author>}
	     */
	    static getByQuery(searchParameters?: string | {
	        name: string;
	        /**
	         * Max of 100 per request
	         */
	        ids: string[];
	        /**
	         * Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	         */
	        limit: number;
	        offset: number;
	        order: {
	            name: 'asc' | 'desc';
	        };
	    }): Promise<Author>;
	    /**
	     * There is no reason to directly create an author object. Use static methods, ie 'get()'.
	     * @param {Object|String} context Either an API response or Mangadex id
	     */
	    constructor(context: any | string);
	    id: string;
	    /**
	     * Name of this author/artist
	     * @type {String}
	     */
	    name: string;
	    /**
	     * Image URL for this author/artist
	     * @type {String}
	     */
	    imageUrl: string;
	    /**
	     * Author/Artist biography
	     * @type {String[]}
	     */
	    biography: string[];
	    /**
	     * The date of this author/artist page creation
	     * @type {Date}
	     */
	    createdAt: Date;
	    /**
	     * The date the author/artist was last updated
	     * @type {Date}
	     */
	    updatedAt: Date;
	    /**
	     * Relationships to manga this author/artist has been attributed to
	     * @type {Relationship[]}
	     */
	    manga: Relationship[];
	}
	
	/**
	 * Represents a chapter with readable pages
	 * https://api.mangadex.org/docs.html#tag/Chapter
	 */
	export class Chapter {
	    /**
	     * @private
	     * @typedef {Object} ChapterParameterObject
	     * @property {String} ChapterParameterObject.title
	     * @property {String} ChapterParameterObject.createdAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	     * @property {String} ChapterParameterObject.updatedAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	     * @property {String} ChapterParameterObject.publishAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	     * @property {Object} ChapterParameterObject.order
	     * @property {'asc'|'desc'} ChapterParameterObject.order.createdAt
	     * @property {'asc'|'desc'} ChapterParameterObject.order.updatedAt
	     * @property {'asc'|'desc'} ChapterParameterObject.order.publishAt
	     * @property {'asc'|'desc'} ChapterParameterObject.order.volume
	     * @property {'asc'|'desc'} ChapterParameterObject.order.chapter
	     * @property {String[]} ChapterParameterObject.translatedLanguage
	     * @property {String[]} ChapterParameterObject.ids Max of 100 per request
	     * @property {Number} ChapterParameterObject.limit Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	     * @property {Number} ChapterParameterObject.offset
	     * @property {String[]|Group[]} ChapterParameterObject.groups
	     * @property {String|User|Relationship} ChapterParameterObject.uploader
	     * @property {String|Manga|Relationship} ChapterParameterObject.manga
	     * @property {String} ChapterParameterObject.volume
	     * @property {String} ChapterParameterObject.chapter
	     */
	    /**
	     * Peforms a search and returns an array of chapters.
	     * https://api.mangadex.org/docs.html#operation/get-chapter
	     * @param {ChapterParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the title
	     * @returns {Promise<Chapter[]>}
	     */
	    static search(searchParameters?: string | {
	        title: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        createdAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        updatedAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        publishAtSince: string;
	        order: {
	            createdAt: 'asc' | 'desc';
	            updatedAt: 'asc' | 'desc';
	            publishAt: 'asc' | 'desc';
	            volume: 'asc' | 'desc';
	            chapter: 'asc' | 'desc';
	        };
	        translatedLanguage: string[];
	        /**
	         * Max of 100 per request
	         */
	        ids: string[];
	        /**
	         * Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	         */
	        limit: number;
	        offset: number;
	        groups: string[] | any[];
	        uploader: string | any | Relationship;
	        manga: string | any | Relationship;
	        volume: string;
	        chapter: string;
	    }): Promise<Chapter[]>;
	    /**
	     * Gets multiple chapters
	     * @param {...String|Relationship} ids
	     * @returns {Promise<Chapter[]>}
	     */
	    static getMultiple(...ids: (string | Relationship)[]): Promise<Chapter[]>;
	    /**
	     * Retrieves and returns a chapter by its id
	     * @param {String} id Mangadex id
	     * @returns {Promise<Chapter>}
	     */
	    static get(id: string): Promise<Chapter>;
	    /**
	     * Performs a search for one chapter and returns that chapter
	     * @param {ChapterParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the title
	     * @returns {Promise<Chapter>}
	     */
	    static getByQuery(searchParameters?: string | {
	        title: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        createdAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        updatedAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        publishAtSince: string;
	        order: {
	            createdAt: 'asc' | 'desc';
	            updatedAt: 'asc' | 'desc';
	            publishAt: 'asc' | 'desc';
	            volume: 'asc' | 'desc';
	            chapter: 'asc' | 'desc';
	        };
	        translatedLanguage: string[];
	        /**
	         * Max of 100 per request
	         */
	        ids: string[];
	        /**
	         * Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	         */
	        limit: number;
	        offset: number;
	        groups: string[] | any[];
	        uploader: string | any | Relationship;
	        manga: string | any | Relationship;
	        volume: string;
	        chapter: string;
	    }): Promise<Chapter>;
	    /**
	     * Marks a chapter as either read or unread
	     * @param {String} id
	     * @param {Boolean} [read=true] True to mark as read, false to mark unread
	     * @returns {Promise<void>}
	     */
	    static changeReadMarker(id: string, read?: boolean): Promise<void>;
	    /**
	     * There is no reason to directly create a chapter object. Use static methods, ie 'get()'.
	     * @param {Object|String} context Either an API response or Mangadex id
	     */
	    constructor(context: any | string);
	    id: string;
	    /**
	     * Number this chapter's volume
	     * @type {Number}
	     */
	    volume: number;
	    /**
	     * Number of this chapter
	     * @type {Number}
	     */
	    chapter: number;
	    /**
	     * Title of this chapter
	     * @type {String}
	     */
	    title: string;
	    /**
	     * Translated language code (2 Letters)
	     * @type {String}
	     */
	    translatedLanguage: string;
	    /**
	     * Hash id of this chapter
	     * @type {String}
	     */
	    hash: string;
	    /**
	     * The date of this chapter's creation
	     * @type {Date}
	     */
	    createdAt: Date;
	    /**
	     * The date this chapter was last updated
	     * @type {Date}
	     */
	    updatedAt: Date;
	    /**
	     * The date this chapter was published
	     * @type {Date}
	     */
	    publishAt: Date;
	    /**
	     * Dont Use. This is an array of partial URLs. Use 'getReadablePages()' to retrieve full urls.
	     * @type {String[]}
	     */
	    pageNames: string[];
	    /**
	     * Dont Use. This is an array of partial URLs. Use 'getReadablePages()' to retrieve full urls.
	     * @type {String[]}
	     */
	    saverPageNames: string[];
	    /**
	     * Relationships to scanlation groups that are attributed to this chapter
	     * @type {Relationship[]}
	     */
	    groups: Relationship[];
	    /**
	     * Relationships to the manga this chapter belongs to
	     * @type {Relationship}
	     */
	    manga: Relationship;
	    /**
	     * Relationships to the user who uploaded this chapter
	     * @type {Relationship}
	     */
	    uploader: Relationship;
	    /**
	     * Retrieves URLs for actual images from Mangadex @ Home.
	     * This only gives URLs, so it does not report the status of the server to Mangadex @ Home.
	     * Therefore applications that download image data pleaese report failures as stated here:
	     * https://api.mangadex.org/docs.html#section/Reading-a-chapter-using-the-API/Report
	     * @param {Boolean} [saver=false] Use data saver images?
	     * @returns {Promise<String[]>}
	     */
	    getReadablePages(saver?: boolean): Promise<string[]>;
	    /**
	     * Marks this chapter as either read or unread
	     * @param {Boolean} [read=true] True to mark as read, false to mark unread
	     * @returns {Promise<Chapter>}
	     */
	    changeReadMarker(read?: boolean): Promise<Chapter>;
	}
	
	/**
	 * Represents the cover art of a manga volume
	 * https://api.mangadex.org/docs.html#tag/Cover
	 */
	export class Cover {
	    /**
	     * Retrieves and returns a cover by its id
	     * @param {String} id Mangadex id
	     * @returns {Promise<Cover>}
	     */
	    static get(id: string): Promise<Cover>;
	    /**
	     * @private
	     * @typedef {Object} CoverParameterObject
	     * @property {Number} CoverParameterObject.limit Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	     * @property {Number} CoverParameterObject.offset
	     * @property {String[]|Manga[]} CoverParameterObject.manga Manga ids (limited to 100 per request)
	     * @property {String[]|Cover[]} CoverParameterObject.ids Covers ids (limited to 100 per request)
	     * @property {String[]|User[]} CoverParameterObject.uploaders User ids (limited to 100 per request)
	     * @property {Object} CoverParameterObject.order
	     * @property {'asc'|'desc'} CoverParameterObject.order.createdAt
	     * @property {'asc'|'desc'} CoverParameterObject.order.updatedAt
	     * @property {'asc'|'desc'} CoverParameterObject.order.volume
	     */
	    /**
	     * Peforms a search and returns an array of covers.
	     * https://api.mangadex.org/docs.html#operation/get-cover
	     * @param {CoverParameterObject} [searchParameters]
	     * @returns {Promise<Cover[]>}
	     */
	    static search(searchParameters?: {
	        /**
	         * Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	         */
	        limit: number;
	        offset: number;
	        /**
	         * Manga ids (limited to 100 per request)
	         */
	        manga: string[] | any[];
	        /**
	         * Covers ids (limited to 100 per request)
	         */
	        ids: string[] | Cover[];
	        /**
	         * User ids (limited to 100 per request)
	         */
	        uploaders: string[] | any[];
	        order: {
	            createdAt: 'asc' | 'desc';
	            updatedAt: 'asc' | 'desc';
	            volume: 'asc' | 'desc';
	        };
	    }): Promise<Cover[]>;
	    /**
	     * Gets multiple covers
	     * @param {...String|Relationship} ids
	     * @returns {Promise<Cover[]>}
	     */
	    static getMultiple(...ids: (string | Relationship)[]): Promise<Cover[]>;
	    /**
	     * Performs a search for one manga and returns that manga
	     * @param {CoverParameterObject} [searchParameters]
	     * @returns {Promise<Cover>}
	     */
	    static getByQuery(searchParameters?: {
	        /**
	         * Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	         */
	        limit: number;
	        offset: number;
	        /**
	         * Manga ids (limited to 100 per request)
	         */
	        manga: string[] | any[];
	        /**
	         * Covers ids (limited to 100 per request)
	         */
	        ids: string[] | Cover[];
	        /**
	         * User ids (limited to 100 per request)
	         */
	        uploaders: string[] | any[];
	        order: {
	            createdAt: 'asc' | 'desc';
	            updatedAt: 'asc' | 'desc';
	            volume: 'asc' | 'desc';
	        };
	    }): Promise<Cover>;
	    /**
	     * Get an array of manga's covers
	     * @param {...String|Manga|Relationship} manga
	     * @returns {Promise<Cover[]>}
	     */
	    static getMangaCovers(...manga: (string | any | Relationship)[]): Promise<Cover[]>;
	    /**
	     * There is no reason to directly create a cover art object. Use static methods, ie 'get()'.
	     * @param {Object|String} context Either an API response or Mangadex id
	     */
	    constructor(context: any | string);
	    id: string;
	    /**
	     * Manga volume this is a cover for
	     * @type {Number}
	     */
	    volume: number;
	    /**
	     * Description of this cover
	     * @type {String}
	     */
	    description: string;
	    /**
	     * The date of the cover's creation
	     * @type {Date}
	     */
	    createdAt: Date;
	    /**
	     * The date the cover was last updated
	     * @type {Date}
	     */
	    updatedAt: Date;
	    /**
	     * Manga this is a cover for
	     * @type {Relationship}
	     */
	    manga: Relationship;
	    /**
	     * The user who uploaded this cover
	     * @type {Relationship}
	     */
	    uploader: Relationship;
	    /**
	     * URL to the source image of the cover
	     * @type {String}
	     */
	    imageSource: string;
	    /**
	     * URL to the 512px image of the cover
	     * @type {String}
	     */
	    image512: string;
	    /**
	     * URL to the 256px image of the cover
	     * @type {String}
	     */
	    image256: string;
	}
	
	/**
	 * Represents a scanlation group
	 * https://api.mangadex.org/docs.html#tag/Group
	 */
	export class Group {
	    /**
	     * @private
	     * @typedef {Object} GroupParameterObject
	     * @property {String} GroupParameterObject.name
	     * @property {String[]} GroupParameterObject.ids Max of 100 per request
	     * @property {Number} GroupParameterObject.limit Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	     * @property {Number} GroupParameterObject.offset
	     */
	    /**
	     * Peforms a search and returns an array of groups.
	     * https://api.mangadex.org/docs.html#operation/get-search-group
	     * @param {GroupParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the name
	     * @returns {Promise<Group[]>}
	     */
	    static search(searchParameters?: string | {
	        name: string;
	        /**
	         * Max of 100 per request
	         */
	        ids: string[];
	        /**
	         * Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	         */
	        limit: number;
	        offset: number;
	    }): Promise<Group[]>;
	    /**
	     * Gets multiple groups
	     * @param {...String|Relationship} ids
	     * @returns {Promise<Group[]>}
	     */
	    static getMultiple(...ids: (string | Relationship)[]): Promise<Group[]>;
	    /**
	     * Retrieves and returns a group by its id
	     * @param {String} id Mangadex id
	     * @returns {Promise<Group>}
	     */
	    static get(id: string): Promise<Group>;
	    /**
	     * Performs a search for one group and returns that group
	     * @param {GroupParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the name
	     * @returns {Promise<Group>}
	     */
	    static getByQuery(searchParameters?: string | {
	        name: string;
	        /**
	         * Max of 100 per request
	         */
	        ids: string[];
	        /**
	         * Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	         */
	        limit: number;
	        offset: number;
	    }): Promise<Group>;
	    /**
	     * Returns all groups followed by the logged in user
	     * @param {Number} [limit=100] Amount of groups to return (0 to Infinity)
	     * @param {Number} [offset=0] How many groups to skip before returning
	     * @returns {Promise<Group[]>}
	     */
	    static getFollowedGroups(limit?: number, offset?: number): Promise<Group[]>;
	    /**
	     * Makes the logged in user either follow or unfollow a group
	     * @param {String} id
	     * @param {Boolean} [follow=true] True to follow, false to unfollow
	     * @returns {Promise<void>}
	     */
	    static changeFollowship(id: string, follow?: boolean): Promise<void>;
	    /**
	     * There is no reason to directly create a group object. Use static methods, ie 'get()'.
	     * @param {Object|String} context Either an API response or Mangadex id
	     */
	    constructor(context: any | string);
	    id: string;
	    /**
	     * Name of this group
	     * @type {String}
	     */
	    name: string;
	    /**
	     * The date of this group's creation
	     * @type {Date}
	     */
	    createdAt: Date;
	    /**
	     * The date the group was last updated
	     * @type {Date}
	     */
	    updatedAt: Date;
	    /**
	     * Relationships to chapters attributed to this group
	     * @type {Relationship[]}
	     */
	    chapters: Relationship[];
	    /**
	     * Username of the group's leader. Resolve the leader relationship to retrieve other data
	     * @type {User}
	     */
	    leaderName: any;
	    /**
	     * Relationship to this group's leader
	     * @type {Relationship}
	     */
	    leader: Relationship;
	    /**
	     * Username of the group's member. Resolve the members' relationships to retrieve other data
	     * @type {User[]}
	     */
	    memberNames: any[];
	    /**
	     * Relationships to each group's members
	     * @type {Relationship[]}
	     */
	    members: Relationship[];
	    /**
	     * Makes the logged in user either follow or unfollow this group
	     * @param {Boolean} [follow=true] True to follow, false to unfollow
	     * @returns {Promise<Group>}
	     */
	    changeFollowship(follow?: boolean): Promise<Group>;
	}
	
	/**
	 * Represents a custom, user-created list of manga
	 * https://api.mangadex.org/docs.html#tag/CustomList
	 */
	export class List {
	    /**
	     * Retrieves and returns a list by its id
	     * @param {String} id Mangadex id
	     * @returns {Promise<List>}
	     */
	    static get(id: string): Promise<List>;
	    /**
	     * Create a new custom list. Must be logged in
	     * @param {String} name
	     * @param {Manga[]|String[]} manga
	     * @param {'public'|'private'} [visibility='private']
	     * @returns {Promise<List>}
	     */
	    static create(name: string, manga: Manga[] | string[], visibility?: 'public' | 'private'): Promise<List>;
	    /**
	     * Deletes a custom list. Must be logged in
	     * @param {String} id
	     * @returns {Promise<void>}
	     */
	    static delete(id: string): Promise<void>;
	    /**
	     * Adds a manga to a custom list. Must be logged in
	     * @param {String} listId
	     * @param {Manga|String} manga
	     * @returns {Promise<void>}
	     */
	    static addManga(listId: string, manga: Manga | string): Promise<void>;
	    /**
	     * Removes a manga from a custom list. Must be logged in
	     * @param {String} listId
	     * @param {Manga|String} manga
	     * @returns {Promise<void>}
	     */
	    static removeManga(listId: string, manga: Manga | string): Promise<void>;
	    /**
	     * Returns all lists created by the logged in user.
	     * As of the MD v5 Beta, this returns an empty list.
	     * @param {Number} [limit=100] Amount of lists to return (0 to Infinity)
	     * @param {Number} [offset=0] How many lists to skip before returning
	     * @returns {Promise<List[]>}
	     */
	    static getLoggedInUserLists(limit?: number, offset?: number): Promise<List[]>;
	    /**
	     * Returns all public lists created by a user.
	     * As of the MD v5 Beta, this returns an empty list.
	     * @param {String|User|Relationship} user
	     * @param {Number} [limit=100] Amount of lists to return (0 to Infinity)
	     * @param {Number} [offset=0] How many lists to skip before returning
	     * @returns {Promise<List[]>}
	     */
	    static getUserLists(user: string | User | Relationship, limit?: number, offset?: number): Promise<List[]>;
	    /**
	     * @private
	     * @typedef {Object} FeedParameterObject
	     * @property {Number} FeedParameterObject.limit Not limited by API limits (more than 500). Use Infinity for maximum results (use at your own risk)
	     * @property {Number} FeedParameterObject.offset
	     * @property {String[]} FeedParameterObject.translatedLanguage
	     * @property {String} FeedParameterObject.createdAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	     * @property {String} FeedParameterObject.updatedAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	     * @property {String} FeedParameterObject.publishAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	     * @property {Object} FeedParameterObject.order
	     * @property {'asc'|'desc'} FeedParameterObject.order.volume
	     * @property {'asc'|'desc'} FeedParameterObject.order.chapter
	     * @property {'asc'|'desc'} FeedParameterObject.order.createdAt
	     * @property {'asc'|'desc'} FeedParameterObject.order.updatedAt
	     */
	    /**
	     * Returns a list of the most recent chapters from the manga in a list
	     * @param {String} id Mangadex id of the list
	     * @param {FeedParameterObject} parameterObject Information on which chapters to be returned
	     * @returns {Promise<Chapter[]>}
	     */
	    static getFeed(id: string, parameterObject: {
	        /**
	         * Not limited by API limits (more than 500). Use Infinity for maximum results (use at your own risk)
	         */
	        limit: number;
	        offset: number;
	        translatedLanguage: string[];
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        createdAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        updatedAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        publishAtSince: string;
	        order: {
	            volume: 'asc' | 'desc';
	            chapter: 'asc' | 'desc';
	            createdAt: 'asc' | 'desc';
	            updatedAt: 'asc' | 'desc';
	        };
	    }): Promise<Chapter[]>;
	    /**
	     * There is no reason to directly create a custom list object. Use static methods, ie 'get()'.
	     * @param {Object|String} context Either an API response or Mangadex id
	     */
	    constructor(context: any | string);
	    id: string;
	    /**
	     * Name of this custom list
	     * @type {String}
	     */
	    name: string;
	    /**
	     * Version of this custom list
	     * @type {String}
	     */
	    version: string;
	    /**
	     * String form of this list's visibility
	     * @type {'public'|'private'}
	     */
	    visibility: 'public' | 'private';
	    /**
	     * Relationships to all of the manga in this custom list
	     * @type {Relationship[]}
	     */
	    manga: Relationship[];
	    /**
	     * Relationship to this list's owner
	     * @type {Relationship}
	     */
	    owner: Relationship;
	    /**
	     * Name of this list's owner. Resolve this owner relationship object for other user info
	     * @type {String}
	     */
	    ownerName: string;
	    /**
	     * Is this list public?
	     * @type {Boolean}
	     */
	    get public(): boolean;
	    /**
	     * Returns a list of the most recent chapters from the manga in a list
	     * https://api.mangadex.org/docs.html#operation/get-list-id-feed
	     * @param {FeedParameterObject} [parameterObject] Information on which chapters to be returned
	     * @returns {Promise<Chapter[]>}
	     */
	    getFeed(parameterObject?: {
	        /**
	         * Not limited by API limits (more than 500). Use Infinity for maximum results (use at your own risk)
	         */
	        limit: number;
	        offset: number;
	        translatedLanguage: string[];
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        createdAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        updatedAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        publishAtSince: string;
	        order: {
	            volume: 'asc' | 'desc';
	            chapter: 'asc' | 'desc';
	            createdAt: 'asc' | 'desc';
	            updatedAt: 'asc' | 'desc';
	        };
	    }): Promise<Chapter[]>;
	    /**
	     * Delete a custom list. Must be logged in
	     * @returns {Promise<void>}
	     */
	    delete(): Promise<void>;
	    /**
	     * Renames a custom list. Must be logged in
	     * @param {String} newName
	     * @returns {Promise<List>}
	     */
	    rename(newName: string): Promise<List>;
	    /**
	     * Changes the visibility a custom list. Must be logged in
	     * @param {'public'|'private'} [newVis] Leave blank to toggle
	     * @returns {Promise<List>}
	     */
	    changeVisibility(newVis?: 'public' | 'private'): Promise<List>;
	    /**
	     * Changes the manga in a custom list. Must be logged in
	     * @param {Manga[]|String[]} newList
	     * @returns {Promise<List>}
	     */
	    updateMangaList(newList: Manga[] | string[]): Promise<List>;
	    /**
	     * Adds a manga to this list
	     * @param {Manga|String} manga
	     * @returns {Promise<List>}
	     */
	    addManga(manga: Manga | string): Promise<List>;
	    /**
	     * Removes a manga from this list
	     * @param {Manga|String} manga
	     * @returns {Promise<List>}
	     */
	    removeManga(manga: Manga | string): Promise<List>;
	}
	
	/**
	 * Represents a manga object
	 * https://api.mangadex.org/docs.html#tag/Manga
	 */
	export class Manga {
	    /**
	     * @private
	     * @typedef {Object} MangaParameterObject
	     * @property {String} MangaParameterObject.title
	     * @property {Number} MangaParameterObject.year
	     * @property {'AND'|'OR'} MangaParameterObject.includedTagsMode
	     * @property {'AND'|'OR'} MangaParameterObject.excludedTagsMode
	     * @property {String} MangaParameterObject.createdAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	     * @property {String} MangaParameterObject.updatedAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	     * @property {Object} MangaParameterObject.order
	     * @property {'asc'|'desc'} MangaParameterObject.order.createdAt
	     * @property {'asc'|'desc'} MangaParameterObject.order.updatedAt
	     * @property {String[]|Author[]} MangaParameterObject.authors Array of author ids
	     * @property {String[]|Author[]} MangaParameterObject.artists Array of artist ids
	     * @property {String[]|Tag[]} MangaParameterObject.includedTags
	     * @property {String[]|Tag[]} MangaParameterObject.excludedTags
	     * @property {Array<'ongoing'|'completed'|'hiatus'|'cancelled'>} MangaParameterObject.status
	     * @property {String[]} MangaParameterObject.originalLanguage
	     * @property {Array<'shounen'|'shoujo'|'josei'|'seinen'|'none'>} MangaParameterObject.publicationDemographic
	     * @property {String[]} MangaParameterObject.ids Max of 100 per request
	     * @property {Array<'safe'|'suggestive'|'erotica'|'pornographic'>} MangaParameterObject.contentRating
	     * @property {Number} MangaParameterObject.limit Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	     * @property {Number} MangaParameterObject.offset
	     */
	    /**
	     * Peforms a search and returns an array of manga.
	     * https://api.mangadex.org/docs.html#operation/get-search-manga
	     * @param {MangaParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the title
	     * @returns {Promise<Manga[]>}
	     */
	    static search(searchParameters?: string | {
	        title?: string;
	        year?: number;
	        includedTagsMode?: 'AND' | 'OR';
	        excludedTagsMode?: 'AND' | 'OR';
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        createdAtSince?: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        updatedAtSince?: string;
	        order?: {
	            createdAt?: 'asc' | 'desc';
	            updatedAt?: 'asc' | 'desc';
	        };
	        /**
	         * Array of author ids
	         */
	        authors?: string[] | any[];
	        /**
	         * Array of artist ids
	         */
	        artists?: string[] | any[];
	        includedTags?: string[] | Tag[];
	        excludedTags?: string[] | Tag[];
	        status?: Array<'ongoing' | 'completed' | 'hiatus' | 'cancelled'>;
	        originalLanguage?: string[];
	        publicationDemographic?: Array<'shounen' | 'shoujo' | 'josei' | 'seinen' | 'none'>;
	        /**
	         * Max of 100 per request
	         */
	        ids?: string[];
	        contentRating?: Array<'safe' | 'suggestive' | 'erotica' | 'pornographic'>;
	        /**
	         * Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	         */
	        limit?: number;
	        offset?: number;
	    }): Promise<Manga[]>;
	    /**
	     * Gets multiple manga
	     * @param {...String|Relationship} ids
	     * @returns {Promise<Manga[]>}
	     */
	    static getMultiple(...ids: (string | Relationship)[]): Promise<Manga[]>;
	    /**
	     * Retrieves and returns a manga by its id
	     * @param {String} id Mangadex id
	     * @returns {Promise<Manga>}
	     */
	    static get(id: string): Promise<Manga>;
	    /**
	     * Performs a search for one manga and returns that manga
	     * @param {MangaParameterObject|String} [searchParameters] An object of offical search parameters, or a string representing the title
	     * @returns {Promise<Manga>}
	     */
	    static getByQuery(searchParameters?: string | {
	        title: string;
	        year: number;
	        includedTagsMode: 'AND' | 'OR';
	        excludedTagsMode: 'AND' | 'OR';
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        createdAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        updatedAtSince: string;
	        order: {
	            createdAt: 'asc' | 'desc';
	            updatedAt: 'asc' | 'desc';
	        };
	        /**
	         * Array of author ids
	         */
	        authors: string[] | any[];
	        /**
	         * Array of artist ids
	         */
	        artists: string[] | any[];
	        includedTags: string[] | Tag[];
	        excludedTags: string[] | Tag[];
	        status: Array<'ongoing' | 'completed' | 'hiatus' | 'cancelled'>;
	        originalLanguage: string[];
	        publicationDemographic: Array<'shounen' | 'shoujo' | 'josei' | 'seinen' | 'none'>;
	        /**
	         * Max of 100 per request
	         */
	        ids: string[];
	        contentRating: Array<'safe' | 'suggestive' | 'erotica' | 'pornographic'>;
	        /**
	         * Not limited by API limits (more than 100). Use Infinity for maximum results (use at your own risk)
	         */
	        limit: number;
	        offset: number;
	    }): Promise<Manga>;
	    /**
	     * @private
	     * @typedef {Object} FeedParameterObject
	     * @property {Number} FeedParameterObject.limit Not limited by API limits (more than 500). Use Infinity for maximum results (use at your own risk)
	     * @property {Number} FeedParameterObject.offset
	     * @property {String[]} FeedParameterObject.translatedLanguage
	     * @property {String} FeedParameterObject.createdAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	     * @property {String} FeedParameterObject.updatedAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	     * @property {String} FeedParameterObject.publishAtSince DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	     * @property {Object} FeedParameterObject.order
	     * @property {'asc'|'desc'} FeedParameterObject.order.volume
	     * @property {'asc'|'desc'} FeedParameterObject.order.chapter
	     * @property {'asc'|'desc'} FeedParameterObject.order.createdAt
	     * @property {'asc'|'desc'} FeedParameterObject.order.updatedAt
	     */
	    /**
	     * Returns a feed of chapters for a manga
	     * @param {String} id
	     * @param {FeedParameterObject|Number} [parameterObject] Either a parameter object or a number representing the limit
	     * @returns {Promise<Chapter[]>}
	     */
	    static getFeed(id: string, parameterObject?: number | {
	        /**
	         * Not limited by API limits (more than 500). Use Infinity for maximum results (use at your own risk)
	         */
	        limit: number;
	        offset: number;
	        translatedLanguage: string[];
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        createdAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        updatedAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        publishAtSince: string;
	        order: {
	            volume: 'asc' | 'desc';
	            chapter: 'asc' | 'desc';
	            createdAt: 'asc' | 'desc';
	            updatedAt: 'asc' | 'desc';
	        };
	    }): Promise<Chapter[]>;
	    /**
	     * Returns one random manga
	     * @returns {Promise<Manga>}
	     */
	    static getRandom(): Promise<Manga>;
	    /**
	     * Returns all manga followed by the logged in user
	     * @param {Number} [limit=100] Amount of manga to return (0 to Infinity)
	     * @param {Number} [offset=0] How many manga to skip before returning
	     * @returns {Promise<Manga[]>}
	     */
	    static getFollowedManga(limit?: number, offset?: number): Promise<Manga[]>;
	    /**
	     * Retrieves a tag object based on its id or name ('Oneshot', 'Thriller,' etc).
	     * The result of every available tag is cached, so subsequent tag requests will have no delay
	     * https://api.mangadex.org/docs.html#operation/get-manga-tag
	     * @param {String} indentity
	     * @returns {Promise<Tag>}
	     */
	    static getTag(indentity: string): Promise<Tag>;
	    /**
	     * Returns an array of every tag available on Mangadex right now.
	     * The result is cached, so subsequent tag requests will have no delay
	     * https://api.mangadex.org/docs.html#operation/get-manga-tag
	     * @returns {Promise<Tag[]>}
	     */
	    static getAllTags(): Promise<Tag[]>;
	    /**
	     * Retrieves the logged in user's reading status for a manga.
	     * If there is no status, null is returned
	     * @param {String} id
	     * @returns {Promise<'reading'|'on_hold'|'plan_to_read'|'dropped'|'re_reading'|'completed'>}
	     */
	    static getReadingStatus(id: string): Promise<'reading' | 'on_hold' | 'plan_to_read' | 'dropped' | 're_reading' | 'completed'>;
	    /**
	     * Sets the logged in user's reading status for this manga.
	     * Call without arguments to clear the reading status
	     * @param {String} id
	     * @param {'reading'|'on_hold'|'plan_to_read'|'dropped'|'re_reading'|'completed'} [status]
	     * @returns {Promise<void>}
	     */
	    static setReadingStatus(id: string, status?: 'reading' | 'on_hold' | 'plan_to_read' | 'dropped' | 're_reading' | 'completed'): Promise<void>;
	    /**
	     * Gets the combined feed of every manga followed by the logged in user
	     * @param {FeedParameterObject|Number} [parameterObject] Either a parameter object or a number representing the limit
	     * @returns {Promise<Chapter[]>}
	     */
	    static getFollowedFeed(parameterObject?: number | {
	        /**
	         * Not limited by API limits (more than 500). Use Infinity for maximum results (use at your own risk)
	         */
	        limit: number;
	        offset: number;
	        translatedLanguage: string[];
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        createdAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        updatedAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        publishAtSince: string;
	        order: {
	            volume: 'asc' | 'desc';
	            chapter: 'asc' | 'desc';
	            createdAt: 'asc' | 'desc';
	            updatedAt: 'asc' | 'desc';
	        };
	    }): Promise<Chapter[]>;
	    /**
	     * Makes the logged in user either follow or unfollow a manga
	     * @param {String} id
	     * @param {Boolean} [follow=true] True to follow, false to unfollow
	     * @returns {Promise<void>}
	     */
	    static changeFollowship(id: string, follow?: boolean): Promise<void>;
	    /**
	     * Retrieves the read chapters for multiple manga
	     * @param  {...String|Manga|Relationship} ids
	     * @returns {Promise<Chapter[]>}
	     */
	    static getReadChapters(...ids: (string | Manga | Relationship)[]): Promise<Chapter[]>;
	    /**
	     * Returns all covers for a manga
	     * @param {...String|Manga|Relationship} id Manga id(s)
	     * @returns {Promise<Cover[]>}
	     */
	    static getCovers(...id: (string | Manga | Relationship)[]): Promise<Cover[]>;
	    /**
	     * Returns a summary of every chapter for a manga including each of their numbers and volumes they belong to
	     * https://api.mangadex.org/docs.html#operation/post-manga
	     * @param {String} id
	     * @param {...String} languages
	     * @returns {Promise<Object>}
	     */
	    static getAggregate(id: string, ...languages: string[]): Promise<any>;
	    /**
	     * There is no reason to directly create a manga object. Use static methods, ie 'get()'.
	     * @param {Object|String} context Either an API response or Mangadex id
	     */
	    constructor(context: any | string);
	    id: string;
	    /**
	     * Main title with different localization options
	     * @type {LocalizedString}
	     */
	    localizedTitle: LocalizedString;
	    /**
	     * Alt titles with different localization options
	     * @type {LocalizedString[]}
	     */
	    localizedAltTitles: LocalizedString[];
	    /**
	     * Description with different localization options
	     * @type {LocalizedString}
	     */
	    localizedDescription: LocalizedString;
	    /**
	     * Is this Manga locked?
	     * @type {Boolean}
	     */
	    isLocked: boolean;
	    /**
	     * Link object representing links to other websites about this manga
	     * https://api.mangadex.org/docs.html#section/Static-data/Manga-links-data
	     * @type {Links}
	     */
	    links: Links;
	    /**
	     * 2-letter code for the original language of this manga
	     * @type {String}
	     */
	    originalLanguage: string;
	    /**
	     * Number this manga's last volume based on the default feed order
	     * @type {Number}
	     */
	    lastVolume: number;
	    /**
	     * Number of this manga's last chapter based on the default feed order
	     * @type {Number}
	     */
	    lastChapter: number;
	    /**
	     * Publication demographic of this manga
	     * https://api.mangadex.org/docs.html#section/Static-data/Manga-publication-demographic
	     * @type {'shounen'|'shoujo'|'josei'|'seinen'}
	     */
	    publicationDemographic: 'shounen' | 'shoujo' | 'josei' | 'seinen';
	    /**
	     * Publication/Scanlation status of this manga
	     * @type {'ongoing'|'completed'|'hiatus'|'cancelled'}
	     */
	    status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
	    /**
	     * Year of this manga's publication
	     * @type {Number}
	     */
	    year: number;
	    /**
	     * The content rating of this manga
	     * @type {'safe'|'suggestive'|'erotica'|'pornographic'}
	     */
	    contentRating: 'safe' | 'suggestive' | 'erotica' | 'pornographic';
	    /**
	     * The date of this manga's page creation
	     * @type {Date}
	     */
	    createdAt: Date;
	    /**
	     * The date the manga was last updated
	     * @type {Date}
	     */
	    updatedAt: Date;
	    /**
	     * Relationships to authors attributed to this manga
	     * @type {Relationship[]}
	     */
	    authors: Relationship[];
	    /**
	     * Relationships to artists attributed to this manga
	     * @type {Relationship[]}
	     */
	    artists: Relationship[];
	    /**
	     * Relationships to this manga's main cover. Use 'getCovers' to retrive other covers
	     * @type {Relationship}
	     */
	    mainCover: Relationship;
	    /**
	     * Array of tags for this manga
	     * @type {Tag[]}
	     */
	    tags: Tag[];
	    /**
	     * Main title string based on global locale
	     * @type {String}
	     */
	    get title(): string;
	    /**
	     * Alt titles array based on global locale
	     * @type {String[]}
	     */
	    get altTitles(): string[];
	    /**
	     * Description string based on global locale
	     * @type {String}
	     */
	    get description(): string;
	    /**
	     * Returns all covers for this manga
	     * @returns {Promise<Cover[]>}
	     */
	    getCovers(): Promise<Cover[]>;
	    /**
	     * Returns a feed of this manga's chapters
	     * @param {FeedParameterObject|Number} [parameterObject] Either a parameter object or a number representing the limit
	     * @returns {Promise<Chapter[]>}
	     */
	    getFeed(parameterObject?: number | {
	        /**
	         * Not limited by API limits (more than 500). Use Infinity for maximum results (use at your own risk)
	         */
	        limit: number;
	        offset: number;
	        translatedLanguage: string[];
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        createdAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        updatedAtSince: string;
	        /**
	         * DateTime string with following format: YYYY-MM-DDTHH:MM:SS
	         */
	        publishAtSince: string;
	        order: {
	            volume: 'asc' | 'desc';
	            chapter: 'asc' | 'desc';
	            createdAt: 'asc' | 'desc';
	            updatedAt: 'asc' | 'desc';
	        };
	    }): Promise<Chapter[]>;
	    /**
	     * Adds this manga to a list
	     * @param {List|String} list
	     * @returns {Promise<void>}
	     */
	    addToList(list: List | string): Promise<void>;
	    /**
	     * Retrieves the logged in user's reading status for this manga.
	     * If there is no status, null is returned
	     * @returns {Promise<'reading'|'on_hold'|'plan_to_read'|'dropped'|'re_reading'|'completed'>}
	     */
	    getReadingStatus(): Promise<'reading' | 'on_hold' | 'plan_to_read' | 'dropped' | 're_reading' | 'completed'>;
	    /**
	     * Sets the logged in user's reading status for this manga.
	     * Call without arguments to clear the reading status
	     * @param {'reading'|'on_hold'|'plan_to_read'|'dropped'|'re_reading'|'completed'} [status]
	     * @returns {Promise<Manga>}
	     */
	    setReadingStatus(status?: 'reading' | 'on_hold' | 'plan_to_read' | 'dropped' | 're_reading' | 'completed'): Promise<Manga>;
	    /**
	     * Makes the logged in user either follow or unfollow this manga
	     * @param {Boolean} [follow=true] True to follow, false to unfollow
	     * @returns {Promise<Manga>}
	     */
	    changeFollowship(follow?: boolean): Promise<Manga>;
	    /**
	     * Returns an array of every chapter that has been marked as read for this manga
	     * @returns {Promise<Chapter[]>}
	     */
	    getReadChapters(): Promise<Chapter[]>;
	    /**
	     * Returns a summary of every chapter for this manga including each of their numbers and volumes they belong to
	     * https://api.mangadex.org/docs.html#operation/post-manga
	     * @param {...String} languages
	     */
	    getAggregate(...languages: string[]): Promise<any>;
	}
	
	/**
	 * Represents an user
	 * https://api.mangadex.org/docs.html#tag/User
	 */
	export class User {
	    /**
	     * Retrieves and returns a user by its id
	     * @param {String} id Mangadex id
	     * @returns {Promise<User>}
	     */
	    static get(id: string): Promise<User>;
	    /**
	     * Returns all users followed by the logged in user
	     * @param {Number} [limit=100] Amount of users to return (0 to Infinity)
	     * @param {Number} [offset=0] How many users to skip before returning
	     * @returns {Promise<User[]>}
	     */
	    static getFollowedUsers(limit?: number, offset?: number): Promise<User[]>;
	    /**
	     * Returns the logged in user as a user object
	     * @returns {Promise<User>}
	     */
	    static getLoggedInUser(): Promise<User>;
	    /**
	     * Makes the logged in user either follow or unfollow a user
	     * @param {String} id
	     * @param {Boolean} [follow=true] True to follow, false to unfollow
	     * @returns {Promise<void>}
	     */
	    static changeFollowship(id: string, follow?: boolean): Promise<void>;
	    /**
	     * There is no reason to directly create a user object. Use static methods, ie 'get()'.
	     * @param {Object|String} context Either an API response or Mangadex id
	     */
	    constructor(context: any | string);
	    id: string;
	    /**
	     * Username of this user
	     * @type {String}
	     */
	    username: string;
	    /**
	     * Relationships to chapters attributed to this user
	     * @type {Relationship[]}
	     */
	    chapters: Relationship[];
	    /**
	     * Makes the logged in user either follow or unfollow this user
	     * @param {Boolean} [follow=true] True to follow, false to unfollow
	     * @returns {Promise<User>}
	     */
	    changeFollowship(follow?: boolean): Promise<User>;
	}
	
}
/**
 * Represents the links that represent manga on different websites
 * https://api.mangadex.org/docs.html#section/Static-data/Manga-links-data
 */
declare class Links {
    constructor(linksObject: any);
    availableLinks: string[];
    /**
     * Anilist (https://anilist.co) link to manga
     * @type {String} URL
     */
    al: string;
    /**
     * AnimePlanet (https://anime-planet.com) link to manga
     * @type {String} URL
     */
    ap: string;
    /**
     * Bookwalker (https://bookwalker.jp/) link to manga
     * @type {String} URL
     */
    bw: string;
    /**
     * Mangaupdates (https://mangaupdates.com) link to manga
     * @type {String} URL
     */
    mu: string;
    /**
     * Novelupdates (https://novelupdates.com) link to manga
     * @type {String} URL
     */
    nu: string;
    /**
     * MyAnimeList (https://myanimelist.net) link to manga
     * @type {String} URL
     */
    mal: string;
    /**
     * Kitsu (https://kitsu.io) link to manga
     * @type {String} URL
     */
    kt: string;
    kit: string;
    /**
     * Amazon (https://amazon.com) link to manga
     * @type {String} URL
     */
    amz: string;
    /**
     * EBookJapan (https://ebookjapan.yahoo.co.jp) link to manga
     * @type {String} URL
     */
    ebj: string;
    /**
     * Link to manga raws
     * @type {String} URL
     */
    raw: string;
    /**
     * Link to offical english manga translation
     * @type {String} URL
     */
    engtl: string;
    /**
     * CDJapan (https://www.cdjapan.co.jp/) link to manga
     * @type {String} URL
     */
    cdj: string;
}

/**
 * Represents a string, but in different languages.
 * Generates properties for each language available
 * (ie you can index with language codes through localizedString['en'] or localizedString.jp)
 */
declare class LocalizedString {
    /**
     * Global locale setting
     * @private
     * @type {String}
     */
    private static locale;
    constructor(stringObject: any);
    availableLocales: string[];
    /**
     * String from global locale setting (setGlobalLocale)
     * @returns {String}
     */
    get localString(): string;
}

/**
 * Represents a relationship from one Mangadex object to another such as a manga, author, etc via its id.
 */
declare class Relationship {
    static types: {};
    /**
     * Returns an array of Relationship objects from a Mangadex Relationships Array
     * @private
     * @param {String} type
     * @param {Object[]} dataArray
     * @returns {Relationship[]}
     */
    private static convertType;
    /**
     * Provides a constructor for a relationship type at run-time.
     * Should only be called in index.js
     * @private
     * @param {String} name
     * @param {Object} classObject
     */
    private static registerType;
    constructor(data: any);
    /**
     * Id of the object this is a relationship to
     * @type {String}
     */
    id: string;
    /**
     * The type of the object this is a relationship to
     * @type {String}
     */
    type: string;
    /**
     * This function must be called to return the proper and complete object representation of this relationship.
     * Essentially, it calls and returns Manga.get(), Author.get(), Cover.get(), etc.
     * @returns {Promise<Manga|Author|Chapter|User|Group|List|Cover>}
     */
    resolve(): Promise<any | any | any | any | any | any | any>;
}

/**
 * This error respresents when the API responds with an error or invalid response.
 * In other words, this error represents 400 and 500 status code responses.
 */
declare class APIRequestError extends Error {
    /** @type {Number} */
    static OTHER: number;
    /** @type {Number} */
    static AUTHORIZATION: number;
    /** @type {Number} */
    static INVALID_REQUEST: number;
    /** @type {Number} */
    static INVALID_RESPONSE: number;
    /**
     * @param {String|Object} reason An error message or response from the API
     * @param {Number} code
     * @param  {...any} params
     */
    constructor(reason?: string | any, code?: number, ...params: any[]);
    /**
     * What type of error is this?
     * AUTHORIZATION, INVALID_RESPONSE, etc.
     * @type {Number}
     */
    code: number;
}

/**
 * Represents a manga tag
 */
declare class Tag {
    /**
     * A cached response from https://api.mangadex.org/manga/tag
     * @type {Tag[]}
     */
    static cache: Tag[];
    /**
     * @private
     * @returns {Promise<Tag[]>}
     */
    private static getAllTags;
    /**
     * @private
     * @param {String} indentity
     * @returns {Promise<Tag>}
     */
    private static getTag;
    constructor(data: any);
    /**
     * Mangadex id of this tag
     * @type {String}
     */
    id: string;
    /**
     * Name with different localization options
     * @type {LocalizedString}
     */
    localizedName: LocalizedString;
    /**
     * Description with different localization options
     * @type {LocalizedString}
     */
    localizedDescription: LocalizedString;
    /**
     * What type of tag group this tag belongs to
     * @type {String}
     */
    group: string;
    /**
     * Name string based on global locale
     * @type {String}
     */
    get name(): string;
    /**
     * Description string based on global locale
     * @type {String}
     */
    get description(): string;
}
