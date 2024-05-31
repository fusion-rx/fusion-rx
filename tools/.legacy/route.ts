import { Type, RouteTemplate } from '../../packages/core/src/interface/type.js';
import { reflectRoute } from '../../packages/core/src/reflection/reflect-route.js';

export interface Route<T extends Type<any>> {
    baseUrl?: string;
    template?: RouteTemplate<T>;
}

/**
 * Injectable decorator and metadata.
 *
 * @publicApi
 */
export function Route<T extends Type<any>>(opts: Route<T>) {
    return (instance: T) => reflectRoute(instance, opts);
}
