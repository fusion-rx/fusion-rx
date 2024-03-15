import { isNonNullable } from './non-nullable';

/**
 * - If `val` is a boolean, returns it.
 * - If `val` is a string, returns `val === 'true'`
 * - If `val` is a number, returns `val > 0`
 * - If `val` is Nullable, returns `defaultVal`.
 * @param val A value whose type is `boolean` or `unknown`.
 * @param defaultVal (optional) A default value to return if `val` is Nullable
 * or cannot be parsed. Defaults to `false`.
 */
export function toBoolean(val: any, defaultVal = false): boolean {
    if (isNonNullable(val)) {
        switch (typeof val) {
            case 'boolean':
                return val;
            case 'string':
                return val === 'true';
            case 'number':
                return val > 0;
        }
    }

    return defaultVal;
}
