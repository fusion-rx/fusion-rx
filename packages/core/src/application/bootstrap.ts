import { isObservable } from 'rxjs';

import { ErrorCode, FsnError } from '../application/error-codes';
import {
    FsnModuleMetadataFacade,
    InjectableMetadataFacade
} from '../reflection/compiler-facade-interface';
import { implementsAfterAppInit, implementsOnModuleInit } from './lifecycle';
import {
    ModuleWithProviders,
    isModuleWithProviders
} from '../di/module-with-provider';
import { reflectModule } from '../reflection/reflect-module';
import { Type } from '../interface';

/**
 * All providers declared in the root context.
 */
const rootProviders: {
    [token: string]: Type<InjectableMetadataFacade>;
} = {};

/**
 * The name of the root module; used to determine when
 * `afterAppInit` lifecycle hook should be invoked.
 */
let rootModuleToken: string;

/**
 * Defines the metadata of a class decorated with `@FsnModule`.
 * @param type A class decorated with `@FsnModule`
 * @param meta Module options injected via the `@FsnModule` decorator
 */
export const bootstrap = (
    rootModule: Type<any> | ModuleWithProviders
): Type<FsnModuleMetadataFacade> => {
    let type: Type<FsnModuleMetadataFacade>;

    if (isModuleWithProviders(rootModule)) {
        type = rootModule.fsnModule;
        reflectModule(type, {
            exports: rootModule.exports,
            imports: rootModule.imports,
            providers: rootModule.providers,
            routes: rootModule.routes
        });
    } else {
        type = rootModule;
    }

    rootModuleToken = type.prototype.token;

    bootstrapper(type);
    return type;
};

