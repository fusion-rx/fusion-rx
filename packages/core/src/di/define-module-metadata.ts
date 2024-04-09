import { Type } from '../interface';
import {
    CLASS_NAME,
    EXPORTS,
    IMPORTS,
    PROVIDERS,
    ROUTES
} from '../reflection/metadata-keys';
import { FsnModule } from './module';

/**
 * Defines the metadata for a ngModule in a class reference.
 * @param ngModule An object that defines the metadata for a ngModule
 * @param moduleRef A reference to the module class
 * @param overrideExisting Whether already-defined metadata params should
 * be overriden (in cases such as ModuleWithProviders) or replaced
 * with the new ngModule values.
 * @deprecated
 */
export const _defineFsnModuleMetadata = (
    ngModule: FsnModule,
    moduleRef: Type<any>
) => {
    Reflect.defineMetadata(
        CLASS_NAME,
        moduleRef?.prototype?.constructor?.name,
        moduleRef
    );
    Reflect.defineMetadata(IMPORTS, ngModule.imports ?? [], moduleRef);
    Reflect.defineMetadata(EXPORTS, ngModule.exports ?? [], moduleRef);
    Reflect.defineMetadata(PROVIDERS, ngModule.providers ?? [], moduleRef);
    Reflect.defineMetadata(ROUTES, ngModule.routes ?? [], moduleRef);

    return moduleRef;
};
