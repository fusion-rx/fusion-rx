import { isNonNullable, parseString } from '../type';
import qs from 'querystring';

/**
 * Delimits an array of values with spaces.
 * @param val Strings to be delimited.
 * @returns Stringified array delimited with spaces.
 */
export const join = (...val: (string | number | symbol)[]): string =>
    val.map((s) => parseString(s)).join(' ');

/**
 * Joins together an array of values without spaces.
 * @param val Strings to be delimited.
 * @returns Stringified array whose values should be joined.
 */
export const squish = (...val: (string | number | symbol)[]): string =>
    val.map((s) => parseString(s)).join('');

/**
 * Delimits an array of values with `comma + space`.
 * @param val Strings to be delimited.
 * @returns Stringified array delimited with `comma + space`.
 */
export const flatList = (...val: (string | number | symbol)[]): string =>
    val.map((s) => parseString(s)).join(', ');

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
    val.map((s) => parseString(s)).join('\n');

/**
 * Delimits an array of values with a custom delimiter.
 * @param delimiter The joining character(s) - i.e. `', '`, `\n`.
 * @param val Strings to be delimited.
 * @returns Stringified array delimited with custom delimiter.
 */
export const joinWith = (
    delimiter: string,
    ...val: (string | number | symbol)[]
) => val.map<string | number>((s) => parseString(s)).join(delimiter);

export declare type URLSegment =
    | string
    | number
    | boolean
    | string[]
    | number[]
    | boolean[]
    | null
    | undefined;

export function joinURL(
    a: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(
    a: URLSegment,
    b?: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(
    a: URLSegment,
    b?: URLSegment,
    c?: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(
    a: URLSegment,
    b?: URLSegment,
    c?: URLSegment,
    d?: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(
    a: URLSegment,
    b?: URLSegment,
    c?: URLSegment,
    d?: URLSegment,
    e?: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(
    a: URLSegment,
    b?: URLSegment,
    c?: URLSegment,
    d?: URLSegment,
    e?: URLSegment,
    f?: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(
    a: URLSegment,
    b?: URLSegment,
    c?: URLSegment,
    d?: URLSegment,
    e?: URLSegment,
    f?: URLSegment,
    g?: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(
    a: URLSegment,
    b?: URLSegment,
    c?: URLSegment,
    d?: URLSegment,
    e?: URLSegment,
    f?: URLSegment,
    g?: URLSegment,
    h?: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(
    a: URLSegment,
    b?: URLSegment,
    c?: URLSegment,
    d?: URLSegment,
    e?: URLSegment,
    f?: URLSegment,
    g?: URLSegment,
    h?: URLSegment,
    i?: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(
    a: URLSegment,
    b?: URLSegment,
    c?: URLSegment,
    d?: URLSegment,
    e?: URLSegment,
    f?: URLSegment,
    g?: URLSegment,
    h?: URLSegment,
    i?: URLSegment,
    j?: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(
    a: URLSegment,
    b?: URLSegment,
    c?: URLSegment,
    d?: URLSegment,
    e?: URLSegment,
    f?: URLSegment,
    g?: URLSegment,
    h?: URLSegment,
    i?: URLSegment,
    j?: URLSegment,
    k?: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(
    a: URLSegment,
    b?: URLSegment,
    c?: URLSegment,
    d?: URLSegment,
    e?: URLSegment,
    f?: URLSegment,
    g?: URLSegment,
    h?: URLSegment,
    i?: URLSegment,
    j?: URLSegment,
    k?: URLSegment,
    l?: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(
    a: URLSegment,
    b?: URLSegment,
    c?: URLSegment,
    d?: URLSegment,
    e?: URLSegment,
    f?: URLSegment,
    g?: URLSegment,
    h?: URLSegment,
    i?: URLSegment,
    j?: URLSegment,
    k?: URLSegment,
    l?: URLSegment,
    m?: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(
    a: URLSegment,
    b?: URLSegment,
    c?: URLSegment,
    d?: URLSegment,
    e?: URLSegment,
    f?: URLSegment,
    g?: URLSegment,
    h?: URLSegment,
    i?: URLSegment,
    j?: URLSegment,
    k?: URLSegment,
    l?: URLSegment,
    m?: URLSegment,
    n?: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(
    a: URLSegment,
    b?: URLSegment,
    c?: URLSegment,
    d?: URLSegment,
    e?: URLSegment,
    f?: URLSegment,
    g?: URLSegment,
    h?: URLSegment,
    i?: URLSegment,
    j?: URLSegment,
    k?: URLSegment,
    l?: URLSegment,
    m?: URLSegment,
    n?: URLSegment,
    o?: URLSegment,
    params?: { [paramName: string]: any }
): string;

export function joinURL(...urlSegments: any[]): string {
    urlSegments = urlSegments
        .filter((segment) => isNonNullable<any>(segment))
        .flatMap((segment) => segment);

    const finalArg = urlSegments.pop();
    let toReturn: string;

    if (typeof finalArg === 'string') {
        toReturn = joinWith('/', ...urlSegments, finalArg);
    } else {
        for (let key of Object.keys(finalArg)) {
            if (!isNonNullable<any>(finalArg[key])) {
                delete finalArg[key];
            } else if (Array.isArray(finalArg[key])) {
                finalArg[key] = finalArg[key].join(',');
            }
        }

        toReturn = joinWith('/', ...urlSegments) + '?' + qs.stringify(finalArg);
    }

    return toReturn;
}
