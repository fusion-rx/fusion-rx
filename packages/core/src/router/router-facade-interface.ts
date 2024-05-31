import { InjectableMetadataFacade } from '../reflection/compiler-facade-interface.js';
import { PipeTransform } from './pipe-transform.js';
import { RouteGuard } from './route-guard.js';
import { HttpMethod, ParamType } from './router-types.js';

export declare type RouterMetadataFacade = InjectableMetadataFacade & {
    basePath: string;
    guard?: RouteGuard;
    handlers?: {
        [handlerName: string]: RouteHandlerMetadataFacade;
    };
};

export declare interface RouteHandlerMetadataFacade {
    /** The method that decorates a route. */
    method: HttpMethod;
    /** The route's path (defaults to an empty string.) */
    path: string;
    /** A guard specific to this route. */
    guard?: RouteGuard;
    /** This route's decorated arguments. */
    providers: RouteProviderMetadataFacade[];
    /** The definition used to parse url parameters. */
    urlParamsDef?: Record<string, ParamType>;
    /** The definition used to parse query parameters. */
    queryParamsDef?: Record<string, ParamType>;
}

export declare interface RouteProviderMetadataFacade {
    /** The index of the argument. */
    argIndex: number;
    /** The decorated type of the argument */
    type: RouteProviderType;
    /** The name of the query or url parameter */
    urlOrQueryParamName: string;
    /** The transform function for the value in the incoming HTTP request. */
    pipeTransform?: PipeTransform;
    /** Whether the url/query param or body is optional. Defaults to `true`. */
    optional: boolean;
}

export declare type RouteProviderType = 'params' | 'query' | 'body';
