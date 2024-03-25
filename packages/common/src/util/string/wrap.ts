import { toString } from '../type';

/**
 * @param val The string to be modified.
 * @returns A string wrapped in double quotation marks.
 */
export const quote = (val: string | number | symbol): string =>
    '"' + toString(val) + '"';

/**
 * @param val The string to be modified.
 * @returns A string wrapped in double quotation marks.
 */
export const singleQuote = (val: string | number | symbol): string =>
    `'` + toString(val) + `'`;

/**
 * @param val The string to be modified.
 * @returns A string wrapped in parenthesis.
 */
export const wrap = (val: string | number | symbol): string =>
    '(' + toString(val) + ')';

/**
 * @param val The string to be modified.
 * @returns A string wrapped in brackets.
 */
export const bracket = (val: string | number | symbol): string =>
    '[' + toString(val) + ']';

/**
 * @param val The string to be modified.
 * @returns A string wrapped in `\\b`.
 */
export const boundaries = (val: string | number | symbol): string =>
    '\\b' + toString(val) + '\\b';
