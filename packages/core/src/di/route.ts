import { getInjectedDependencies } from '@fusion-rx/shared';

import { Class, isClass } from '../interface';
import { INJECTED_DEPS, PROVIDED_IN } from './injectable';
import { CLASS_NAME } from './module';

export const BASE_ROUTE = '__base-route__';
export const TEMPLATE_URL = '__template-url__';
export const TEMPLATE = '__template__';

interface Route {
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
    return (instance: Class<any>) => {
        Reflect.defineMetadata(
            CLASS_NAME,
            instance?.prototype?.constructor?.name,
            instance
        );
        Reflect.defineMetadata(
            INJECTED_DEPS,
            getInjectedDependencies(instance),
            instance
        );

        Reflect.defineMetadata(BASE_ROUTE, opts?.baseUrl ?? '', instance);
        Reflect.defineMetadata(PROVIDED_IN, 'module', instance);

        if (opts?.templateUrl)
            Reflect.defineMetadata(TEMPLATE_URL, opts.templateUrl, instance);
        if (opts?.template)
            Reflect.defineMetadata(TEMPLATE, opts.template, instance);
    };
}

/**
 * Gets the metadata for injectables.
 * @param val A class reference
 * @returns Injectable metadata if it exists or undefined
 */
export const isRouteRef = (val: any) => {
    try {
        if (isClass(val)) {
            const name: string = Reflect.getMetadata(CLASS_NAME, val);
            const baseRoute: string = Reflect.getMetadata(BASE_ROUTE, val);
            if (name && baseRoute) return true;
        }
    } catch {}

    return false;
};
