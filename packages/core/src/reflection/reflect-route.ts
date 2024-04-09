import { Route } from '../di';
import { Type } from '../interface';
import { ReflectedRoute } from './compiler-facade-interface';
import { reflectInjections } from './reflect-injections';

export const reflectRoute = (type: Type<ReflectedRoute>, opts?: Route) => {
    type.prototype.token = type.prototype.constructor.name;

    reflectInjections(type);

    type.prototype.instance =
        type.prototype.deps.length === 0 ? new type() : undefined;
    type.prototype.providedIn = 'module';
    type.prototype.baseUrl = opts?.baseUrl;
    type.prototype.template = opts?.template;
    type.prototype.templateUrl = opts?.templateUrl;
};
