import { NEVER, Observable, of } from 'rxjs';
import { isNonNullable } from '../../type';

export function neverIfNull<T>(val: T): Observable<T> {
    return isNonNullable(val) ? of(val) : NEVER;
}
