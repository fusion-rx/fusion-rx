import { isNonNullable } from './non-nullable';

/**
 * - If `val` is a number, returns it.
 * - If `val` is a boolean, returns `1` for `true` and `0` for false.
 * - If `val` is a string, parses the string, returning the parsed value if it is a number.
 * - If `val` is Nullable, returns `defaultVal`.
 * @param val A value whose type is `boolean` or `unknown`.
 * @param defaultVal (optional) A default value to return if `val` is Nullable
 * or cannot be parsed. Defaults to `0`.
 */
export function toNumber<T>(val: T, defaultVal = 0): any {
    if (isNonNullable(val)) {
        switch (typeof val) {
            case 'number':
                return val;
            case 'boolean':
                return val === true ? 1 : 0;
            case 'string':
                const number = Number.parseInt(val);
                if (!Number.isNaN(number)) return number;
        }
    }

    return defaultVal;
}
