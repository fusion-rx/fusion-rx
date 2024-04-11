import { AfterAppInit, Injectable, Inject } from '@fusion-rx/core';
import { Logger } from '@fusion-rx/shared';
import {
    NEVER,
    Observable,
    Subject,
    catchError,
    concatMap,
    isObservable,
    map,
    of
} from 'rxjs';
import express, { Request, Response } from 'express';
import { isPromise } from 'util/types';

const logger = new Logger('ExpressService');

export declare type HttpMethod = 'get' | 'put' | 'post' | 'patch' | 'delete';

export declare type Param = Record<string, any>;

export declare type ParamType =
    | 'string'
    | 'boolean'
    | 'number'
    | 'array'
    | 'string[]'
    | 'number[]'
    | 'boolean[]';

export declare interface Options {
    params?: Record<string, ParamType>;
    query?: Record<string, ParamType>;
}

export declare type ReqHandler<T> = (
    req: T
) => Observable<any> | Promise<any> | any | Promise<any> | any;

export declare interface ReqResponse {
    cookies: Record<string, any>;
    headers: Record<string, any> | string[];
    rawHeaders: string[];
    hostname: string;
    httpVersion: string;
}

const parseParams = (received: any, expected?: Record<string, ParamType>) => {
    if (!expected) return received;

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

const evalSignature = (
    optionsOrHandler: Options | ReqHandler<any>,
    handlerOrNull?: ReqHandler<any>
): {
    handler: ReqHandler<any>;
    options: Options;
} => {
    if (typeof optionsOrHandler === 'object') {
        if (handlerOrNull !== undefined)
            return {
                handler: handlerOrNull,
                options: optionsOrHandler
            };
        else {
            throw new Error();
        }
    } else {
        return {
            handler: optionsOrHandler,
            options: {}
        };
    }
};

@Injectable({
    providedIn: 'root'
})
export class ExpressService implements AfterAppInit {
    public express = express();

    constructor(
        @Inject('EXPRESS_PORT') private _expressPort: number,
        @Inject('EXPRESS_HOST') private _expressHost: string
    ) {}

    fsnAfterAppInit(): void {
        this.express.listen(this._expressPort, this._expressHost, () => {
            logger.log(
                `Express server listening on ${this._expressHost}:${this._expressPort}`
            );
        });
    }

    /**
     * Internal method that registers express endpoints.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    private _register(args: {
        method: HttpMethod;
        route: string | string[];
        handler: ReqHandler<
            ReqResponse & {
                params: any;
                query: any;
                body?: any;
            }
        >;
        options?: Options;
    }): Observable<any> {
        // Join array route
        let endpoint = Array.isArray(args.route)
            ? args.route.join('/')
            : args.route;

        // Express is finicky with starting methods with a forward-slash,
        // so if the endpoint doesn't, add one.
        if (!endpoint.startsWith('/')) endpoint = '/' + endpoint;

        // Log the method type to the endpoint
        logger.log(`Mapped ${args.method.toUpperCase()} => ${endpoint}`);

        const reqSubject = new Subject<{
            req: ReqResponse & {
                params: any;
                query: any;
                body?: any;
            };
            res: Response;
        }>();

        this.express[args.method](
            args.route,
            (request: Request, response: Response) => {
                const req: ReqResponse & {
                    params: any;
                    query: any;
                    body?: any;
                } = {
                    params: parseParams(request.params, args.options?.params),
                    query: parseParams(request.query, args.options?.query),
                    cookies: request.cookies,
                    headers: request.headers,
                    rawHeaders: request.rawHeaders,
                    hostname: request.hostname,
                    httpVersion: request.httpVersion
                };

                if (
                    args.method === 'post' ||
                    args.method === 'patch' ||
                    args.method === 'put'
                ) {
                    req['body'] = request.body ?? {};
                }

                reqSubject.next({
                    req,
                    res: response
                });
            }
        );

        return reqSubject.pipe(
            concatMap((next) => {
                const handlerRes = args.handler(next.req);

                let response: Observable<any>;

                if (isObservable(handlerRes)) {
                    response = handlerRes;
                } else if (isPromise(handlerRes)) {
                    response = new Observable((subscriber) => {
                        handlerRes
                            .then((value) => {
                                subscriber.next(value);
                                subscriber.complete();
                            })
                            .catch((reason) => {
                                subscriber.error(reason);
                            });
                    });
                } else {
                    response = of(handlerRes);
                }

                return response.pipe(
                    catchError((caught) => {
                        next.res.status(caught['status'] ?? 500).send(caught);
                        return NEVER;
                    }),
                    map((handlerResponse) => {
                        next.res.send(handlerResponse);
                        return handlerResponse;
                    })
                );
            })
        );
    }

    /**
     * Registers a `delete` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public delete<P extends Param = any, B = any>(
        route: string | string[],
        options: Options & {
            params: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: P;
                query: Record<string, any>;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `delete` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public delete<Q extends Param = any>(
        route: string | string[],
        options: {
            query: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: Record<string, any>;
                query: Q;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `delete` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public delete<P extends Param = any, Q extends Param = any>(
        route: string | string[],
        options: Options & {
            query: Record<string, ParamType>;
            params: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: P;
                query: Q;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `delete` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public delete(
        route: string | string[],
        optionsOrHandler: Options | ReqHandler<any>,
        handlerOrNull?: ReqHandler<any>
    ): Observable<any> {
        const opts = evalSignature(optionsOrHandler, handlerOrNull);
        return this._register({
            method: 'delete',
            route,
            handler: opts.handler,
            options: opts.options
        });
    }

    /**
     * Registers a `get` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public get<P extends Param = any>(
        route: string | string[],
        options: Options & {
            params: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: P;
                query: Record<string, any>;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `get` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public get<Q extends Param = any>(
        route: string | string[],
        options: {
            query: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: Record<string, any>;
                query: Q;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `get` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public get<P extends Param = any, Q extends Param = any>(
        route: string | string[],
        options: Options & {
            query: Record<string, ParamType>;
            params: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: P;
                query: Q;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `get` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public get(
        route: string | string[],
        handler: ReqHandler<
            ReqResponse & {
                params: Record<string, any>;
                query: Record<string, any>;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `get` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public get(
        route: string | string[],
        optionsOrHandler: Options | ReqHandler<any>,
        handlerOrNull?: ReqHandler<any>
    ): Observable<any> {
        const opts = evalSignature(optionsOrHandler, handlerOrNull);
        return this._register({
            method: 'get',
            route,
            handler: opts.handler,
            options: opts.options
        });
    }

    /**
     * Registers a `patch` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public patch<P extends Param = any, B = any>(
        route: string | string[],
        options: Options & {
            params: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: P;
                query: Record<string, any>;
                body?: B;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `patch` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public patch<Q extends Param = any, B = any>(
        route: string | string[],
        options: {
            query: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: Record<string, any>;
                query: Q;
                body?: B;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `patch` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public patch<P extends Param = any, Q extends Param = any, B = any>(
        route: string | string[],
        options: Options & {
            query: Record<string, ParamType>;
            params: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: P;
                query: Q;
                body?: B;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `patch` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public patch<P extends Param = any, Q extends Param = any, B = any>(
        route: string | string[],
        handler: ReqHandler<
            ReqResponse & {
                params: P;
                query: Q;
                body?: B;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `patch` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public patch(
        route: string | string[],
        handlerOrOptions: Options | ReqHandler<any>,
        handlerOrNull?: (req: any) => ReqHandler<any>
    ): Observable<any> {
        const opts = evalSignature(handlerOrOptions, handlerOrNull);
        return this._register({
            method: 'patch',
            route,
            handler: opts.handler,
            options: opts.options
        });
    }

    /**
     * Registers a `post` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public post<P extends Param = any, B = any>(
        route: string | string[],
        options: Options & {
            params: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: P;
                query: Record<string, any>;
                body?: B;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `post` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public post<Q extends Param = any, B = any>(
        route: string | string[],
        options: {
            query: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: Record<string, any>;
                query: Q;
                body?: B;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `post` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public post<P extends Param = any, Q extends Param = any, B = any>(
        route: string | string[],
        options: Options & {
            query: Record<string, ParamType>;
            params: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: P;
                query: Q;
                body?: B;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `post` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public post(
        route: string | string[],
        handlerOrOptions: Options | ReqHandler<any>,
        handlerOrNull?: ReqHandler<any>
    ): Observable<any> {
        const opts = evalSignature(handlerOrOptions, handlerOrNull);
        return this._register({
            method: 'post',
            route,
            handler: opts.handler,
            options: opts.options
        });
    }

    /**
     * Registers a `put` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public put<P extends Param = any, B = any>(
        route: string | string[],
        options: Options & {
            params: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: P;
                query: Record<string, any>;
                body?: B;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `put` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public put<Q extends Param = any, B = any>(
        route: string | string[],
        options: {
            query: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: Record<string, any>;
                query: Q;
                body?: B;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `put` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public put<P extends Param = any, Q extends Param = any, B = any>(
        route: string | string[],
        options: Options & {
            query: Record<string, ParamType>;
            params: Record<string, ParamType>;
        },
        handler: ReqHandler<
            ReqResponse & {
                params: P;
                query: Q;
                body?: B;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `put` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public put<B = any>(
        route: string | string[],
        handler: ReqHandler<
            ReqResponse & {
                params: Param;
                query: Param;
                body?: B;
            }
        >
    ): Observable<any>;

    /**
     * Registers a `put` REST endpoint.
     * @param route The HTTP method route
     * @param options Options that determine values provided to `handler`
     * @param handler A closure that returns the response payload
     */
    public put(
        route: string | string[],
        handlerOrOptions: Options | ReqHandler<any>,
        handlerOrNull?: ReqHandler<any>
    ): Observable<any> {
        const opts = evalSignature(handlerOrOptions, handlerOrNull);
        return this._register({
            method: 'post',
            route,
            handler: opts.handler,
            options: opts.options
        });
    }
}
