import { Observable } from 'rxjs';

/**
 * Converts a promise to an observable.
 * @param closure Return the promise to be evaluated.
 * @returns An observable that executes the promise.
 */
export function fromPromise<T>(closure: () => Promise<T>): Observable<T> {
    return new Observable<T>((subscriber) => {
        closure()
            .then((resolve) => {
                subscriber.next(resolve);
                subscriber.complete();
            })
            .catch((reason) => subscriber.error(reason));
    });
}
