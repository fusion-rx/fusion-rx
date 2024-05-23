import chalk from 'chalk';
import { isNativeError, isPromise } from 'util/types';
import { Injectable } from '../di/public-api.js';
import {
    Observable,
    Subscription,
    catchError,
    firstValueFrom,
    isObservable
} from 'rxjs';
import { Request as ɵRequest, Response as ɵResponse } from 'express';

import { HttpStatusCode } from './http-status-codes.js';
import { expressApp } from './server.js';
import {
    ParamType,
    RequestDef,
    RequestDefWithBody,
    RequestHandler,
    RequestHandlerWithBody
} from './types.js';
import { FsnRouterError, isRouterError } from './router-error.js';

/** An alias for express `Request` objects. */
export declare type FsnRequest = ɵRequest;
/** An alias for express `Request` objects. */
export declare type FsnReq = ɵRequest;
/** An alias for express `Response` objects. */
export declare type FsnResponse = ɵResponse;
/** An alias for express `Response` objects. */
export declare type FsnRes = ɵResponse;
/** Http methods. */
export declare type HttpMethod = 'delete' | 'get' | 'put' | 'post' | 'patch';

export declare type RouteGuard = (
    req: FsnReq,
    res: FsnRes
) => Observable<void> | Promise<void> | void;

export declare type RegistrationOptions = {
    urlParams?: Record<string, ParamType>;
    queryParams?: Record<string, ParamType>;
    guard?: RouteGuard;
};

/**
 * Logs the details for registered routes.
 * @param method An http method type
 * @param path An http method path
 */
const logRouteRegistration = (method: HttpMethod, path: string) => {
    const getMethodColor = () => {
        switch (method) {
            case 'delete':
                return chalk.bold.red(method.toUpperCase());
            case 'get':
                return chalk.bold.blue(method.toUpperCase() + '   ');
            case 'patch':
                return chalk.bold.yellow(method.toUpperCase() + ' ');
            case 'put':
                return chalk.bold.magenta(method.toUpperCase() + '   ');
            default:
                return chalk.bold.green(method.toUpperCase()) + '  ';
        }
    };
    console.log(chalk.green(`${getMethodColor()} ${chalk.gray('=>')} ${path}`));
};

/**
 * Parses a url or query parameters object.
 * @param received The received params object
 * @param expected The expected parameters mapped to their types for parsing
 */
const parseParams = (
    received: Record<string, any>,
    expected?: Record<string, ParamType>
) => {
    if (!expected) return received;

    /**
     * Parses an params individually.
     * @param type The param's expected type
     * @param value The value to parse
     */
    const parseParamValue = (type: ParamType, value: string) => {
        if (value === null || value === undefined) return undefined;
        switch (type) {
            case 'array':
                return value.split(',');
            case 'string[]':
                return value.split(',');
            case 'number[]':
                return value.split(',').map((val) => Number.parseInt(val));
            case 'boolean[]':
                return value.split(',').map((val) => val === 'true');
            case 'boolean':
                return value === 'true';
            case 'number':
                return Number.parseInt(value);
            default:
                return value;
        }
    };

    const parsed: Record<string, any> = {};

    Object.keys(expected).forEach((paramKey) => {
        const type = expected[paramKey];
        if (type) parsed[paramKey] = parseParamValue(type, received[paramKey]);
    });

    return parsed;
};

/**
 * Handles errors thrown in express methods.
 * @param error An error thrown by a incoming request handler
 * @param res An express response object
 */
const formatResponseError = (error: any) => {
    console.error('A request error occurred:');
    console.error(error);

    if (isRouterError(error))
        return {
            status: error.status,
            message: error.message
        };

    if (isNativeError(error))
        return {
            status: 500,
            message: error.message
        };

    if (error === undefined || error === null)
        return {
            message: 'An unknown error occurred.',
            status: 500
        };

    if (typeof error === 'object')
        return {
            message: error['message'] ?? 'A request error occurred.',
            status: error['status'] ?? 500
        };

    return {
        message: 'An unknown error occurred.',
        status: 500
    };
};

/**
 * Registers a set of routes that have a common base path.
 */
@Injectable({
    providedIn: 'module'
})
export class Router {
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
        return this.basePath + '/' + path;
    };

    /**
     * @param method An incoming request method
     * @param path The route of an incoming request
     * @param handle Provieds logic for incoming requests
     * @param options Options used when handling the incoming request
     */
    private _handle(
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
                    if (options && options.guard)
                        return options.guard(req, res);
                    if (this.guard) return this.guard(req, res);
                    else return;
                })();

                if (isObservable(guard)) {
                    await firstValueFrom(guard);
                } else if (isPromise(guard)) {
                    await guard;
                }

                let urlParams = parseParams(req.params, options?.urlParams);
                let queryParams = parseParams(req.query, options?.queryParams);

                const requestProvider: any = {
                    cookies: req.cookies,
                    headers: req.headers,
                    hostname: req.hostname,
                    httpVersion: req.httpVersion,
                    urlParams,
                    queryParams,
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
                                console.log(error);
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
                        this._handle('delete', path, handler, opts)
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
                this._handle('delete', path, handler, opts)
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
                        this._handle('get', path, handler, opts)
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
                this._handle('get', path, handler, opts)
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
                        this._handle('patch', path, handler, opts)
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
                this._handle('patch', path, handler, opts)
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
                        this._handle('post', path, handler, opts)
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
                this._handle('post', path, handler, opts)
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
                        this._handle('put', path, handler, opts)
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
                this._handle('put', path, handler, opts)
        };
    }
}

// export function FsnRouter(options: { basePath?: string; guard?: RouteGuard }) {
//     return (type: any) => {
//         console.log(options, type);
//     };
// }

// export function Route(providers: {
//     urlParams?: Record<string, ParamType>;
//     queryParams?: Record<string, ParamType>;
// }) {
//     return (target: any, propertyKey: string, descriptor: any) => {
//         // console.log(target, propertyKey, descriptor);
//     };
// }
