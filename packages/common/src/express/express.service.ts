import { AfterAppInit, Logger, Injectable, Inject } from '@fusion-rx/core';
import { Observable } from 'rxjs';
import express, { Request, Response } from 'express';

const logger = new Logger('ExpressService');

export declare type HttpMethod = 'get' | 'put' | 'post' | 'patch' | 'delete';

export declare type ParamType = 'string' | 'boolean' | 'number' | 'array';

export declare interface Options {
    includeRawRequest?: boolean;
    params?: Record<string, ParamType>;
    query?: Record<string, ParamType>;
}

export declare interface RequestResponse {
    cookies: Record<string, any>;
    headers: Record<string, any> | string[];
    rawHeaders: string[];
    hostname: string;
    httpVersion: string;
    res: Response;
    params?: Record<string, any>;
    query?: Record<string, any>;
    req?: Request;
}

const parseParams = (received: any, expected?: Record<string, ParamType>) => {
    if (!expected) return undefined;

    const parseParamValue = (type: ParamType, value: string) => {
        if (value === null || value === undefined) return undefined;
        switch (type) {
            case 'array':
                return value.split(',');
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

@Injectable({
    providedIn: 'root'
})
export class ExpressService implements AfterAppInit {
    public express;

    constructor(
        @Inject('EXPRESS_PORT') private _expressPort: number,
        @Inject('EXPRESS_HOST') private _expressHost: string
    ) {
        this.express = express();
    }

    fsnAfterAppInit(): void {
        this.express.listen(this._expressPort, this._expressHost, () => {
            logger.log(
                `Express server listening on ${this._expressHost}:${this._expressPort}`
            );
        });
    }

    // Handle signatures that include raw request

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public register<B = any>(
        method: HttpMethod,
        route: string | string[]
    ): Observable<Response>;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public register<B = any>(
        method: HttpMethod,
        route: string | string[],
        options: Options & {
            includeRawRequest: true;
        }
    ): Observable<
        RequestResponse & {
            req: Request;
            body?: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public register<P extends Record<string, any> = any, B = any>(
        method: HttpMethod,
        route: string | string[],
        options: Options & {
            includeRawRequest: true;
            params: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            req: Request;
            params: P;
            body?: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public register<Q extends Record<string, any> = any, B = any>(
        method: HttpMethod,
        route: string | string[],
        options: Options & {
            includeRawRequest: true;
            query: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            req: Request;
            query: Q;
            body?: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public register<
        P extends Record<string, any> = any,
        Q extends Record<string, any> = any,
        B = any
    >(
        method: HttpMethod,
        route: string | string[],
        options: Options & {
            includeRawRequest: true;
            params: Record<string, ParamType>;
            query: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            req: Request;
            params: P;
            query: Q;
            body?: B;
        }
    >;

    // Handle signatures that exclude raw request

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public register<B = any>(
        method: HttpMethod,
        route: string | string[],
        options?: Options & {
            includeRawRequest?: false;
        }
    ): Observable<
        RequestResponse & {
            body?: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public register<P extends Record<string, any> = any, B = any>(
        method: HttpMethod,
        route: string | string[],
        options: Options & {
            includeRawRequest?: false;
            params: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            params: P;
            body?: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public register<Q extends Record<string, any> = any, B = any>(
        method: HttpMethod,
        route: string | string[],
        options: {
            includeRawRequest?: false;
            query: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            query: Q;
            body?: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public register<
        P extends Record<string, any> = any,
        Q extends Record<string, any> = any,
        B = any
    >(
        method: HttpMethod,
        route: string | string[],
        options: Options & {
            includeRawRequest?: false;
            query: Record<string, ParamType>;
            params: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            params: P;
            query: Q;
            body?: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public register(
        method: HttpMethod,
        route: string | string[],
        options?: Options
    ) {
        return this._register(method, route, options);
    }

    /**
     * Internal method that registers express endpoints.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    private _register(
        method: HttpMethod,
        route: string | string[],
        options?: Options
    ) {
        // Join array route
        let endpoint = Array.isArray(route) ? route.join('/') : route;

        // Express is finicky with starting methods with a forward-slash,
        // so if the endpoint doesn't, add one.
        if (!endpoint.startsWith('/')) endpoint = '/' + endpoint;

        // Log the method type to the endpoint
        logger.log(`Mapped ${method.toUpperCase()} => ${endpoint}`);

        return new Observable<any>((subscriber) => {
            this.express[method](route, (req: Request, res: Response) => {
                const response: RequestResponse & {
                    body?: any;
                } = {
                    res,
                    params: options?.params
                        ? parseParams(req.params, options.params)
                        : req.params,
                    query: options?.query
                        ? parseParams(req.query, options.query)
                        : req.query,
                    httpVersion: req.httpVersion,
                    headers: req.headers,
                    rawHeaders: req.rawHeaders,
                    hostname: req.hostname,
                    cookies: req.cookies
                };

                if (options?.includeRawRequest) {
                    response.req = req;
                }

                if (
                    method === 'post' ||
                    method === 'patch' ||
                    (method === 'put' && req.body)
                ) {
                    response.body = req.body;
                }

                subscriber.next(response);
            });
        });
    }

    // Handle signatures that exclude raw request

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to delete
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public delete(
        route: string | string[],
        options?: Options & {
            includeRawRequest?: false;
        }
    ): Observable<RequestResponse>;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to delete
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public delete<P extends Record<string, any> = any>(
        route: string | string[],
        options: Options & {
            includeRawRequest?: false;
            params: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            params: P;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to delete
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public delete<Q extends Record<string, any> = any>(
        route: string | string[],
        options: {
            includeRawRequest?: false;
            query: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            query: Q;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to delete
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public delete<
        P extends Record<string, any> = any,
        Q extends Record<string, any> = any
    >(
        route: string | string[],
        options: Options & {
            includeRawRequest?: false;
            query: Record<string, ParamType>;
            params: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            params: P;
            query: Q;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public delete(route: string | string[], options?: Options) {
        return this._register('delete', route, options);
    }

    // Handle signatures that exclude raw request

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to get
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public get(
        route: string | string[],
        options?: Options & {
            includeRawRequest?: false;
        }
    ): Observable<RequestResponse>;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to get
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public get<P extends Record<string, any> = any>(
        route: string | string[],
        options: Options & {
            includeRawRequest?: false;
            params: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            params: P;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to get
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public get<Q extends Record<string, any> = any>(
        route: string | string[],
        options: {
            includeRawRequest?: false;
            query: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            query: Q;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to get
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public get<
        P extends Record<string, any> = any,
        Q extends Record<string, any> = any
    >(
        route: string | string[],
        options: Options & {
            includeRawRequest?: false;
            query: Record<string, ParamType>;
            params: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            params: P;
            query: Q;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public get(route: string | string[], options?: Options) {
        return this._register('get', route, options);
    }

    // Handle signatures that exclude raw request

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to patch
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public patch<B = any>(
        route: string | string[],
        options?: Options & {
            includeRawRequest?: false;
        }
    ): Observable<
        RequestResponse & {
            body: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to patch
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public patch<P extends Record<string, any> = any, B = any>(
        route: string | string[],
        options: Options & {
            includeRawRequest?: false;
            params: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            params: P;
            body: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to patch
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public patch<Q extends Record<string, any> = any, B = any>(
        route: string | string[],
        options: {
            includeRawRequest?: false;
            query: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            query: Q;
            body: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to patch
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public patch<
        P extends Record<string, any> = any,
        Q extends Record<string, any> = any,
        B = any
    >(
        route: string | string[],
        options: Options & {
            includeRawRequest?: false;
            query: Record<string, ParamType>;
            params: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            params: P;
            query: Q;
            body: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public patch(route: string | string[], options?: Options) {
        return this._register('patch', route, options);
    }

    // Handle signatures that exclude raw request

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to post
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public post<B = any>(
        route: string | string[],
        options?: Options & {
            includeRawRequest?: false;
        }
    ): Observable<
        RequestResponse & {
            body: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to post
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public post<P extends Record<string, any> = any, B = any>(
        route: string | string[],
        options: Options & {
            includeRawRequest?: false;
            params: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            params: P;
            body: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to post
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public post<Q extends Record<string, any> = any, B = any>(
        route: string | string[],
        options: {
            includeRawRequest?: false;
            query: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            query: Q;
            body: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to post
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public post<
        P extends Record<string, any> = any,
        Q extends Record<string, any> = any,
        B = any
    >(
        route: string | string[],
        options: Options & {
            includeRawRequest?: false;
            query: Record<string, ParamType>;
            params: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            params: P;
            query: Q;
            body: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public post(route: string | string[], options?: Options) {
        return this._register('post', route, options);
    }

    public put(route: string | string[]): Observable<{
        req: Request;
        res: Response;
    }>;

    // Handle signatures that exclude raw request

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to put
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public put<B = any>(
        route: string | string[],
        options?: Options & {
            includeRawRequest?: false;
        }
    ): Observable<
        RequestResponse & {
            body: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to put
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public put<P extends Record<string, any> = any, B = any>(
        route: string | string[],
        options: Options & {
            includeRawRequest?: false;
            params: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            params: P;
            body: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to put
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public put<Q extends Record<string, any> = any, B = any>(
        route: string | string[],
        options: {
            includeRawRequest?: false;
            query: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            query: Q;
            body: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to put
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public put<
        P extends Record<string, any> = any,
        Q extends Record<string, any> = any,
        B = any
    >(
        route: string | string[],
        options: Options & {
            includeRawRequest?: false;
            query: Record<string, ParamType>;
            params: Record<string, ParamType>;
        }
    ): Observable<
        RequestResponse & {
            params: P;
            query: Q;
            body: B;
        }
    >;

    /**
     * Abstracted HTTP Handler for all HTTP methods.
     * @param method The HTTP method type to register
     * @param route The HTTP method route
     * @param options Options that determine the information
     * observed by the return observable.
     */
    public put(route: string | string[], options?: Options) {
        return this._register('put', route, options);
    }
}
