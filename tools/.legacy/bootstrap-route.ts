import { Logger, isFunction } from '@fusion-rx/shared';
import { catchError, isObservable, of } from 'rxjs';
import { isNativeError, isPromise } from 'util/types';

import { FsnAppError, isFsnAppError } from '../interface/error';
import { HttpStatusCode } from '../interface/status-code';
import { fusionServer } from './bootstrap';
import { Req, Res } from '../interface/express';
import { RouteMetadataFacade } from '../reflection/compiler-facade-interface';
import { RouteParamType, RouteParamsDef, RouteProvider } from '../di';
import { Type } from '../interface';

const routeLogger = new Logger('FusionRouter');

/**
 * Parses a value in a url or query parameters object.
 * @param type The expected type of a url or query parameter
 * @param value A value from url or query parameters
 * @returns The url or query params value parsed by `type`
 */
const parseReqParam = (type: RouteParamType, value: string) => {
    if (value === null || value === undefined) return undefined;
    switch (type) {
        case 'string[]':
            return value.split(',');
        case 'number[]':
            return value.split(',').map((val) => Number.parseInt(val));
        case 'boolean[]':
            return value.split(',').map((val) => val === 'true');
        case 'number':
            return Number.parseInt(value);
        case 'boolean':
            return value === 'true';
        default:
            return value;
    }
};

/**
 * Parses query and url parameters from incoming requests.
 * @param received The parameters of an incoming request
 * @param expected The expected type of the parameters
 * @returns A parameters object parsed by `expected` or an unparsed
 * parameters object if `expected` is not provided
 * @throws Will throw an error if a required parameter is not resolved
 */
export const parseReqParams = (received: any, expected?: RouteParamsDef) => {
    if (!expected) return received;

    const parsed: Record<string, any> = {};

    Object.keys(expected).forEach((paramKey) => {
        const expectedParam = expected[paramKey];
        const type =
            typeof expectedParam === 'object'
                ? expectedParam.type
                : expectedParam;
        const optional =
            typeof expectedParam === 'object' ? expectedParam.optional : false;
        const receivedParam = received[paramKey];

        if (type && receivedParam) {
            // We know the expected type and the parameter was found
            parsed[paramKey] = parseReqParam(type, receivedParam);
        } else if (receivedParam) {
            // We don't know the expected type but the parameter was found
            parsed[paramKey] = receivedParam;
        } else if (!optional) {
            // Throw an error for unresolved non-optional parameters
            throw new FsnAppError(
                `Expected paramter ${paramKey} of type ${type} but received undefined. ` +
                    `If this parameter is supposed to be optional, ` +
                    `please mark it as optional in the route def.`,
                HttpStatusCode.BadRequest
            );
        }
    });

    return parsed;
};

/**
 * Constructs an array of route providers from `provide`.
 * @param provide An array of express elements to provide to a handler
 * @param req An express request object
 * @param res An express response object
 * @returns An array of resolved route providers or an empty array
 */
const constructHandlerArgs = (
    provide: RouteProvider[],
    req: Req,
    res: Res,
    urlQueryDef?: RouteParamsDef,
    queryParamDef?: RouteParamsDef
) => {
    return provide.map((provider) => {
        switch (provider) {
            case 'body':
                return req.body;
            case 'headers':
                return req.headers;
            case 'params':
                return parseReqParams(req.params, urlQueryDef);
            case 'query':
                return parseReqParams(req.query, queryParamDef);
            case 'rawHeaders':
                return req.rawHeaders;
            case 'req':
            case 'request':
                return req;
            case 'res':
            case 'response':
                return res;
        }
    });
};

/**
 * Handles errors thrown by handlers
 * @param err An error object
 * @param res An express response object
 */
const handleError = (err: any, res: Res) => {
    // TODO - should we implement logging here?

    if (isFsnAppError(err)) {
        res.status(err.statusCode).send({
            name: err.name,
            status: err.statusCode,
            message: err.message
        });
    } else if (isNativeError(err)) {
        res.status(HttpStatusCode.InternalServerError).send({
            name: err.name,
            status: HttpStatusCode.InternalServerError,
            message: err.message
        });
    } else {
        res.status(HttpStatusCode.InternalServerError).send({
            name: 'Internal Server Error',
            status: HttpStatusCode.InternalServerError,
            messagE: 'An unknown error ocurred.'
        });
    }
};

