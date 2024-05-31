import { isNativeError, isPromise } from 'util/types';
import { Injectable } from '../di/public-api.js';
import {
    Observable,
    Subscription,
    catchError,
    firstValueFrom,
    isObservable
} from 'rxjs';

import { HttpMethod, HttpStatusCode } from './router-types.js';
import { expressApp } from '../application/server.js';
import {
    RequestDef,
    RequestDefWithBody,
    RequestHandler,
    RequestHandlerWithBody
} from './router-types.js';
import { FsnRouterError, formatResponseError } from './router-error.js';
import type { RouteGuard } from './route-guard.js';
import {
    RegistrationOptions,
    logRouteRegistration
} from './route-registration.js';
import { parseParams } from './request-parser.js';

/**
 * Registers a set of routes that have a common base path.
 */
@Injectable({
    providedIn: 'module'
})
export class FsnRouter {
    /**
     * An async callback that verifies incoming request.
     * If the verification succeeds, it should update `req` and return void.
     * Otherwise, it should throw an error formatted as:
     * ```ts
     * { status: HttpStatusCode.statusCode, message: string }
     * ```
     */
    constructor(
        public basePath?: string,
        public guard?: RouteGuard
    ) {
        /**
         * Appends a given path to the route's basePath,
         * adding slashes where necessary.
         * @param path A path to register
         * @returns `path` appended to {@link basePath}
         */
        if (basePath) this.basePath = '/' + basePath;
        else this.basePath = '';
    }

    /**
     *
     * @param path
     * @returns
     */
    private _prependBasePath = (path: string) => {
        if (path.startsWith('/')) return this.basePath + path;
        if (path.length === 0) return this.basePath + '';
        return this.basePath + '/' + path;
    };

    /**
     * @param method An incoming request method
     * @param path The route of an incoming request
     * @param handle Provieds logic for incoming requests
     * @param options Options used when handling the incoming request
     */
    public register(
        method: HttpMethod,
        path: string,
        handle: RequestHandler<any> | RequestHandlerWithBody<any>,
        options?: RegistrationOptions
    ) {
        path = this._prependBasePath(path);
        logRouteRegistration(method, path);

        expressApp[method](path, async (req, res) => {
            try {
                let subscription: Subscription;

                res.on('close', () => {
                    if (subscription) subscription.unsubscribe();
                });

                const guard = (() => {
                    if (options && options.guard) return options.guard(req);
                    if (this.guard) return this.guard(req);
                    else return;
                })();

                if (isObservable(guard)) {
                    await firstValueFrom(guard);
                } else if (isPromise(guard)) {
                    await guard;
                }

                const requestProvider: any = {
                    cookies: req.cookies,
                    headers: req.headers,
                    hostname: req.hostname,
                    httpVersion: req.httpVersion,
                    urlParams: parseParams(req.params, options?.urlParams),
                    queryParams: parseParams(req.query, options?.queryParams),
                    rawHeaders: req.rawHeaders
                };

                if (method !== 'get' && method !== 'delete') {
                    requestProvider['body'] = req.body;
                }

                const handlerRes = handle(requestProvider, req, res);

                if (isObservable(handlerRes)) {
                    const response: any[] = [];

                    subscription = handlerRes
                        .pipe(
                            catchError((err) => {
                                if (isNativeError(err)) {
                                    if (
                                        err.message ===
                                        'no elements in sequence'
                                    ) {
                                        throw new FsnRouterError(
                                            'NoContent',
                                            'Message returned new project.'
                                        );
                                    }
                                }

                                throw err;
                            })
                        )
                        .subscribe({
                            next: (val) => {
                                response.push(val);
                            },
                            error: (error) => {
                                console.error(error);
                                const formatted = formatResponseError(error);
                                res.status(formatted.status).json(formatted);
                            },
                            complete: () => {
                                if (response.length === 0) {
                                    res.status(HttpStatusCode.NoContent).send({
                                        code: HttpStatusCode.NoContent,
                                        message: 'No response for your query.'
                                    });
                                } else if (response.length === 0) {
                                    res.json(response[0]);
                                } else {
                                    res.json(response);
                                }
                            }
                        });
                } else if (isPromise(handlerRes)) {
                    handlerRes
                        .then((response) => {
                            if (response) {
                                res.json(response);
                            } else {
                                res.status(HttpStatusCode.NoContent).json({
                                    status: HttpStatusCode.NoContent,
                                    message: 'Respoonse returned no content.'
                                });
                            }
                        })
                        .catch((reason) => {
                            const formatted = formatResponseError(reason);
                            res.status(formatted.status).json(formatted);
                        });
                } else {
                    if (handlerRes) res.json(handlerRes);
                    else {
                        res.status(HttpStatusCode.NoContent).json({
                            status: HttpStatusCode.NoContent,
                            message: 'Respoonse returned no content.'
                        });
                    }
                }
            } catch (error) {
                const formatted = formatResponseError(error);
                res.status(formatted.status).send(formatted);
                return;
            }
        });

        return this;
    }

