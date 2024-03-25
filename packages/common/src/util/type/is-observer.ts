import { Observer } from 'rxjs';
import { isFunction } from './is-function';

/**
 * Determines if the passed value is an observer.
 * @param value The value to type check.
 * @returns True if value is an observer; else, false.
 */
export function isObserver<T>(value: any): value is Observer<T> {
    return (
        value &&
        isFunction(value.next) &&
        isFunction(value.error) &&
        isFunction(value.complete)
    );
}
