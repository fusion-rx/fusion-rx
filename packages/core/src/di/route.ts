import { Type, isType } from '../interface';
import { CLASS_NAME } from '../reflection/metadata-keys';
import { reflectRoute } from '../reflection/reflect-route';

export const BASE_ROUTE = '__base-route__';
export const TEMPLATE_URL = '__template-url__';
export const TEMPLATE = '__template__';

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
export function Route(
    opts: Route & {
        templateUrl: string;
    }
): Function;

/**
 * Injectable decorator and metadata.
 *
 * @publicApi
 */
export function Route(
    opts: Route & {
        template: string;
    }
): Function;

export function Route(opts: Route) {
    return (instance: Type<any>) => reflectRoute(instance, opts);
}

/**
 * Gets the metadata for injectables.
 * @param val A class reference
 * @returns Injectable metadata if it exists or undefined
 */
export const isRouteRef = (val: any) => {
    try {
        if (isType(val)) {
            const name: string = Reflect.getMetadata(CLASS_NAME, val);
            const baseRoute: string = Reflect.getMetadata(BASE_ROUTE, val);
            if (name && baseRoute) return true;
        }
    } catch {}

    return false;
};
