import { Observable, filter } from 'rxjs';
import { isNonNullable } from '../../util/type';

export const filterNull = <T>(projected: Observable<T>) =>
    projected.pipe(filter(isNonNullable));
