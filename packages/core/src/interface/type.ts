/**
 * Represents a type that an Injectable or other object
 * is instances of.
 *
 * An example of a `Class` is `MyService`, which in JavaScript
 * is represented by the `MyService` constructor function.
 *
 * @publicApi
 */
export const Type = Function;

/**
 * Represents a {@link Type}, providing typescript with
 * type safety for the class' prototype and constructor.
 *
 * @publicApi
 */
export interface Type<T extends object = {}> extends Function {
    prototype: T & {
        constructor: {
            name: string;
        };
        [classMember: string]: any;
    };
    new (...args: any[]): any;
}

export function isType<T extends object = {}>(val: any): val is Type<T> {
    return val !== null && val !== undefined && typeof val === 'function';
}
