import { tryCatch } from '../operators/try.js';

/**
 * Locates a nested object by key in `o`.
 * @param o An object
 * @param key A key in the object
 * @returns The nested value assigned to `key` or null if the nested
 * value cannot be found.
 *
 * @publicApi
 */
export function findNestedValueByKey<T = object | any[], R = any>(
    o: T,
    key: string
): R | null {
    let result: R | null = null;

    if (Array.isArray(o)) {
        for (var i = 0; i < o.length; i++) {
            result = tryCatch(() => findNestedValueByKey(o[i], key)) ?? null;
            if (result) return result;
        }
    } else {
        for (var _k in o) {
            const k = _k as keyof typeof o;
            if (k == key) return o[k] as R;
            if (typeof o[k] === 'object' || Array.isArray(o[k])) {
                result =
                    tryCatch(() => findNestedValueByKey(o[k], key)) ?? null;
                if (result) return result;
            }
        }
    }

    return result;
}
