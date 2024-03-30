import { Class } from '../interface';
import { FsnModule as FsnModule } from './module';

export interface ModuleWithProviders<T = Class<any>> extends FsnModule {
    ngModule: T;
}

export const isModuleWithProviders = (
    val: any
): val is ModuleWithProviders<any> => {
    return (
        val !== null &&
        val !== undefined &&
        typeof val === 'object' &&
        'ngModule' in val
    );
};
