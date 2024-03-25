import { isArrayLike } from './is-array-like';
import { Nullable } from './nullable';

/** Extracts the type `T` from an `Array<T>`. */
type Unarray<T> = T extends Array<infer U> ? U : T;

/**
 *
 * @param val A value of type {@link Array}, {@link ArrayLike}, or `any`.
 * @returns One of the following:
 * - If `val` is an {@link Array}, returns it
 * - If `val` is an {@link ArrayLike}, returns `Array.from(val)`
 * - If `val` is not an array, returns `[val]`
 * - If `val` is {@link Nullable}, returns an empty {@link Array}
 */
export function toArray<T, R = Unarray<T>>(val: T): R[] {
    return val !== undefined && val !== null
        ? Array.isArray(val)
            ? (val as R[])
            : isArrayLike<R>(val)
              ? Array.from<R>(val)
              : ([val] as R[])
        : ([] as R[]);
}
