import { NEVER, Observable, of } from 'rxjs';
import { isNonNullable } from '../../util/type';

export function neverIfNull<T>(val: T): Observable<T> {
    return isNonNullable(val) ? of(val) : NEVER;
}
