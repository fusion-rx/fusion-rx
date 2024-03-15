/**
 * A utility for creating objects with type safety without having to
 * set a variable to determine its type.
 * @param arg The object to return.
 * @returns The object.
 */
export const As = <T = any>(arg: T): T => arg;
