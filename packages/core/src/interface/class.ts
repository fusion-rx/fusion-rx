/**
 * Represents a type that an Injectable or other object
 * is instances of.
 *
 * An example of a `Class` is `MyService`, which in JavaScript
 * is represented by the `MyService` constructor function.
 *
 * @publicApi
 */
export const Class = Function;

/**
 * Represents a {@link Class}, providing typescript with
 * type safety for the class' prototype and constructor.
 *
 * @publicApi
 */
export interface Class<T = any> extends Function {
    prototype: T & { [classMember: string]: any };
    new (...args: any[]): any;
}

export function isClass(val: any): val is Class<any> {
    return val !== null && val !== undefined && typeof val === 'function';
}
