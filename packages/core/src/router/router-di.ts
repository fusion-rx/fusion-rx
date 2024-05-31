import { Ctor } from '../public-api.js';
import {
    reflectRoute,
    reflectRouteArgs,
    reflectRouter
} from './route-reflection.js';
import { PipeTransform } from './pipe-transform.js';
import { HttpMethod, ParamType } from './router-types.js';
import { FsnError } from '../error/error.js';
import { ErrorCode } from '../error/error-codes.js';
import { ParameterDecorator } from '../di/types.js';
import { RouteGuard } from './route-guard.js';

/** Defines the metadata for a Router. */
export declare type Router = {
    basePath: string;
    guard?: RouteGuard;
    providers?: Record<string, any[]>;
};

/**
 * Registers a Fusion router.
 * @param providers Defines the options for a router
 */
export function Router(options?: Partial<Router>) {
    return (type: any) => {
        reflectRouter(type, options);
    };
}

/** Defines the metadata for a route. */
export declare type Route = {
    method: HttpMethod;
    path?: string;
    routerGuard?: RouteGuard;
    urlParamsDef?: Record<string, ParamType>;
    queryParamsDef?: Record<string, ParamType>;
};

/**
 * Registers a Fusion route method.
 * @param providers Defines the options for a route
 */
export function Route(
    providers:
        | (Partial<Route> & {
              method: HttpMethod;
          })
        | HttpMethod
) {
    return (target: Ctor<any>, propertyKey: string) => {
        reflectRoute(
            target,
            propertyKey,
            typeof providers === 'string'
                ? <Route>{
                      method: providers
                  }
                : providers
        );
    };
}

const handleArgs = (providerIndex: number, args?: any[]) => {
    let name: string | undefined;
    let pipeTransform: PipeTransform | undefined;
    let optional = true;

    args?.forEach((arg) => {
        switch (typeof arg) {
            case 'string':
                return (name = arg);
            case 'boolean':
                return (optional = arg);
            default:
                return (pipeTransform = arg);
        }
    });

    if (!name) {
        throw new FsnError(
            ErrorCode.UNRESOLVED_PARAMETER_NAME,
            `Expected named parameter at index ${providerIndex} of route ${name}`
        );
    }

    return {
        name,
        pipeTransform,
        optional
    };
};

/**
 * Provides url parameter(s) of incoming http requests to classmembers
 * of classes decorated with `@Router` that are decorated with `@Route`.
 * If no arguments are passed to this decorator, all url parameters are
 * provided as an object.
 * @param paramName The name of an expected url parameter
 * @param pipeTransform A function that transforms the url parameter value
 * @param optional Whether the parameter is optional; defaults to `true`.
 * If `false` is passed, rejects the request with a `BadRequest` status code.
 *
 * @publicApi
 */
export function Param(
    paramName?: string,
    pipeTransform?: PipeTransform,
    optional?: boolean
): ParameterDecorator;

/**
 * Provides url parameter(s) of incoming http requests to classmembers
 * of classes decorated with `@Router` that are decorated with `@Route`.
 * If no arguments are passed to this decorator, all url parameters are
 * provided as an object.
 * @param paramName The name of the expected url parameter
 * @param optional Whether the parameter is optional; defaults to `true`.
 * If `false` is passed, rejects the request with a `BadRequest` status code.
 *
 * @publicApi
 */
export function Param(
    paramName: string,
    optional?: boolean
): ParameterDecorator;

export function Param(...args: any[]): ParameterDecorator {
    return (ctor, handlerName, providerIndex) => {
        const { name, pipeTransform, optional } = handleArgs(
            providerIndex,
            args
        );

        return reflectRouteArgs(
            ctor,
            handlerName,
            'params',
            providerIndex,
            name,
            optional ?? true,
            pipeTransform
        );
    };
}

/**
 * Provides query parameter(s) of incoming http requests to classmembers
 * of classes decorated with `@Router` that are decorated with `@Route`.
 * If no arguments are passed to this decorator, all query parameters are
 * provided as an object.
 * @param paramName The name of an expected URL parameter
 * @param pipeTransform A function that transforms the URL parameter value
 * @param optional Whether the parameter is optional; defaults to `true`.
 * If `false` is passed, rejects the request with a `BadRequest` status code.
 *
 * @publicApi
 */
export function Query(
    queryName?: string,
    pipeTransform?: PipeTransform,
    optional?: boolean
): ParameterDecorator;

/**
 * Provides query parameter(s) of incoming http requests to classmembers
 * of classes decorated with `@Router` that are decorated with `@Route`.
 * If no arguments are passed to this decorator, all query parameters are
 * provided as an object.
 * @param paramName The name of the expected query parameter
 * @param optional Whether the parameter is optional; defaults to `true`.
 * If `false` is passed, rejects the request with a `BadRequest` status code.
 *
 * @publicApi
 */
export function Query(
    queryName: string,
    optional?: boolean
): ParameterDecorator;

export function Query(...args: any[]): ParameterDecorator {
    return (ctor, handlerName, providerIndex) => {
        const { name, pipeTransform, optional } = handleArgs(
            providerIndex,
            args
        );

        return reflectRouteArgs(
            ctor,
            handlerName,
            'query',
            providerIndex,
            name,
            optional ?? true,
            pipeTransform
        );
    };
}

/**
 * Provides the body of an incoming http request to classmembers of
 * classes decorated with `@Router` that are decorated with `@Route`.
 * @param optional Whether the body is optional; defaults to `false`.
 *
 * @publicApi
 */
export function Body(optional?: boolean): ParameterDecorator {
    return (ctor, className, providerIndex) => {
        return reflectRouteArgs(
            ctor,
            className,
            'body',
            providerIndex,
            'body',
            optional ?? false
        );
    };
}
