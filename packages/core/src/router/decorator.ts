import { take } from 'rxjs';
import { afterAppInit } from '../public-api.js';
import { RouteGuard } from './router.js';
import { ParamType } from './types.js';

/** Defines the metadata for a route. */
export declare type Route = {
    path?: string;
    urlParams?: Record<string, ParamType>;
    queryParams?: Record<string, ParamType>;
};

/** Defines the descriptor for the route method decorator. */
export declare type Descriptor = {
    value: Function;
    writable: boolean;
    enumerable: boolean;
    configurable: boolean;
};

/** Defines the metadata from the route method decorator. */
export declare type RouteFn = {
    target: Function;
    propertyKey: string;
    descriptor: Descriptor;
    providers?: Route;
};

/**
 * Metadata for functions decorated with `@Route()`.
 */
const routeFns: RouteFn[] = [];

/**
 * Registers a Fusion route method.
 * @param providers Defines the options for a route
 */
export function Route(providers?: Route) {
    return (target: any, propertyKey: string, descriptor: any) => {
        routeFns.push({
            target,
            propertyKey,
            descriptor,
            providers
        });
    };
}

// After the application is initialized, register
// all the decorated route methods.
afterAppInit.pipe(take(1)).subscribe(() => {
    routeFns.forEach((routeFn) => {
        (<any>routeFn.target).instance[
            <keyof typeof routeFn.target>routeFn.propertyKey
        ]();
    });
});

export function FsnRouter(options: { basePath?: string; guard?: RouteGuard }) {
    return (type: any) => {
        console.log(options, type);
    };
}
