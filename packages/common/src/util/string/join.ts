import { toString } from '../type';

/**
 * Delimits an array of values with spaces.
 * @param val Strings to be delimited.
 * @returns Stringified array delimited with spaces.
 */
export const join = (...val: (string | number | symbol)[]): string =>
    val.map((s) => toString(s)).join(' ');

/**
 * Joins together an array of values without spaces.
 * @param val Strings to be delimited.
 * @returns Stringified array whose values should be joined.
 */
export const squish = (...val: (string | number | symbol)[]): string =>
    val.map((s) => toString(s)).join('');

/**
 * Delimits an array of values with `comma + space`.
 * @param val Strings to be delimited.
 * @returns Stringified array delimited with `comma + space`.
 */
export const flatList = (...val: (string | number | symbol)[]): string =>
    val.map((s) => toString(s)).join(', ');

/**
 *
 * @param val Strings to be delimited.
 * @returns Stringified array delimited with `- + listItem + \n`
 */
export const list = (...val: (string | number | symbol)[]): string =>
    val.map((s) => join('\t-', s)).join('\n');

/**
 * Delimits an array of values with `\n`.
 * @param val Strings to be delimited.
 * @returns Stringified array delimited with `\n`.
 */
export const newLine = (...val: (string | number | symbol)[]): string =>
    val.map((s) => toString(s)).join('\n');
