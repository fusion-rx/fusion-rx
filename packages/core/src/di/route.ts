import { Class, isClass } from '../interface';
import { getInjectedDependencies } from '../reflect';
import { INJECTED_DEPS, PROVIDED_IN } from './injectable';
import { CLASS_NAME } from './module';

export const BASE_ROUTE = '__base-route__';

interface Route {
    baseRoute?: string;
}

/**
 * Injectable decorator and metadata.
 *
 * @publicApi
 */
export const Route = (opts?: Route) => (instance: Class<any>) => {
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
    Reflect.defineMetadata(BASE_ROUTE, opts?.baseRoute ?? '', instance);
    Reflect.defineMetadata(PROVIDED_IN, 'module', instance);
};

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
