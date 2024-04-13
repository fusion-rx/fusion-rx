import { Provider, Register } from '../di';
import { Ctor } from '../interface';
import { RouteMetadataFacade } from './compiler-facade-interface';

/**
 * Reflects the metadata of a function decorated with `@Register`
 * into the prototype of its parent class decorated with `@Route`.
 * @param type A class decorated with `@Route`
 * @param handler The name of a function within `type` decorated with `@Register`
 * @param routeDetails Registration metadata for a fusion route
 */
export const reflectRouteRegistration = (
    type: Ctor<RouteMetadataFacade>,
    handler: string,
    routeDetails: Register & Partial<Provider>
) => {
    type.registered ??= {};
    type.registered[handler] = {
        path: Array.isArray(routeDetails.path)
            ? routeDetails.path.join('/')
            : routeDetails.path.startsWith('/')
              ? routeDetails.path.substring(1)
              : routeDetails.path,
        method: routeDetails.method,
        provide: routeDetails.provide ?? [],
        urlParamsDef: routeDetails.paramsDef,
        queryParamsDef: routeDetails.queryDef
    };
};
