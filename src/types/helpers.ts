export type WithID<T> = T & { id: string };

export type CommonKeys<T1, T2> = keyof T1 & keyof T2;

export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

type IntersectingProps<T1, T2> = { [x in CommonKeys<T1, T2>]: T1[x] | T2[x] };
/**
 * Merges two types, creating a union at every shared property.
 */
export type Merge<T1, T2> = Omit<T1, CommonKeys<T1, T2>> & IntersectingProps<T1, T2> & Omit<T2, CommonKeys<T1, T2>>;

/**
 * Will return an error type if the two types are not equal. Will return the first type if they are equal.
 * Will update return type if {@link https://github.com/microsoft/TypeScript/issues/23689 | this issue}
 * ever gets resolved.
 */
export type Equal<A, B> = (A extends B ? B : Error) extends A ? A : Error;

export type DeepRequire<T> = Required<{
    [P in keyof T]: T[P] extends object | undefined ? DeepRequire<Required<T[P]>> : T[P];
}>;

export interface IAuthClient {
    getSessionToken: () => Promise<string>;
}
