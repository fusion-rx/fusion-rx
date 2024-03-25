import { UnaryFunction } from 'rxjs';

/**
 * @param val A unary function or unknown.
 * @returns True if val is a unary function.
 */
export function isUnaryFunction<T = any, A = any>(
    val: unknown
): val is UnaryFunction<T, A> {
    return val !== undefined && val !== null && typeof val === 'function';
}
