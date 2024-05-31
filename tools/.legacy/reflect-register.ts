import { Provider, Register } from '../../packages/core/src/di/public-api.js';
import { Ctor } from '../interface';
import { RouteMetadataFacade } from '../../packages/core/src/reflection/compiler-facade-interface.js';

const reflectRoutePath = (path: string | string[]) => {
    if (Array.isArray(path)) return path.join('/');
    if (path.startsWith('/')) return path.substring(1);
    return path;
};

/**
 * Reflects the metadata of a function decorated with `@Register`
 * into the prototype of its parent class decorated with `@Route`.
 * @param type A class decorated with `@Route`
 * @param handler The name of a function within `type` decorated with `@Register`
 * @param routeDetails Registration metadata for a fusion route
 */
export const reflectRegister = (
    type: Ctor<RouteMetadataFacade>,
    handler: string,
    routeDetails: Register & Partial<Provider>
) => {
    type.registered ??= {};
    type.registered[handler] = {
        path: reflectRoutePath(routeDetails.path),
        method: routeDetails.method,
        provide: routeDetails.provide ?? [],
        urlParamsDef: routeDetails.paramsDef,
        queryParamsDef: routeDetails.queryDef
    };
};
