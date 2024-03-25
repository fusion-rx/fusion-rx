import { isNativeError } from '../../type';
import { of } from 'rxjs';

/**
 * Handles cases in observables where it is valid for no data to be returned,
 * but RxJS throws a 'no elements in sequence' error.
 * @param err An error caught in `catchError`
 * @returns An empty array if the error message is 'no elements in sequence';
 * otherwise, throws the error.
 *
 * @publicApi
 */
export const handleNoElementsInSequence = (err: any) => {
    if (isNativeError(err)) {
        if (err.message === 'no elements in sequence') {
            return of([] as any[]);
        }
    }

    throw err;
};
