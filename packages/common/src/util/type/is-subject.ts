import { Subject } from 'rxjs';
import { isFunction } from './is-function';

export function isSubject<T>(value: any): value is Subject<T> {
    return (
        value &&
        isFunction(value.lift) &&
        isFunction(value.next) &&
        isFunction(value.error)
    );
}
