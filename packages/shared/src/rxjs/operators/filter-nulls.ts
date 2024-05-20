import { Observable, filter } from 'rxjs';
import { isNonNullable } from '../../type/type-check.js';

export const filterNull = <T>(projected: Observable<T>) =>
    projected.pipe(filter(isNonNullable));
