import {
    IMPORTS,
    EXPORTS,
    INJECTED_DEPS,
    PROVIDED_IN,
    CLASS_NAME,
    PROVIDERS,
    defineFsnModuleMetadata
} from '../di';
import { implementsAfterAppInit, implementsOnModuleInit } from './lifecycle';
import { Class, isClass } from '../interface';

import 'reflect-metadata';
import { FactoryProvider, INJECT, isFactoryProvider } from '../di/inject';
import { getInjectedDependencies } from '../reflect';
import {
    ModuleWithProviders,
    isModuleWithProviders
} from '../di/module-with-provider';

const isNativeError = (e: any): e is Error =>
    e !== undefined &&
    e !== null &&
    typeof e === 'object' &&
    'message' in e &&
    'name' in e;

export declare type FsnModuleRef = {
    moduleName: string;
    exports: Record<string, any>;
    imports: Record<string, FsnModuleRef>;
    providers: Record<string, FsnProvidereRef>;
};

export declare type FsnProvidereRef = {
    providerName: string;
    providedIn: 'root' | 'module';
    injected: string[];
    reference: Class<any> | FactoryProvider;
    instance?: any;
};

/** Maps providers injected in the 'root' context to their class names. */
const rootProviders: Record<string, FsnProvidereRef> = {};

