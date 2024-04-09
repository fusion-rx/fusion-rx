/**
 * Represents a type that an Injectable or other object
 * is instances of.
 *
 * An example of a `Class` is `MyService`, which in JavaScript
 * is represented by the `MyService` constructor function.
 *
 * @publicApi
 */
// export const Class = Function;

/**
 * Represents a {@link Type}, providing typescript with
 * type safety for the class' prototype and constructor.
 *
 * @publicApi
 */
export interface Type<T extends object = {}, U extends object = {}>
    extends Function {
    prototype: T & {
        constructor: {
            name: string;
        } & U;
        [classMember: string]: any;
    };
    new (...args: any[]): any;
}

export function isType<T extends object = {}, U extends object = {}>(
    val: any
): val is Type<T, U> {
    return val !== null && val !== undefined && typeof val === 'function';
}

/**
 * Dervies the name of `val` from its constructor.
 * @param val A class reference
 * @returns The name of `val`
 * @throws Will throw an error if `val`'s class name is undefined
 */
export const getTokenFromType = <T extends object = {}>(val: Type<T>) => {
    const name = val.prototype?.constructor?.name;
    if (name === undefined)
        throw Error('Failed to dervice class name from reference.');
    return name;
};
