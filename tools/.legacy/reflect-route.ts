import { RouteMetadataFacade } from '../../packages/core/src/reflection/compiler-facade-interface';
import { Route } from '../di';
import { Type } from '../interface';
import { reflectInjections } from '../../packages/core/src/reflection/reflect-injections';

const reflectBaseURL = (baseUrl = '') => {
    if (baseUrl.length === 0) return baseUrl;
    baseUrl.startsWith('/') ? baseUrl : '/' + baseUrl;
    return baseUrl;
};

/**
 * Reflects `@Route` decorator metadata into the prototype of
 * classes decorated with `@Route`.
 * @param type A class decorated with `@Route`
 * @param opts Route metadata
 */
export const reflectRoute = (
    type: Type<RouteMetadataFacade>,
    opts: Route<any>
) => {
    type.prototype.token = type.prototype.constructor.name;

    reflectInjections(type);

    type.prototype.providedIn = 'module';
    type.prototype.template = opts.template ?? {};
    type.prototype.baseUrl = reflectBaseURL(opts.baseUrl);
    type.prototype.instance =
        type.prototype.dependencies.length === 0 ? new type() : undefined;
};
