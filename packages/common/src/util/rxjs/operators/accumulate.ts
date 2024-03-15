import { Observable, last, scan } from 'rxjs';

export const accumulate = <T>(source: Observable<T>): Observable<T[]> =>
    source.pipe(
        scan((vals, val) => {
            vals.push(val);
            return vals;
        }, [] as T[]),
        last()
    );