    /**
     * Registers a delete endpoint at `path`.
     * @param path A request path
     */
    delete(path: string) {
        let opts: RegistrationOptions;

        return {
            /**
             * Instructs the router which request elements to
             * provide to the handler.
             * @param opts Options that define how the router will
             * pass request elements to the handler
             */
            provide: (opts: RegistrationOptions) => {
                return {
                    /**
                     * Provides the logic for responding to incoming requests.
                     * @param handler A callback that handles incoming requests.
                     * If the request succeeds, the handler should observe, resolve,
                     * or return a response object. Otherwise, it should throw a
                     * {@link FsnRouterError}.
                     * @returns this
                     */
                    register: <T extends RequestDef>(
                        handler: RequestHandler<T>
                    ): Observable<any> | Promise<any> | any =>
                        this.register('delete', path, handler, opts)
                };
            },
            /**
             * Provides the logic for responding to incoming requests.
             * @param handler A callback that handles incoming requests.
             * If the request succeeds, the handler should observe, resolve,
             * or return a response object. Otherwise, it should throw a
             * {@link FsnRouterError}.
             * @returns this
             */
            register: <T extends RequestDef>(
                handler: RequestHandler<T>
            ): Observable<any> | Promise<any> | any =>
                this.register('delete', path, handler, opts)
        };
    }

    /**
     * Registers a get endpoint at `path`.
     * @param path A request path
     */
    get(path: string) {
        let opts: RegistrationOptions;

        return {
            /**
             * Instructs the router which request elements to
             * provide to the handler.
             * @param opts Options that define how the router will
             * pass request elements to the handler
             */
            provide: (opts: RegistrationOptions) => {
                return {
                    /**
                     * Provides the logic for responding to incoming requests.
                     * @param handler A callback that handles incoming requests.
                     * If the request succeeds, the handler should observe, resolve,
                     * or return a response object. Otherwise, it should throw a
                     * {@link FsnRouterError}.
                     * @returns this
                     */
                    register: <T extends RequestDef>(
                        handler: RequestHandler<T>
                    ): Observable<any> | Promise<any> | any =>
                        this.register('get', path, handler, opts)
                };
            },
            /**
             * Provides the logic for responding to incoming requests.
             * @param handler A callback that handles incoming requests.
             * If the request succeeds, the handler should observe, resolve,
             * or return a response object. Otherwise, it should throw a
             * {@link FsnRouterError}.
             * @returns this
             */
            register: <T extends RequestDef>(
                handler: RequestHandler<T>
            ): Observable<any> | Promise<any> | any =>
                this.register('get', path, handler, opts)
        };
    }

