import { isNonNullable } from './non-nullable';

export function isObjectKey<T>(val: unknown): val is keyof T {
    return (
        (isNonNullable<any> && typeof val === 'string') ||
        typeof val === 'symbol' ||
        typeof val === 'number'
    );
}
