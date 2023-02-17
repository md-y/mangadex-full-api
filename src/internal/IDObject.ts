/**
 * This class represents the most abstract version of a MangaDex object, containing
 * only the ID of the object. This is mostly used for instanceOf checks.
 * @internal
 */
export default abstract class IDObject {
    abstract id: string;
}
