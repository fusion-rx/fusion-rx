import { isFalsy } from '../public-api.js';

/**
 * Compares two values for equivalency.
 * @param a A value that will be compared against `b`
 * @param b A value that will be compared against `a`
 * @returns True if `a` and `b` are equivalent; otherwise, false.
 *
 * @publicApi
 */
export const equivalent = <T>(a: T, b: unknown): boolean => {
    if (isFalsy(a)) return false;
    if (isFalsy(b)) return false;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object' && typeof b === 'object') {
        try {
            return JSON.stringify(a) === JSON.stringify(b);
        } catch {
            return a === b;
        }
    }

    return a === b;
};
