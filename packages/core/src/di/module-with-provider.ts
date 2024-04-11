import { FsnModule as FsnModule } from './module';
import { Type } from '../interface';

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
