import { Observable } from 'rxjs';

export declare type FromTryCatchFn<T> = () => T;

export function fromTryCatch<T>(
    selectFnCall: () => FromTryCatchFn<T> | null
): Observable<T> {
    return new Observable<T>((subscriber) => {
        const fn = selectFnCall();

        if (fn) {
            try {
                subscriber.next(fn());
                subscriber.complete();
            } catch (error) {
                subscriber.error(error);
            }
        } else {
            subscriber.error(
                new Error('Error: Failed to determine function from arguments.')
            );
        }
    });
}
