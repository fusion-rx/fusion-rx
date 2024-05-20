import { parseString } from '../type/parse.js';

/**
 * @param val The string to be modified.
 * @returns A string wrapped in double quotation marks.
 */
export const quote = (val: string | number | symbol): string =>
    '"' + parseString(val) + '"';

/**
 * @param val The string to be modified.
 * @returns A string wrapped in double quotation marks.
 */
export const singleQuote = (val: string | number | symbol): string =>
    `'` + parseString(val) + `'`;

/**
 * @param val The string to be modified.
 * @returns A string wrapped in parenthesis.
 */
export const parens = (val: string | number | symbol): string =>
    '(' + parseString(val) + ')';

/**
 * @param val The string to be modified.
 * @returns A string wrapped in brackets.
 */
export const bracket = (val: string | number | symbol): string =>
    '[' + parseString(val) + ']';

/**
 * @param val The string to be modified.
 * @returns A string wrapped in `\\b`.
 */
export const boundaries = (val: string | number | symbol): string =>
    '\\b' + parseString(val) + '\\b';
