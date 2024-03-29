import { Class } from '../interface';
import { initializeModule } from './initialize-modules';
import { FsnInjectableRef } from './refs';

/** Maps providers injected in the 'root' context to their class names. */
export const rootProviders: Record<string, FsnInjectableRef> = {};

/**
 * Initializes a FusionRx application.
 * @param rootModule A class decorated with `@FsnModule()`
 *
 * @publicApi
 */
export function boostrap(rootModule: Class<any>) {
    return initializeModule(rootModule, true);
}