/**
 * Responds to a request with the return value of a handler.
 * @param val A value returned by a synchronous, asynchronous,
 * or observable handler.
 * @param res An express response object
 */
const handleResponse = (val: any, res: Res) => {
    if (val === undefined || val === null) {
        res.status(HttpStatusCode.NotFound).send(
            new FsnAppError(
                'Failed to locate resource',
                HttpStatusCode.NotFound
            )
        );
    }
    // TODO - confirm that 'val' is sendable
    res.send(val);
};

/**
 * Handles incoming express app requests.
 * @param provide The arguments required by `handler`
 * @param req An express request object
 * @param res An express response object
 * @param handler A request handler
 */
// @ts-ignore
const handleRequest = (
    provide: RouteProvider[],
    handler: Function,
    req: Req,
    res: Res,
    urlParamDef?: RouteParamsDef,
    queryParamDef?: RouteParamsDef
) => {
    try {
        const args = constructHandlerArgs(
            provide,
            req,
            res,
            urlParamDef,
            queryParamDef
        );

        const response = handler(...args);
        let handled = false;

        if (isObservable(response)) {
            // TODO - implement some sort of scanning here
            // TODO - catch no elements in sequence error
            response.subscribe({
                next: (next) => {
                    handled = true;
                    handleResponse(next, res);
                },
                error: (err) => handleError(err, res),
                complete: () => {
                    if (!handled) handleResponse(null, res);
                }
            });
        } else if (isPromise(response)) {
            response
                .then((next) => handleResponse(next, res))
                .catch((reason) => handleError(reason, res));
        } else {
            handleResponse(response, res);
        }
    } catch (e) {
        handleError(e, res);
    }
};

/**
 * Handles cases in observables where it is valid for no data to be returned,
 * but RxJS throws a 'no elements in sequence' error.
 * @param err An error caught in `catchError`
 * @returns An empty array if the error message is 'no elements in sequence';
 * otherwise, throws the error.
 *
 * @publicApi
 */
const handleNoElementsInSequence = (err: any) => {
    if (isNativeError(err)) {
        if (err.message === 'no elements in sequence') {
            return of([] as any[]);
        }
    }

    throw err;
};

let hasLoggedFsnError = false;

export const bootstrapRoute = (type: Type<RouteMetadataFacade>) => {
    // TODO - handle these errors
    if (!type.prototype.instance) return;
    if (!type.prototype.template) return;

    if (!fusionServer && !hasLoggedFsnError) {
        routeLogger.error(
            'FusionServer is not initialized. Cannot register routes.'
        );
        hasLoggedFsnError = true;
        return;
    }

    const formatRoute = (route: string) => {
        return type.prototype.baseUrl + '/' + route;
    };

    Object.keys(type.prototype.registered ?? {}).forEach((handlerName) => {
        const routeMetadata = type.prototype.registered[handlerName];

        if (
            type.prototype.instance[handlerName] &&
            isFunction(type.prototype.instance[handlerName])
        ) {
            const route = formatRoute(routeMetadata.path);
            routeLogger.log(
                `Mapped ${routeMetadata.method.toUpperCase()} => ${route}`
            );
            fusionServer.expressApp[routeMetadata.method](
                route,
                (req: Req, res: Res) => {
                    try {
                        const args = constructHandlerArgs(
                            routeMetadata.provide,
                            req,
                            res,
                            routeMetadata.urlParamsDef,
                            routeMetadata.queryParamsDef
                        );

                        const response = type.prototype.instance[handlerName](
                            ...args
                        );

                        if (isObservable(response)) {
                            // TODO - implement some sort of scanning here
                            // TODO - catch no elements in sequence error
                            response
                                .pipe(
                                    catchError((err) =>
                                        handleNoElementsInSequence(err)
                                    )
                                )
                                .subscribe({
                                    next: (next) => handleResponse(next, res),
                                    error: (err) => handleError(err, res)
                                });
                        } else if (isPromise(response)) {
                            response
                                .then((next) => handleResponse(next, res))
                                .catch((reason) => handleError(reason, res));
                        } else {
                            handleResponse(response, res);
                        }
                    } catch (e) {
                        handleError(e, res);
                    }
                }
            );
        }
    });
};
