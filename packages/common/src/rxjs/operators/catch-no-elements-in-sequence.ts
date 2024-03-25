import { catchError, of } from 'rxjs';
import { isNativeError } from '../../public-api';

export const catchNoElementsInSequence = catchError((err) => {
    if (isNativeError(err)) {
        if (err.message === 'no elements in sequence') {
            return of([] as any[]);
        }
    }

    throw err;
});
