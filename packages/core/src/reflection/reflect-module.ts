import { ErrorCode, FsnError } from '../application/error-codes';
import { FsnModule } from '../di/module';
import {
    FsnModuleMetadataFacade,
    InjectableMetadataFacade,
    ReflectedInjectable,
    ReflectedRoute,
    RouteMetadataFacade
} from './compiler-facade-interface';
import { Type } from '../interface';
import { isType } from '../interface/type';
import { isFactoryProvider } from '../di/factory-provider';
import { isModuleWithProviders } from '../di/module-with-provider';

/**
 * All providers declared in the root context.
 */
export const rootProviders: {
    [providerName: string]: {
        token: string;
        type: InjectableMetadataFacade;
    };
} = {};

/**
 * Defines the metadata of a class decorated with `@FsnModule`.
 * @param reference A class decorated with `@FsnModule`
 * @param meta Module options injected via the `@FsnModule` decorator
 */
export const reflectModule = (
    reference: Type<FsnModuleMetadataFacade>,
    meta: Partial<FsnModule>
): Type<FsnModuleMetadataFacade> => {
    const moduleName = reference.prototype?.constructor?.name;

    if (moduleName === undefined) {
        throw new FsnError(ErrorCode.DERIVE_MODULE_NAME);
    }

    /** FsnModules that this module imports. */
    const imports: Record<string, Type<FsnModuleMetadataFacade>> = {};

    /** Holds the providers that were imported via other modules. */
    const importedProviders: {
        [providerName: string]: {
            token: string;
            type: InjectableMetadataFacade;
        };
    } = {};

    // Iterate over the imported modules, mapping the module names
    // to the module reference in `imports`
    meta.imports?.forEach((imported) => {
        if (isType<FsnModuleMetadataFacade>(imported)) {
            const name = imported.prototype.name;

            if (!name) {
                throw new FsnError(ErrorCode.DERIVE_MODULE_NAME);
            }

            if (imported.name === moduleName) {
                throw new FsnError(ErrorCode.REFERENCES_SELF);
            }

            imported.prototype.exports.forEach((exportedProviderName) => {
                importedProviders[exportedProviderName] = {
                    token: exportedProviderName,
                    type: imported.prototype.providers[exportedProviderName]
                };
            });

            imports[name] = imported;
        } else if (isModuleWithProviders(imported)) {
            // If a `ModuleWithProviders` has been imported, we have to
            // initialize the module reference with the dynamic providers.
            // We don't handle any errors, because any errors thrown by
            // `defineFsnModuleMetadata` will be meaningful
            const initialized = reflectModule(imported.ngModule, imported);
            imports[initialized.prototype.name] = initialized;
        }
    });

    const providers: Record<string, InjectableMetadataFacade> = {};
    meta.providers?.forEach((provider, index) => {
        if (isType<ReflectedInjectable>(provider)) {
            const token = provider.prototype.token;

            if (!token) {
                // If the provider class does not have a name, it
                // was not decorated with @Injectable(), so we have to error
                throw new FsnError(
                    ErrorCode.INVALID_INJECTABLE,
                    `Failed to initialize provider at index ${index} of ${moduleName}.`
                );
            }

            if (
                !provider.prototype.instance &&
                (!provider.prototype.deps ||
                    provider.prototype.deps.length === 0)
            ) {
                provider.prototype.instance = new provider();
            }

            providers[token] = {
                token: token,
                type: provider,
                dependencies: provider.prototype.deps,
                providedIn: provider.prototype.providedIn,
                instance: provider.prototype.instance
            };
        } else if (isFactoryProvider(provider)) {
            if (provider.useValue) {
                // If the provider is a factory provider that providers
                // a static pre-defined value, we add it to the providers
                // registery and mark it as initialized
                providers[provider.provide] = {
                    token: provider.provide,
                    providedIn: 'module',
                    instance: provider.useValue
                };
            } else if (provider.useFactory) {
                if (!provider.deps || provider.deps.length === 0) {
                    // If the provider is a factory function that has no
                    // dependencies, we add it to the providers
                    // registry and initialize it
                    providers[provider.provide] = {
                        token: provider.provide,
                        providedIn: 'module',
                        instance: provider.useFactory()
                    };
                } else {
                    // Otherwise, we'll have to initialize it after all
                    // providers are initialized, as its dependencies
                    // might be declared providers
                    providers[provider.provide] = {
                        token: provider.provide,
                        providedIn: 'module',
                        factory: provider.useFactory,
                        dependencies: provider.deps
                    };
                }
            }
        }
    });

    /**
     * Resolves the injected dependencies of a reflected injectable.
     * @param provider A reflected injectable
     * @returns An array of a provider's initialized arguments
     */
    const resolveProviderDependencies = (provider: InjectableMetadataFacade) =>
        (provider.dependencies ?? []).map((dep, index) => {
            let resolvedDep = providers[dep.token];

            // If the dependency was not declared locally
            // we have to check if it has been imported
            if (!resolvedDep) {
                // TODO - what if we exported a factory provider?
                resolvedDep =
                    importedProviders[dep.token]?.type ??
                    rootProviders[dep.token]?.type;

                // If the dependency was not declared in an imported module
                // then we have to error
                if (!resolvedDep) {
                    throw new FsnError(
                        ErrorCode.CANNOT_RESOLVE_DEPENDENCY,
                        `Failed to resolve dependency at index ${index} of ${provider.token}.`
                    );
                }

                if (!resolvedDep.instance) {
                    // Modules are responsible for resolving their own dependencies,
                    // so if we load an external module that has unresolved deps,
                    // we have to error
                    throw new FsnError(
                        ErrorCode.INVALID_INJECTABLE,
                        `Failed to resolve dependency at index ${index} of ${provider.token}.`
                    );
                }

                return resolvedDep.instance;
            }

            // If the dependency is declared in the local module
            // we check to see if it's initialized. If it is,
            // we can return the instance.
            if (resolvedDep.instance) return resolvedDep.instance;

            // If the dependency does not have an instance, we
            // we can attempt to initialize it
            const instance = initializeProvider(resolvedDep);

            if (instance) return instance;

            // If for `initializeProvider` returns undefined
            // or null without erroring, we have to error
            throw new FsnError(
                ErrorCode.CANNOT_RESOLVE_DEPENDENCY,
                `Failed to resolve instance of dependency at index ${index} of ${provider.token}.`
            );
        });

    /**
     * Creates the `instance` of a reflected injectable
     * @param provider A reflected injectable
     * @returns An initialized provider
     */
    const initializeProvider = (provider: InjectableMetadataFacade) => {
        if (provider.instance) return provider;

        if (provider.type) {
            if (
                !provider.dependencies ||
                (provider.dependencies.length === 0 && !provider.instance)
            ) {
                return new provider.type();
            }

            provider.instance = new provider.type(
                ...resolveProviderDependencies(provider)
            );

            return provider;
        }

        if (provider.factory) {
            if (!provider.dependencies) {
                provider.instance = provider.factory();
                return provider;
            }

            provider.instance = provider.factory(
                ...provider.dependencies.map((dep, index) => {
                    if (providers[dep.token]) {
                        return providers[dep.token]?.instance;
                    } else if (importedProviders[dep.token]?.type?.instance) {
                        return importedProviders[dep.token].type.instance;
                    } else {
                        throw new FsnError(
                            ErrorCode.CANNOT_RESOLVE_DEPENDENCY,
                            `Failed to resolve dependency of factory provider ${provider.token} at index ${index}. ` +
                                `Is this dependency a class decorated with @Injectable() ` +
                                `and declared in a scope that is accessible to this module?`
                        );
                    }
                })
            );

            return provider;
        }

        throw new FsnError(ErrorCode.INVALID_INJECTABLE);
    };

    Object.keys(providers).forEach((value) => {
        if (!providers[value].instance) {
            // If the provider is not initialized, we have to
            // initialize it
            initializeProvider(providers[value]);
        }

        // If the provider has been initialized in the root context,
        // we need to make it available to all providers
        if (providers[value].providedIn === 'root') {
            rootProviders[providers[value].token] = {
                token: providers[value].token,
                type: providers[value]
            };
        }
    });

    const exports: string[] = [];
    meta.exports?.forEach((exported, index) => {
        if (isType<ReflectedInjectable>(exported)) {
            const name = exported.prototype?.constructor?.name;

            if (name === undefined) {
                throw new FsnError(
                    ErrorCode.INVALID_EXPORT,
                    `Failed to resolve export from module ${moduleName} at index ${index}.`
                );
            }

            exports.push(name);
        } else if (isFactoryProvider(exported)) {
            exports.push(exported.provide);
        }
    });

    const routes: Record<string, RouteMetadataFacade> = {};
    meta.routes?.forEach((route) => {
        if (!isType<ReflectedRoute>(route)) {
            throw new FsnError(ErrorCode.INVALID_EXPORT);
        }

        const metadata: RouteMetadataFacade = {
            providedIn: 'module',
            token: route.prototype.token,
            dependencies: route.prototype.deps,
            type: route
        };

        const args = resolveProviderDependencies(metadata);

        // TODO we need to be initializing the instance in the prototype,
        // so we only have one instance--apply to above
        route.prototype.instance = new route(...args);

        routes[route.prototype.token] = metadata;
    });

    reference.prototype.name = moduleName;
    reference.prototype.exports = exports;
    reference.prototype.imports = imports;
    reference.prototype.providers = providers;
    reference.prototype.routes = routes;

    return reference;
};
