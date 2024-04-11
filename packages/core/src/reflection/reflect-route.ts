import { RouteMetadataFacade } from './compiler-facade-interface';
import { Route } from '../di';
import { Type } from '../interface';
import { reflectInjections } from './reflect-injections';

/**
 * Reflects `@Route` decorator metadata into the prototype of
 * classes decorated with `@Route`.
 * @param type A class decorated with `@Route`
 * @param opts Route metadata
 */
export const reflectRoute = (type: Type<RouteMetadataFacade>, opts?: Route) => {
    type.prototype.token = type.prototype.constructor.name;

    reflectInjections(type);

    type.prototype.instance =
        type.prototype.dependencies.length === 0 ? new type() : undefined;
    type.prototype.providedIn = 'module';
    type.prototype.baseUrl = opts?.baseUrl;
    type.prototype.template = opts?.template;
    type.prototype.templateUrl = opts?.templateUrl;
};
