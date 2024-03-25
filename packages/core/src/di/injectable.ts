import { getInjectedDependencies } from '@fusion-rx/shared';

import { Class, isClass } from '../interface';
import { CLASS_NAME } from './module';

export const PROVIDED_IN = '__ng-injectable-provided-in__';
export const INJECTED_DEPS = '__ng-injected-deps__';

interface Injectable {
    providedIn: 'root' | 'module' | null;
}

/**
 * Injectable decorator and metadata.
 *
 * @publicApi
 */
export const Injectable = (opts?: Injectable) => (instance: Class<any>) => {
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
    Reflect.defineMetadata(PROVIDED_IN, opts?.providedIn ?? 'module', instance);
};

/**
 * Gets the metadata for injectables.
 * @param val A class reference
 * @returns Injectable metadata if it exists or undefined
 */
export const isInjectableRef = (val: any) => {
    try {
        if (isClass(val)) {
            const name: string = Reflect.getMetadata(CLASS_NAME, val);
            const providedIn: 'module' | 'root' =
                Reflect.getMetadata(PROVIDED_IN, val) ?? 'module';
            if (name && providedIn) return true;
        }
    } catch {}

    return false;
};
