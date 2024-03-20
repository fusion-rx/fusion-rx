import { getMetadata } from '@fusion-rx/shared';

import { FsnModuleRef } from './refs';
import {
    ModuleWithProviders,
    defineFsnModuleMetadata,
    CLASS_NAME,
    PROVIDERS,
    FactoryProvider,
    ROUTES
} from '../di';
import { isModuleWithProviders } from '../di/module-with-provider';
import { Class } from '../interface';
import { afterAppInit, onModuleInit } from './lifecycle';
import { registerExports } from './register-exports';
import { registerProviders } from './register-providers';
import { registerImports } from './register-imports';
import { ProviderInitializer } from './initialize-providers';
import { initRoute } from './init-routes';

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

    // Create provider references for all of this module's providers
    const providerRefs = registerProviders(
        getMetadata<(Class<any> | FactoryProvider)[]>(PROVIDERS, moduleRef, [])
    );

    // Create route references for all of this module's route
    const routeRefs = registerProviders(
        getMetadata<Class<any>[]>(ROUTES, moduleRef, [])
    );

    // Providers and routes must be initialized together, since
    // routes can import providers
    const injectableRefs = {
        ...providerRefs,
        ...routeRefs
    };

    // Initialize the providers from their references
    const providers = new ProviderInitializer(
        injectableRefs,
        imports,
        moduleName
    ).init();

    // Register the providers that this module exports
    const exports = registerExports(moduleRef, moduleName, providers);

    // Call onModuleInit for providers in this module that implement
    // the lifecycle hook
    onModuleInit(providers);

    // Separate routes from providers
    Object.keys(routeRefs)
        .map((routeName) => {
            const provider = providers[routeName];
            delete providers[routeName];
            return provider;
        })
        .forEach((routeRef) => {
            // And initialize the routes
            initRoute(routeRef);
        });

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
