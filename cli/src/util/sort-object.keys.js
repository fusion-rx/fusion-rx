// @ts-check

/**
 * Sorts an object's keys alphabetically. This does not mutate `obj`.
 * @template T
 * @param {T} obj An object
 * @returns `obj` with its keys sorted alphabetically
 */
export const sortObjectKeys = (obj) => {
    // @ts-ignore
    const sortedKeys = Object.keys(obj).sort();

    const toReturn = /** @type {typeof obj} */ {};

    sortedKeys.forEach((key) => {
        // @ts-ignore
        toReturn[key] = obj[key];
    });

    return toReturn;
};
