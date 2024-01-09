import { TagAttributesSchema, TagResponseSchema, TagSchema } from '../types/schema';
import { fetchMD } from '../util/Network';
import IDObject from '../internal/IDObject';
import LocalizedString from '../internal/LocalizedString';

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
     * Localized names for this tag
     */
    name: LocalizedString;
    /**
     * Localized descriptions for this tag
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
        if (!Tag.allTagCache || Tag.allTagCache.length === 0) {
            const res = await fetchMD<TagResponseSchema>('/manga/tag');
            Tag.allTagCache = res.data.map((elem) => new Tag(elem));
        }
        return Tag.allTagCache;
    }

    /**
     * Return the first tag that contains the specified name
     */
    static async getByName(name: string): Promise<Tag> {
        const tags = await this.getAllTags();
        const lowerName = name.toLowerCase();
        const foundTag = tags.find((tag) => Object.values(tag.name).some((n) => n.toLowerCase() === lowerName));
        if (!foundTag) throw new Error(`No tag found with name ${name}`);
        return foundTag;
    }

    /**
     * Return tags with the associated names
     */
    static async getByNames(names: string[]): Promise<Tag[]> {
        const tags = await this.getAllTags();
        const lowerNames = names.map((n) => n.toLowerCase());
        return tags.filter((tag) => Object.values(tag.name).some((n) => lowerNames.includes(n.toLowerCase())));
    }
}
