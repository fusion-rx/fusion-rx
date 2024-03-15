import QueryString from 'qs';
import { joinWith } from '../string';
import { isNonNullable } from '../type';

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

        toReturn =
            joinWith('/', ...urlSegments) +
            '?' +
            QueryString.stringify(finalArg);
    }

    return toReturn;
}
