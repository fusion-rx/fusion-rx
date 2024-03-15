import { Observable, map } from 'rxjs';
import { toArray } from '../../type';

/**
 * Coerces an projected value into an Array.
 * @param val A value of type {@link Array}, {@link ArrayLike}, or `any`.
 * @returns One of the following:
 * - If `val` is an {@link Array}, returns it
 * - If `val` is an {@link ArrayLike}, returns `Array.from(val)`
 * - If `val` is not an array, returns `[val]`,
 * - If `val` is {@link isNonNullable}, returns `
 */
export const mapArray = <T>(source: Observable<T>) => {
    return source.pipe(map((val) => toArray<T>(val)));
};