    /**
     * Registers a patch endpoint at `path`.
     * @param path A request path
     */
    patch(path: string) {
        let opts: RegistrationOptions;

        return {
            /**
             * Instructs the router which request elements to
             * provide to the handler.
             * @param opts Options that define how the router will
             * pass request elements to the handler
             */
            provide: (opts: RegistrationOptions) => {
                return {
                    /**
                     * Provides the logic for responding to incoming requests.
                     * @param handler A callback that handles incoming requests.
                     * If the request succeeds, the handler should observe, resolve,
                     * or return a response object. Otherwise, it should throw a
                     * {@link FsnRouterError}.
                     * @returns this
                     */
                    register: <T extends RequestDefWithBody>(
                        handler: RequestHandlerWithBody<T>
                    ): Observable<any> | Promise<any> | any =>
                        this.register('patch', path, handler, opts)
                };
            },
            /**
             * Provides the logic for responding to incoming requests.
             * @param handler A callback that handles incoming requests.
             * If the request succeeds, the handler should observe, resolve,
             * or return a response object. Otherwise, it should throw a
             * {@link FsnRouterError}.
             * @returns this
             */
            register: <T extends RequestDefWithBody>(
                handler: RequestHandlerWithBody<T>
            ): Observable<any> | Promise<any> | any =>
                this.register('patch', path, handler, opts)
        };
    }

    /**
     * Registers a post endpoint at `path`.
     * @param path A request path
     */
    post(path: string) {
        let opts: RegistrationOptions;

        return {
            /**
             * Instructs the router which request elements to
             * provide to the handler.
             * @param opts Options that define how the router will
             * pass request elements to the handler
             */
            provide: (opts: RegistrationOptions) => {
                return {
                    /**
                     * Provides the logic for responding to incoming requests.
                     * @param handler A callback that handles incoming requests.
                     * If the request succeeds, the handler should observe, resolve,
                     * or return a response object. Otherwise, it should throw a
                     * {@link FsnRouterError}.
                     * @returns this
                     */
                    register: <T extends RequestDefWithBody>(
                        handler: RequestHandlerWithBody<T>
                    ): Observable<any> | Promise<any> | any =>
                        this.register('post', path, handler, opts)
                };
            },
            /**
             * Provides the logic for responding to incoming requests.
             * @param handler A callback that handles incoming requests.
             * If the request succeeds, the handler should observe, resolve,
             * or return a response object. Otherwise, it should throw a
             * {@link FsnRouterError}.
             * @returns this
             */
            register: <T extends RequestDefWithBody>(
                handler: RequestHandlerWithBody<T>
            ): Observable<any> | Promise<any> | any =>
                this.register('post', path, handler, opts)
        };
    }

    /**
     * Registers a put endpoint at `path`.
     * @param path A request path
     */
    put(path: string) {
        let opts: RegistrationOptions;

        return {
            /**
             * Instructs the router which request elements to
             * provide to the handler.
             * @param opts Options that define how the router will
             * pass request elements to the handler
             */
            provide: (opts: RegistrationOptions) => {
                return {
                    /**
                     * Provides the logic for responding to incoming requests.
                     * @param handler A callback that handles incoming requests.
                     * If the request succeeds, the handler should observe, resolve,
                     * or return a response object. Otherwise, it should throw a
                     * {@link FsnRouterError}.
                     * @returns this
                     */
                    register: <T extends RequestDefWithBody>(
                        handler: RequestHandlerWithBody<T>
                    ): Observable<any> | Promise<any> | any =>
                        this.register('put', path, handler, opts)
                };
            },
            /**
             * Provides the logic for responding to incoming requests.
             * @param handler A callback that handles incoming requests.
             * If the request succeeds, the handler should observe, resolve,
             * or return a response object. Otherwise, it should throw a
             * {@link FsnRouterError}.
             * @returns this
             */
            register: <T extends RequestDefWithBody>(
                handler: RequestHandlerWithBody<T>
            ): Observable<any> | Promise<any> | any =>
                this.register('put', path, handler, opts)
        };
    }
}
