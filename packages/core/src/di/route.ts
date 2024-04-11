import { Type } from '../interface';
import { reflectRoute } from '../reflection/reflect-route';

export interface Route {
    baseUrl?: string;
    templateUrl?: string;
    template?: string;
}

/**
 * Injectable decorator and metadata.
 *
 * @publicApi
 */
export function Route(opts?: Route): Function;

/**
 * Injectable decorator and metadata.
 *
 * @publicApi
 */
export function Route(
    opts: Route & {
        templateUrl: string;
    }
): Function;

/**
 * Route decorator and metadata.
 *
 * @publicApi
 */
export function Route(
    opts: Route & {
        template: string;
    }
): Function;

export function Route(opts?: Route) {
    return (instance: Type<any>) => reflectRoute(instance, opts);
}
