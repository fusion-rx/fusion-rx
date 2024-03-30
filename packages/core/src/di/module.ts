import { Class } from '../interface/class';
import { FactoryProvider } from './inject';
import { ModuleWithProviders } from './module-with-provider';

export const CLASS_NAME = '__fsn-class-name__';
export const IMPORTS = '__fsn-module-imports__';
export const EXPORTS = '__fsn-module-exports__';
export const PROVIDERS = '__fsn-module-providers__';
export const ROUTES = '__fsn-routes__';

export declare interface FsnModule {
    providers?: Array<Class<any> | FactoryProvider> | undefined;
    exports?: Array<Class<any> | FactoryProvider> | undefined;
    imports?: Array<Class<any> | ModuleWithProviders<any>> | undefined;
    routes?: Array<Class<any>> | undefined;
}

/**
 * Module decorator and metadata.
 *
 * @publicApi
 */
export const FsnModule = (ngModule: FsnModule) => {
    return function (moduleRef: Class<any>) {
        Reflect.defineMetadata(
            CLASS_NAME,
            moduleRef?.prototype?.constructor?.name,
            moduleRef
        );
        Reflect.defineMetadata(IMPORTS, ngModule.imports ?? [], moduleRef);
        Reflect.defineMetadata(EXPORTS, ngModule.exports ?? [], moduleRef);
        Reflect.defineMetadata(PROVIDERS, ngModule.providers ?? [], moduleRef);
        Reflect.defineMetadata(ROUTES, ngModule.routes ?? [], moduleRef);
    };
};

/**
 * Defines the metadata for a ngModule in a class reference.
 * @param ngMdoule An object that defines the metadata for a ngModule
 * @param moduleRef A reference to the module class
 * @param overrideExisting Whether already-defined metadata params should
 * be overriden (in cases such as ModuleWithProviders) or replaced
 * with the new ngModule values.
 */
export const defineFsnModuleMetadata = (
    ngMdoule: FsnModule,
    moduleRef: Class<any>
) => {
    Reflect.defineMetadata(
        CLASS_NAME,
        moduleRef?.prototype?.constructor?.name,
        moduleRef
    );
    Reflect.defineMetadata(IMPORTS, ngMdoule.imports ?? [], moduleRef);
    Reflect.defineMetadata(EXPORTS, ngMdoule.exports ?? [], moduleRef);
    Reflect.defineMetadata(PROVIDERS, ngMdoule.providers ?? [], moduleRef);
    Reflect.defineMetadata(ROUTES, ngMdoule.routes ?? [], moduleRef);

    return moduleRef;
};
