/**
 * Creates a deep copy of `item`.
 * @param item An object
 * @returns A copy of `item`
 *
 * @publicApi
 */
export const deepCopy = <T = any>(item: T): T =>
    JSON.parse(JSON.stringify(item));
