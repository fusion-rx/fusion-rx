import { Type } from '../../interface';
import { initializeModule } from './initialize-modules';
import { FsnInjectableRef } from './refs';

/** Maps providers injected in the 'root' context to their class names. */
export const rootProviders_v1: Record<string, FsnInjectableRef> = {};

/**
 * Initializes a FusionRx application.
 * @param rootModule A class decorated with `@FsnModule()`
 *
 * @publicApi
 */
export function boostrap_v1(rootModule: Type<any>) {
    return initializeModule(rootModule, true);
}
