import { isNullable } from '../type';
import { forEachKey } from './for-each-key';

/**
 * Filters null values from an object.
 * @param val An object
 * @returns `val` with all null values removed
 *
 * @publicApi
 */
export const filterNullValues = <T extends object>(val: T) => {
    forEachKey(val, (v, key) => {
        if (isNullable(v)) {
            delete val[key];
        }
    });

    return val;
};
