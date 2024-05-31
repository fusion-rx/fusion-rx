import { Observable, Subscription, isObservable } from 'rxjs';
import { FsnReq } from './router-types.js';
import { formatResponseError } from './router-error.js';
import { isPromise } from 'util/types';

/**
 * A `RouteGuard` is a function that evaluates an incoming http
 * {@link FsnReq}, throwing a `FsnRouterError` or native JavaScript
 * `Error` if the request should be rejected. Fusion automatically
 * formats thrown errors and sends them to the incoming http request.
 *
 * @note If your guard returns an observable, the observable MUST complete.
 * Otherwise, the guard will never return.
 *
 * @publicApi
 */
export declare type RouteGuard = (
    context: FsnReq
) => Observable<any> | Promise<any> | undefined;

export const evaluateGuard = async (
    req: FsnReq,
    guard?: RouteGuard
): Promise<void> => {
    let subscription: Subscription;
    req.on('close', () => {
        if (subscription) subscription.unsubscribe();
    });

    return new Promise<void>((resolve, reject) => {
        if (!guard) return;

        try {
            const guardRes = guard(req);

            if (isObservable(guardRes)) {
                guardRes.subscribe({
                    error: (error) => reject(formatResponseError(error)),
                    complete: () => resolve()
                });
            }

            if (isPromise(guard)) {
                guard.then(() => resolve()).catch((reason) => reject(reason));
            }

            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