export const bootstrapper = (type: Type<FsnModuleMetadataFacade>) => {
    const token = type.prototype.token;

    /** Holds the instance of providers that were imported via other modules. */
    const importedProviders: Record<
        string,
        Type<InjectableMetadataFacade>
    > = {};

    // Bootstrap imported modules
    Object.values(type.prototype.imports).forEach((imported) => {
        bootstrapper(imported);

        // Detect circular module dependency
        if (Object.keys(imported.prototype.imports).includes(token)) {
            throw new FsnError(
                ErrorCode.CIRCULAR_DEPENDENCY,
                `Module ${type} is imported by ${imported.prototype.token}, ` +
                    `which itself lists ${type} as a dependency.`
            );
        }

        // Register the exported providers of imported modules
        imported.prototype.exports.forEach((exported, index) => {
            // TODO = check to see how references work. This mappinig might be
            // unnecessary, as the class object prototype is global
            const importedProvider = imported.prototype.providers[exported];

            // Modules are responsible for resolving their own dependencies,
            // so if an uninitialized provider slips through the cracks,
            // we have to error
            if (!importedProvider.prototype.instance) {
                throw new FsnError(
                    ErrorCode.INVALID_INJECTABLE,
                    `Failed to resolve dependency ${exported} at index ${index} ` +
                        `of the 'exports' array of ${imported.prototype.token}. ` +
                        `${exported} was never initialized.`
                );
            }

            importedProviders[importedProvider.prototype.token] =
                importedProvider;
        });
    });

    /**
     * Resolves the dependencies of a provider declared in this module.
     * @param provider A local provider
     * @returns An array of `provider`'s initialized dependencies or
     * an empty array if the provider has no deps.
     */
    const resolveProviderDependencies = (
        provider: Type<InjectableMetadataFacade>
    ): any[] => {
        const createResolveError = (depIndex: number, token?: string) =>
            new FsnError(
                ErrorCode.CANNOT_RESOLVE_DEPENDENCY,
                `Failed to resolve dependency ${token ?? '(?)'} ` +
                    `of ${provider.prototype.token} at index ${depIndex}`
            );

        return (provider.prototype.dependencies ?? []).map((dep, index) => {
            // Create the error to throw if the dependency does not have a token
            // or we fail to initialize the dependency

            // If the dependency does not have a token, then it is not a valid
            // injectable, so we have to error.
            if (!dep.token) throw createResolveError(index);

            // Assign the provider to a variable for the sake of readability
            const localProvider = type.prototype.providers[dep.token];

            // If this provider has been declared locally...
            if (localProvider) {
                // If this provider has an instance, it's already initialized
                if (localProvider.prototype.instance)
                    return localProvider.prototype.instance;
                // If this provider has a value, it was a factory provider
                // that provided a static value and is already initialized
                if (localProvider.prototype.value !== undefined)
                    return localProvider.prototype.value;

                try {
                    // If this provider does not have an instance or value,
                    // we have to attempt to initialize it.
                    initializeProvider(localProvider);
                    // If no errors were thrown, the provider has been initialized
                    return localProvider.prototype.instance;
                } catch (initializeError) {
                    // If the dependency is optional, then we can disregard errors
                    if (dep.optional) return undefined;
                    // Otherwise, we have to throw an error
                    throw createResolveError(index, dep.token);
                }
            }

            const getInstance = (type?: Type<InjectableMetadataFacade>) =>
                type && type.prototype.instance
                    ? type.prototype.instance
                    : undefined;

            // If it hasn't been declared locally, we have to check the
            // imported providers and the root providers
            const instance =
                getInstance(importedProviders[dep.token]) ??
                getInstance(rootProviders[dep.token]);

            // If the dependency has been initialized in either, return instance
            if (instance) return instance;
            // If it hasn't been initialized but is optional, return undefined
            if (dep.optional) return undefined;
            // Otherweise, we have to throw an error
            throw createResolveError(index, dep.token);
        });
    };

    /**
     * Initializes providers declared in this module.
     * @param provider A local provider
     */
    const initializeProvider = (provider: Type<InjectableMetadataFacade>) => {
        // If the provider is initialized, we can return without doing anything
        if (provider.prototype.instance || provider.prototype.value) return;
        // Otherwise, we need to initialize it. We don't have to worry about
        // zero-argument classes, because the resolve method will return an
        // empty array if the provider has no arguments.
        provider.prototype.instance = new provider(
            ...resolveProviderDependencies(provider)
        );
    };

    // Attempt to initialize all providers declared in this module
    Object.values(type.prototype.providers).forEach((provider) => {
        initializeProvider(provider);

        const providedIn = provider.prototype.providedIn;

        // If this provider is initialized and is declared in the
        // `root` context, add it to the root providers
        if (providedIn === 'root') {
            rootProviders[provider.prototype.token] = provider;
        }
    });

    // Attempt to initialize all routes declared in this module
    Object.values(type.prototype.routes).forEach((route) => {
        route.prototype.instance = new route(
            ...resolveProviderDependencies(route)
        );

        Object.keys(route.prototype.instance).forEach((routeMethod) => {
            const classMember = route.prototype.instance[routeMethod];
            if (isObservable(classMember)) {
                classMember.subscribe();
            }
        });
    });

    // Call onModuleInit for all providers in this module
    // that implement `onModuleInit`
    [
        ...Object.values(type.prototype.providers),
        ...Object.values(type.prototype.routes)
    ].forEach((provider) => {
        if (
            provider.prototype.instance &&
            implementsOnModuleInit(provider.prototype.instance)
        ) {
            provider.prototype.instance.fsnOnModuleInit();
        }
    });

    if (token === rootModuleToken) {
        const invokeOnModuleInit = (
            moduleRef: Type<FsnModuleMetadataFacade>
        ) => {
            // Call `afterAppInit` on all providers that implement the
            // `AfterAppInit` interface
            Object.values(moduleRef.prototype.providers).forEach((provider) => {
                if (implementsAfterAppInit(provider.prototype.instance)) {
                    provider.prototype.instance.fsnAfterAppInit();
                }
            });

            // Recursively call `afterAppInit` on all providers declared
            // by this module's imports
            Object.values(moduleRef.prototype.imports).forEach((imported) => {
                invokeOnModuleInit(imported);
            });
        };

        // Check for `afterAppInit` lifecycle hook in root module
        // providers and imported modules
        invokeOnModuleInit(type);
    }

    return type;
};
