import { ErrorCode } from '../error/error-codes.js';
import { FsnError } from '../error/error.js';
import { Ctor, PipeTransform, Type } from '../public-api.js';
import { reflectInjectable } from '../reflection/reflect-injectable.js';
import { Route, Router } from './router-di.js';
import {
    RouteHandlerMetadataFacade,
    RouteProviderMetadataFacade,
    RouteProviderType,
    RouterMetadataFacade
} from './router-facade-interface.js';

/**
 * Reflects `@Router` decorator metadata into the prototype of
 * classes decorated with `@Router`.
 * @param type A class decorated with `@Router`
 * @param meta Router options injected via the `@Router` decorator
 */
export const reflectRouter = (
    type: Type<RouterMetadataFacade>,
    meta?: Partial<Router>
): Type<RouterMetadataFacade> => {
    reflectInjectable(type, {
        providedIn: 'module'
    });

    // If the user has not provided a base path,
    // initialize the base path in the options to an
    // empty string, which FsnRouter will handle
    if (!meta) {
        type.prototype.basePath = '';
        return type;
    }

    // Otherwise, set the base to the given base path (or empty string,
    // which FsnRouter will handle), and set the optional guard
    type.prototype.basePath = meta.basePath ?? '';
    type.prototype.guard = meta.guard;

    return type;
};

/**
 * Reflects `@Route` decorator metadata into the prototype of
 * classes decorated with `@Router`.
 * @param routerCtor The prototype of `Class` decorated with `@Router`
 * @param handlerName Then name of `ClassMember` of `Class` decorate with `@Route`
 * @param providers Route options injected via the `@Route` decorator
 */
export const reflectRoute = (
    routerCtor: RouterMetadataFacade,
    handlerName: string,
    providers?: Route
) => {
    if (!providers) return;

    routerCtor ??= <RouterMetadataFacade>{};
    routerCtor.handlers ??= {};
    routerCtor.handlers[handlerName] ??= <RouteHandlerMetadataFacade>{};

    if (!providers?.method) {
        throw new FsnError(
            ErrorCode.INVALID_ROUTE,
            `Route handler ${handlerName} decorated with @Route must define a method type.`
        );
    }

    routerCtor.handlers[handlerName].method = providers?.method;
    routerCtor.handlers[handlerName].path = providers?.path ?? '';
    routerCtor.handlers[handlerName].guard = providers?.routerGuard;
    routerCtor.handlers[handlerName].urlParamsDef = providers?.urlParamsDef;
    routerCtor.handlers[handlerName].queryParamsDef = providers?.queryParamsDef;
    routerCtor.handlers[handlerName].providers ??= [];
};

/**
 * Reflects the metadata of provider decorators (`@Query`, `@Param`, `@Body`)
 * into the prototype of classes decorated with `@Router`.
 * @param ctor The prototype of `Class` decorated with `@Router`
 * @param handlerName Then name of `ClassMember` of `Class` decorated with
 * `@Query`, `@Param`, or `@Body`
 * @param providers Route options injected via the provider decorators
 */
export const reflectRouteArgs = (
    ctor: Ctor<RouterMetadataFacade>,
    handlerName: string,
    argType: RouteProviderType,
    argIndex: number,
    urlOrQueryParamName: string,
    optional: boolean,
    pipeTransform?: PipeTransform
) => {
    ctor.handlers ??= {};
    ctor.handlers[handlerName] ??= <RouteHandlerMetadataFacade>{};
    ctor.handlers[handlerName].providers ??= [];
    (<any[]>ctor.handlers[handlerName].providers)[argIndex] = <
        RouteProviderMetadataFacade
    >{
        argIndex: argIndex,
        urlOrQueryParamName: urlOrQueryParamName,
        type: argType,
        optional,
        pipeTransform
    };
};
