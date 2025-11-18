import { RelationshipSchema } from '../types/schema';
import IDObject from '../internal/IDObject';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type GettableClass<T> = Function & { get: (id: string) => Promise<T>; getMultiple?: (ids: string[]) => Promise<T[]> };

type MFARelationshipSchema = Pick<RelationshipSchema, 'id' | 'type'> &
    Partial<Pick<RelationshipSchema, 'related' | 'attributes'>> & { relationships?: Relationship[] };

/**
 * Represents a relationship from one MangaDex object to another such as a manga, author, etc via its id.
 */
class Relationship<T extends IDObject = IDObject> extends IDObject {
    /**
     * The MangaDex UUID of the object this relationship refers to
     */
    id: string;
    /**
     * What type of object is this a relationship to
     */
    type: string;
    /**
     * If the relationship is between two manga, how are they related?
     */
    related?: RelationshipSchema['related'];
    /**
     * Cached relationships are created by using the 'includes' parameter on search requests or
     * other functions that support it. For every type included in the parameter, relationships of
     * that type will be replaced by the actual object. The object will still be represented
     * by a Relationship object, but the {@link resolve} method will return instantly with the cached data.
     * Each resulting object will have no further relationships of its own.
     */
    cached = false;

    private cachedData?: object;

    private static typeMap: Record<string, GettableClass<unknown>> = {};
    private static typeMapLocked = false;

    constructor(data: MFARelationshipSchema) {
        super();
        this.id = data.id;
        if (!(data.type in Relationship.typeMap)) throw `Unregistered relationship type: ${data.type}`;
        this.type = data.type;
        this.related = data.related;

        // Attempt to create cached object for reference expanded relationships
        if (data.attributes) {
            try {
                const classObj = Relationship.typeMap[this.type];
                // Attempt to simulate a common schema object:
                const schemaObj = {
                    attributes: data.attributes,
                    id: this.id,
                    type: this.type,
                    relationships: data.relationships ?? [],
                };
                this.cachedData = Reflect.construct(classObj, [schemaObj]);
                this.cached = true;
            } catch (err) {
                // console.log('Failed to create cache object');
                // console.error(err);
            }
        }
    }

    /**
     * Returns the cached related object, or undefined if nothing is cached.
     * Unlike resolve(), this does not fetch data or perform any I/O.
     */
    peek() {
        return this.cachedData as T | undefined;
    }

    /**
     * This will automatically fetch the associated object that this relationship refers to.
     * In other words, it wil call Manga.get(id), Chapter.get(id), etc with the information
     * stored in this relationship instance. If this relationship is cached, then the resulting
     * object will be missing relationships.
     */
    async resolve(): Promise<T> {
        if (this.cached) return this.cachedData as T;
        return Relationship.typeMap[this.type].get(this.id) as Promise<T>;
    }

    /**
     * This will {@link Relationship.resolve} an array of relationships, returning another array
     * in the same order.
     * @param relationshipArray - An array of relationships of the same type
     */
    static async resolveAll<T extends IDObject>(relationshipArray: Relationship<T>[]): Promise<T[]> {
        if (relationshipArray.length === 0) return [];
        const classObj = Relationship.typeMap[relationshipArray[0].type] as GettableClass<T>;
        if (classObj !== undefined && classObj.getMultiple !== undefined) {
            return classObj.getMultiple(relationshipArray.map((i) => i.id));
        } else {
            return await Promise.all(relationshipArray.map((elem) => elem.resolve()));
        }
    }

    /**
     * This will search through a relationship response from MangaDex and convert any
     * relationships of a specific type into relationship objects.
     * @internal
     */
    static convertType<T2 extends IDObject>(
        type: string,
        arr: RelationshipSchema[],
        parent?: Relationship<IDObject>,
    ): Relationship<T2>[] {
        return arr
            .filter((elem) => elem.type === type)
            .map((elem) => {
                if (parent) return new Relationship<T2>({ ...elem, relationships: [parent] });
                return new Relationship<T2>(elem);
            });
    }

    /**
     * Create a reference to an object's self
     * @internal
     */
    static createSelfRelationship<T extends IDObject>(type: string, self: T) {
        if (!self.id) throw new Error('ID is missing. Did you call this too early in the constructor?');
        return new Relationship<T>({
            id: self.id,
            type,
        });
    }

    /**
     * This function is used to resolved circular references, and should only be used in base.ts.
     * Specifically, it pairs a relationship type to its associated class.
     * @internal
     */
    static registerTypes(types: string[], classObj: GettableClass<unknown>) {
        if (Relationship.typeMapLocked) {
            throw Error(`Cannot add types ${types} because the Relationship type map has been locked.`);
        }
        types.forEach((type) => (Relationship.typeMap[type] = classObj));
    }

    /**
     * Lock the type map so that no more types can be registered.
     * @internal
     */
    static lockTypeMap() {
        Relationship.typeMapLocked = true;
    }

    /**
     * Returns an array of all registered Relationship types
     * @internal
     */
    static getRegisteredTypes() {
        return Object.keys(Relationship.typeMap);
    }
}

export default Relationship;