function initializeModule(
    moduleRef: Class<any> | ModuleWithProviders<any>,
    isRootModule = false
): FsnModuleRef {
    // If this is a ModuleWithProviders object, we need to initialize
    // the metadata for the module class reference
    if (isModuleWithProviders(moduleRef)) {
        // Define the dynamic metadata for the module class ref
        moduleRef = defineFsnModuleMetadata(moduleRef, moduleRef.ngModule);
    }

    /** The class name of the module being initialized. */
    const moduleName = Reflect.getMetadata(CLASS_NAME, moduleRef);

    if (!moduleName)
        throw new Error('Invalid module detected: ' + moduleRef + '.');

    /** Modules imported into this module. */
    const imports: Record<string, FsnModuleRef> = {};

    // Register all imported modules so we can build a dependency tree
    Reflect.getMetadata(IMPORTS, moduleRef)?.forEach((imported: Class<any>) => {
        // Register the imported module
        const registered = initializeModule(imported);
        imports[registered.moduleName] = registered;
    });

    /** Providers declared in this module. */
    const localProviders: Record<string, FsnProvidereRef> = {};

    /**
     * Registers a local provider.
     * @param ref An injected class or Factory Provider
     */
    const registerLocalProvider = (ref: Class<any> | FactoryProvider) => {
        if (!isFactoryProvider(ref)) {
            const providerName = Reflect.getMetadata(CLASS_NAME, ref);
            const providedIn = Reflect.getMetadata(PROVIDED_IN, ref);
            const injected = Reflect.getMetadata(INJECTED_DEPS, ref);

            // If this provider doesn't have any injected dependencies, initialize it
            const instance = injected?.length === 0 ? new ref() : undefined;

            localProviders[providerName] = {
                providerName,
                providedIn,
                injected,
                reference: ref,
                instance
            };
        } else {
            const provider: FsnProvidereRef = {
                providerName: ref.provide,
                injected: [],
                providedIn: 'module',
                reference: ref
            };

            if (ref.useValue !== undefined) {
                provider.instance = ref.useValue;
            } else if (ref.useFactory) {
                const args = (ref.deps ?? []).map((arg) => {
                    // TODO - all injected classes should be decorated with @Injectable
                    if (isClass(arg)) {
                        const argParams = getInjectedDependencies(arg);

                        if (Object.keys(argParams).length === 0) {
                            return new arg();
                        } else {
                            // Todo - do we need to figure out params here?
                            // What if arg is an injectable?
                            return arg;
                        }
                    }

                    return arg;
                });

                provider.instance = ref.useFactory(...args);
            }

            localProviders[ref.provide] = provider;
        }
    };

    // Register all local providers -- i.e. providers native to this module
    Reflect.getMetadata(PROVIDERS, moduleRef)?.forEach(
        (ref: Class<any> | FactoryProvider) => registerLocalProvider(ref)
    );

    /**
     * Initializes a provider.
     * @param provider A reference to a provider
     * @returns The provider reference with an `instance`
     * @throws Will throw a meaningful error if the provider cannot be initialized
     */
    const initProvider = (provider: FsnProvidereRef): FsnProvidereRef => {
        // If it is a factory provider, it has already been initialized.
        // TODO - what if the factory provider is an injectable that has dependencies?
        if (isFactoryProvider(provider.reference)) {
            return provider;
        }

        // If `instance` exists, this provider has already been initialized
        if (provider.instance) return provider;

        // If the provider is not initialized and has no injected dependencies,
        // initialize it. This should already have been done when the provider
        // was registered, but check here to be safe.
        if (provider.injected.length === 0) {
            provider.instance = new provider.reference();
            return provider;
        }

        // Get providers injected into the constructor with `@Inject()`
        const factoryProviderVals =
            Reflect.getMetadata(INJECT, provider.reference) ?? [];
        console.log(factoryProviderVals);

        // Iterate over the provider's injected dependencies and attempt to
        // inject them from the local module or the exports of an imported module.
        const args = provider.injected.map((providerName, index) => {
            // If a factory provider was injected with `@Inject()`,
            // its instance should already be initialized
            if (factoryProviderVals[index]) {
                return localProviders[factoryProviderVals[index]].instance;
            }

            // This provider was declared in the `root` context
            if (rootProviders[providerName]) {
                return rootProviders[providerName];
            }

            // This provider is declared locally
            if (localProviders[providerName]) {
                // Since `instance` exists, the provider has already been initialized
                if (localProviders[providerName].instance) {
                    return localProviders[providerName].instance;
                } else {
                    // The injected provider has not been initialized.
                    // We don't need to handle errors, because if the provider
                    // cannot be initialized, `initProvider` will throw a useful error.
                    localProviders[providerName] = initProvider(
                        localProviders[providerName]
                    );

                    return localProviders[providerName].instance;
                }
            }

            // Otherwise, the provider must be exported from an imported module
            const moduleRef = Object.values(imports).find(
                (moduleRef) => moduleRef.exports[providerName]
            );

            // Confirm that the imported module is not undefined
            if (moduleRef) {
                // Double-check that the injected provider has been exported
                // from the imported module before returning its instance
                if (moduleRef.exports[providerName]) {
                    return moduleRef.exports[providerName];
                }

                // If it's not exported from the imported module, then
                // it was never initialized. Since each module has to initialize
                // its own providers, then we have to throw an error.
                throw new Error(
                    `Provider ${providerName} at index ${index} of ${provider.providerName}` +
                        'was never initialized in its module.'
                );
            }

            // If it doesn't exist in the local module or the imported module,
            // then we can't figure out what it is!
            throw new Error(
                `Failed to resolve provider ? at index ${index} of ${provider.providerName}. ` +
                    `Did you declare it as a provider in ${moduleName} or ` +
                    `export it from an imported module?`
            );
        });

        try {
            // This is the last place where an error can be thrown. We could let
            // it just throw an error, but we can add details to help debugging
            // in the catch clause.
            if (!isFactoryProvider(provider.reference)) {
                provider.instance = new provider.reference(...args);
            }
        } catch (e) {
            // If a native error is thrown, update its message to something meaningful
            if (isNativeError(e)) {
                e.message =
                    `Failed to initialize provider ${provider.providerName} ` +
                    `in ${moduleName}.`;
            }

            throw e;
        }

        // Add providers declared in the root context to the root providers
        if (provider.providedIn === 'root') {
            rootProviders[provider.providerName] = provider.instance;
        }

        return provider;
    };

    // Initialize all local providers
    Object.keys(localProviders).forEach((key) => {
        localProviders[key] = initProvider(localProviders[key]);
    });

    // Add the instance of exported modules to the `exports` of the
    // registered module.
    const exports: Record<string, any> = {};
    Reflect.getMetadata(EXPORTS, moduleRef)?.forEach(
        (exported: Class<any>, index: number) => {
            // The exports array holds references to classes, so we have to
            // get the class name so we can export the registered provider's
            // instance
            const exportName = exported.prototype?.constructor?.name;

            // TODO - we need to handle dynamic providers
            if (!exportName)
                throw new Error(
                    `Failed to resolve provider ? ` +
                        `exported from ${exportName} at position ${index}. ` +
                        'Is it a valid class decorated with @Injectable()?'
                );

            // If we've somehow gotten this far without initializing
            // the exported provider, then we have to throw an error.
            if (!localProviders[exportName].instance) {
                throw new Error(
                    `Failed to resolve provider ${exportName} ` +
                        `exported from ${exportName} at position ${index}. ` +
                        'Is it a valid class decorated with @Injectable()?'
                );
            }

            // If it has been initialized, we add the provider's instance
            // to the exports array so it can be accessed by
            // modules that import this module.
            exports[exportName] = localProviders[exportName].instance;
        }
    );

    // Check for `onModuleInit` lifecycle hook in local providers
    Object.values(localProviders).forEach((provider) => {
        if (implementsOnModuleInit(provider.instance))
            provider.instance.ngOnModuleInit();
    });

    // Check for `onModuleInit` lifecycle hook in root providers
    Object.values(rootProviders).forEach((provider) => {
        if (implementsAfterAppInit(provider.instance))
            provider.instance.ngAfterAppInit();
    });

    const sgModule = {
        moduleName,
        exports,
        imports,
        providers: localProviders
    };

    if (isRootModule) {
        const invokeAfterAppInit = (moduleRef: FsnModuleRef) => {
            Object.values(moduleRef.providers).forEach((provider) => {
                if (implementsAfterAppInit(provider.instance))
                    provider.instance.ngAfterAppInit();
            });
            Object.values(moduleRef.imports ?? {}).forEach((imported) => {
                invokeAfterAppInit(imported);
            });
        };

        // Check for `afterAppInit` lifecycle hook in root module
        // providers and imported modules
        invokeAfterAppInit(sgModule);

        // Check for `afterAppInit` lifecycle hook in root providers
        Object.values(rootProviders).forEach((provider) => {
            if (implementsAfterAppInit(provider.instance))
                provider.instance.ngAfterAppInit();
        });
    }

    return sgModule;
}

/**
 * Initializes a FusionRx application.
 * @param rootModule A class decorated with `@FsnModule()`
 *
 * @publicApi
 */
export function boostrap(rootModule: Class<any>) {
    return initializeModule(rootModule, true);
}
