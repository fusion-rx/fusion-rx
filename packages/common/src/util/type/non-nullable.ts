import { Nullable } from './nullable';

/**
 * Checks if `value` is {@link NonNullable<T>}.
 * @param value A value of type {@link T} or {@link Nullable}
 * @returns True if the value is {@link NonNullable<T>}; otherwise, false.
 */
export const isNonNullable = <T = any>(
    value: T | Nullable
): value is NonNullable<T> => {
    return value !== null && value !== undefined;
};
