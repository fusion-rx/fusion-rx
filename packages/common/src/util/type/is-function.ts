import { isNonNullable } from './non-nullable';

/**
 * Determines if the passed value is a function.
 * @param value The value to type check.
 * @returns True if value is a function ; else, false.
 */
export function isFunction(value: unknown): value is (...args: any[]) => any {
    return isNonNullable<any>(value) && typeof value === 'function';
}
