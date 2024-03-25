import { isNonNullable } from './non-nullable';
import { Nullable } from './nullable';

export function isNonNullObject<T>(val: T | Nullable): val is NonNullable<T> {
    return isNonNullable<T>(val) && typeof val === 'object';
}
