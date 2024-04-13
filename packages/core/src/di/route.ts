import { Type, RouteTemplate } from '../interface';
import { reflectRoute } from '../reflection/reflect-route';

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
