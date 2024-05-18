import { FsnModule } from './module.js';
import { Type } from '../interface/type.js';

/**
 * Provides Fusion applications with the ability to
 * implement dynamic modules.
 *
 * @publicApi
 */
export interface ModuleWithProviders<T = Type<any>> extends Partial<FsnModule> {
    fsnModule: T;
}

export const isModuleWithProviders = (
    val: any
): val is ModuleWithProviders<any> => {
    return (
        val !== null &&
        val !== undefined &&
        typeof val === 'object' &&
        'fsnModule' in val
    );
};
