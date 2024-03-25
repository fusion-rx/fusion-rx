/**
 * Compares two variables for equivalency.
 * @param a A variable that will be compared against `b`
 * @param b A variable that will be compared against `a`
 * @returns True if `a` and `b` are equivalent; otherwise, false.
 *
 * @publicApi
 */
export const equivalent = <T>(a: T, b: unknown): boolean => {
    if (a === undefined || a === null) return false;
    if (b === undefined || b === null) return false;
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
