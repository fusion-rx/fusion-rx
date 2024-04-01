// @ts-check

import { isNativeError } from 'util/types';

/**
 * Stringifies an object with `JSON.stringify`. If encounters an error,
 * logs `error` and exits.
 * @param {object} toStringify An object to stringify
 * @param {string} error An error message to log if stringify fails
 * @returns `toStringify` stringified
 */
export const stringify = (toStringify, error) => {
    try {
        return JSON.stringify(toStringify, null, 4);
    } catch (e) {
        throw {
            message: error,
            stack: isNativeError(e) ? e.stack : new Error().stack
        };
    }
};
