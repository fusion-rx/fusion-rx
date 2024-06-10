import { isFalsy } from '../type/type-check.js';
import { forEachKey } from './for-each-key.js';

/**
 * Filters null values from an object.
 * @param val An object
 * @returns `val` with all falsy values removed
 *
 * @publicApi
 */
export const filterFalsy = <T extends object>(val: T) => {
    forEachKey(val, (v, key) => {
        if (isFalsy(v)) {
            delete val[key];
        }
    });

    return val;
};
