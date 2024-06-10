import { isFalsy } from '../../type/type-check.js';
import { NEVER, Observable, of } from 'rxjs';

export function neverIfNull<T>(val: T): Observable<T> {
    return isFalsy(val) ? of(val) : NEVER;
}
