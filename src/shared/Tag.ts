import { TagAttributesSchema, TagResponseSchema, TagSchema } from '../types/schema.js';
import { fetchMD } from '../util/Network.js';
import IDObject from '../internal/IDObject.js';
import LocalizedString from '../internal/LocalizedString.js';

/**
 * This class represents a genre tag for a manga
 */
export default class Tag extends IDObject implements TagAttributesSchema {
    private static allTagCache: Tag[];

    /**
     * MangaDex UUID of this tag
     */
    id: string;
    /**
     * Localized name of this tag
     */
    name: LocalizedString;
    /**
     * Localized description of this tag
     */
    description: LocalizedString;
    /**
     * The tag group this tag belongs to
     */
    group: 'content' | 'format' | 'genre' | 'theme';
    /**
     * The version of this tag (incremented whenever the tag's data is updated)
     */
    version: number;

    constructor(data: TagSchema) {
        super();
        this.id = data.id;
        this.name = new LocalizedString(data.attributes.name);
        this.description = new LocalizedString(data.attributes.description);
        this.group = data.attributes.group;
        this.version = data.attributes.version;
    }

    /**
     * Get the localString from the name {@link LocalizedString} object
     */
    get localName() {
        return this.name.localString;
    }

    /**
     * Get the localString from the description {@link LocalizedString} object
     */
    get localDescription() {
        return this.description.localString;
    }

    /**
     * Retrieves every tag used on MangaDex. The result is cached so any promise
     * after the first will resolve instantly.
          */
    static async getAllTags(): Promise<Tag[]> {
        if (Tag.allTagCache.length === 0) {
            const res = await fetchMD<TagResponseSchema>('/manga/tag');
            Tag.allTagCache = res.data.map((elem) => new Tag(elem));
        }
        return Tag.allTagCache;
    }
}
