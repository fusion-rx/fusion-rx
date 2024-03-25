import { isNonNullable } from '../../type';
import { NEVER, Observable, of } from 'rxjs';

export function neverIfNull<T>(val: T): Observable<T> {
    return isNonNullable(val) ? of(val) : NEVER;
}
