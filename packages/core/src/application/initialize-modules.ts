import { FsnModuleRef } from './refs';
import {
    ModuleWithProviders,
    defineFsnModuleMetadata,
    CLASS_NAME,
    PROVIDERS,
    FactoryProvider
} from '../di';
import { isModuleWithProviders } from '../di/module-with-provider';
import { Class } from '../interface';
import { afterAppInit, onModuleInit } from './lifecycle';
import { registerExports } from './register-exports';
import { registerProviders } from './register-providers';
import { registerImports } from './register-imports';
import { getMetadata } from '../reflect';
import { ProviderInitializer } from './initialize-providers';

export function initializeModule(
    moduleRef: Class<any> | ModuleWithProviders<any>,
    isRootModule = false
): FsnModuleRef {
    // If this is a `ModuleWithProviders`, we need to initialize
    // the dynamic metadata for the module class reference
    if (isModuleWithProviders(moduleRef)) {
        moduleRef = defineFsnModuleMetadata(moduleRef, moduleRef.ngModule);
    }

    // Get the class name of this module
    const moduleName = Reflect.getMetadata(CLASS_NAME, moduleRef);

    // If the module's name is not defined in its metadata,
    // then this is an invalid module
    if (moduleName === undefined) {
        throw new Error(
            `Unable to determine module name from module ${moduleRef}.`
        );
    }

    // Recursively initialize all imported modules
    const imports = registerImports(moduleRef);

    const providerMetadata = getMetadata<(Class<any> | FactoryProvider)[]>(
        PROVIDERS,
        moduleRef,
        []
    );

    // Create provider references for all of this module's providers
    const providerRefs = registerProviders(providerMetadata);

    // Initialize the providers from their references
    const providers = new ProviderInitializer(
        providerRefs,
        imports,
        moduleName
    ).init();

    // Register the providers that this module exports
    const exports = registerExports(moduleRef, moduleName, providers);

    // Call onModuleInit for providers in this module that implement
    // the lifecycle hook
    onModuleInit(providers);

    // Create this modules reference object for return
    const fsnModule = {
        moduleName,
        exports,
        imports,
        providers
    };

    // If this is the root module, all modules, providers, and submodules
    // have been initialized, so we can call the `afterAppInit` lifecycle hook
    if (isRootModule) afterAppInit(fsnModule);

    return fsnModule;
}
