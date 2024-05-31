import '../console/console.js';

import {
    FsnModuleMetadataFacade,
    InjectableMetadataFacade
} from '../reflection/compiler-facade-interface.js';
import { implementsAfterAppInit, implementsOnModuleInit } from './lifecycle.js';
import {
    ModuleWithProviders,
    isModuleWithProviders
} from '../di/module-with-provider.js';
import { Type } from '../interface/type.js';
import { FusionServer, HttpsServerOptions, ServerOptions } from './server.js';
import { FsnError } from '../error/error.js';
import { ErrorCode } from '../error/error-codes.js';
import { Subject } from 'rxjs';
import { FsnModule } from '../public-api.js';
import { handleErrors } from '../error/error-handler.js';
import { bootstrapRouter } from './bootstrap-route-handler.js';

export const afterAppInit = new Subject<Type<FsnModuleMetadataFacade>>();

/** Alias for Type<InjectableMetadataFacade> */
export declare type I = Type<InjectableMetadataFacade>;

/** Alias for Type<FsnModuleMetadataFacade> */
export declare type M = Type<FsnModuleMetadataFacade>;

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
 * The initial options set in `bootstrap`.
 */
export let initOptions: Partial<ServerOptions> | HttpsServerOptions;

/**
 * Defines the metadata of a class decorated with `@FsnModule`.
 * @param rootModule A class decorated with `@FsnModule`
 * @param options
 */
export const bootstrap = (
    rootModule: Type<any> | ModuleWithProviders,
    options?: Partial<ServerOptions> | HttpsServerOptions
) => {
    let server: FusionServer | undefined;
    // @todo - we only want to create the fusion server if the user
    // has asked for it. Figure out how to do this.
    server = new FusionServer();

    const useErrorHandler = options?.exitOnUncaught ?? false;
    if (useErrorHandler === false) {
        handleErrors({
            exitOnUncaught: false
        });
    }

    const type = bootstrapModule(rootModule);
    afterAppInit.next(type);

    server?.listen(options);

    return { root: type, server };
};

export const bootstrapModuleWithProviders = (module: ModuleWithProviders) => {
    @FsnModule({
        exports: module.exports,
        imports: module.imports,
        providers: module.providers,
        routes: module.routes
    })
    class Module {}
    (<M>Module).prototype.token = module.fsnModule.prototype.token;
    return <M>Module;
};

export const bootstrapModule = (module: Type<any> | ModuleWithProviders) => {
    const type: Type<FsnModuleMetadataFacade> = isModuleWithProviders(module)
        ? bootstrapModuleWithProviders(module)
        : module;

    const token = type.prototype.token;

    if (!rootModuleToken) rootModuleToken = token;

    /** Providers that were imported via other modules. */
    const importedProviders: Record<
        string,
        Type<InjectableMetadataFacade>
    > = {};

    // Bootstrap imported modules
    Object.values(type.prototype.imports).forEach((imported) => {
        bootstrapModule(imported);

        // Detect circular module dependency
        if (Object.keys(imported.prototype.imports).includes(token)) {
            throw new FsnError(
                ErrorCode.CIRCULAR_DEPENDENCY,
                `Module ${type.prototype.token} is imported by ${imported.prototype.token}, ` +
                    `which itself lists ${type.prototype.token} as a dependency.`
            );
        }

        // Register the exported providers of imported modules
        imported.prototype.exports.forEach((exported, index) => {
            // @todo check to see how references work. This mappinig might be
            // unnecessary, as the class object prototype is global
            const importedProvider = imported.prototype.providers[exported];

            // Modules are responsible for resolving their own dependencies,
            // so if a module exports an uninitialized provider,
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
        // Create the error to throw if the dependency does not have a token
        // or we fail to initialize the dependency
        const createResolveError = (depIndex: number, token?: string) =>
            new FsnError(
                ErrorCode.CANNOT_RESOLVE_DEPENDENCY,
                `Failed to resolve dependency ${token ?? '(?)'} ` +
                    `of ${provider.prototype.token} at index ${depIndex}`
            );

        // If the provider has no dependencies, we can return an empty array.
        if (provider.prototype.dependencies?.length === 0) return [];

        // Otherwise, we have to resolve the dependencies.
        return provider.prototype.dependencies.map((dep, index) => {
            // If the dependency does not have a token, then it is not a valid
            // provider, so we have to error.
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

    const providers = {
        ...(type.prototype.providers ?? {}),
        ...(type.prototype.routes ?? {})
    };

    // Attempt to initialize all providers declared in this module
    Object.values(providers).forEach((provider) => {
        initializeProvider(provider);

        // If this provider is initialized and is declared in the
        // `root` context, add it to the root providers
        if (provider.prototype.providedIn === 'root') {
            rootProviders[provider.prototype.token] = provider;
        }
    });

    // Initialize routes declared in this module
    Object.values(type.prototype.routes ?? {}).forEach((router) => {
        bootstrapRouter(router);
    });

    // Call `onModuleInit` for all providers in this module
    // that implement `onModuleInit`
    Object.values(type.prototype.providers ?? {}).forEach((provider) => {
        if (
            provider.prototype.instance &&
            implementsOnModuleInit(provider.prototype.instance)
        ) {
            provider.prototype.instance.fsnOnModuleInit();
        }
    });

    // If we've reached this point, all modules and providers in the application
    // have been initialized, so we can invoke the `afterAppInit` lifecycle hook
    // on all modules and providers that implement it.
    if (token === rootModuleToken) {
        const invokeAfterAppInit = (
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
                invokeAfterAppInit(imported);
            });
        };

        // Check for `afterAppInit` lifecycle hook in root module
        // providers and imported modules
        invokeAfterAppInit(type);
    }

    return type;
};
