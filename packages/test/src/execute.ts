import { firstValueFrom, isObservable } from 'rxjs';
import { isPromise } from 'util/types';

/**
 * Executes a function. If the result is a `Promise`,
 * awaits the `Promise`. If the result is an `Observable`,
 * awaits the `firstValueFrom` the observable. Otherwise,
 * returns the result.
 *
 * @param fn A function that returns an unknown type
 * @throws Will pass on errors thrown by `fn`
 */
export const execute = async (fn: () => unknown) => {
    try {
        const result = fn();

        if (isPromise(result)) {
            return await result;
        } else if (isObservable(result)) {
            return await firstValueFrom(result);
        } else {
            return result;
        }
    } catch (e) {
        throw e;
    }
};
