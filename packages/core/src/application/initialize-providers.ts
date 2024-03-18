import {
    CLASS_NAME,
    FactoryProvider,
    INJECT,
    isFactoryProvider,
    isInjectableRef
} from '../di';
import { Class, isClass } from '../interface';
import {
    getClassName,
    getConstructorParameters,
    getMetadata
} from '../reflect';
import { rootProviders } from './bootstrap';
import { FsnInjectableRef, FsnModuleRef } from './refs';

/**
 * Determines if `e` is a native error.
 * @param e an error or any
 * @returns true if `e` is an error; otherwise, false
 */
const isNativeError = (e: any): e is Error =>
    e !== undefined &&
    e !== null &&
    typeof e === 'object' &&
    'message' in e &&
    'name' in e;

/**
 * Determines if `val` is initialized.
 * @param val An argument in a ProviderFunction
 * @returns True if the argument is an initialized value;
 * otherwise, false
 */
const isInitialized = (val: any) => {
    return (
        val !== undefined &&
        val !== null &&
        (typeof val === 'bigint' ||
            typeof val === 'boolean' ||
            typeof val === 'number' ||
            typeof val === 'object' ||
            typeof val === 'string' ||
            typeof val === 'symbol')
    );
};

/**
 * Initializes the providers of a module.
 */
export class ProviderInitializer {
    constructor(
        /** Provider names mapped to provider refs */
        public providers: Record<string, FsnInjectableRef>,
        /** Imported module names mapped to module refs */
        public imports: Record<string, FsnModuleRef>,
        /** The name of the modules in which `providers` is registered */
        public moduleName: string
    ) {}

    /**
     * Initialize all providers.
     */
    public init() {
        const initializedProviders: Record<string, FsnInjectableRef> = {};

        Object.keys(this.providers).forEach((key) => {
            const provider = this._initializeProvider(this.providers[key]);

            if (provider.providedIn === 'root') {
                // If this provider is injected in the 'root' context, add it to
                // the root providers
                rootProviders[key] = provider;
            } else {
                // If this provider is injected in the 'module' context,
                // update its reference
                initializedProviders[key] = provider;
            }
        });

        return initializedProviders;
    }

    /**
     * Initializes a provider.
     * @param provider A reference to a provider
     * @returns The provider reference with an `instance`
     * @throws Will throw a meaningful error if the provider cannot be initialized
     */
    private _initializeProvider(provider: FsnInjectableRef): FsnInjectableRef {
        // If this provider has an instance, it has already been initialized
        if (provider.instance) return provider;

        if (isFactoryProvider(provider.reference)) {
            return this._initializeFactoryProvider(provider);
        } else {
            return this._initializeInjectableProvider(provider);
        }
    }

    private _initializeInjectableProvider(provider: FsnInjectableRef) {
        // To avoid unnecessary type-checking, create a reference
        // to the provider reference cast to Class
        const reference = provider.reference as Class<any>;

        if (provider.injected.length === 0) {
            // This provider has no injected dependencies, so we can initialize it
            provider.instance = new reference();
            return provider;
        }

        // This provider has injected dependencies that we need to resolve
        const args = provider.injected.map((providerName, providerIndex) => {
            return this._resolveInjectedDeps(
                providerIndex,
                providerName,
                provider.dynamicInjections
            );
        });

        try {
            // Catch any thrown errors so we can add details for debugging
            provider.instance = new reference(...args);
        } catch (e) {
            // If a native error is thrown, update its message to something meaningful
            if (isNativeError(e)) {
                e.message =
                    `Failed to initialize provider ${provider.providerName} ` +
                    `in ${this.moduleName}.`;
            }

            // Otherwise, we don't know what sort of message this is,
            // so just throw it.
            throw e;
        }

        return provider;
    }

    private _initializeFactoryProvider(provider: FsnInjectableRef) {
        // To avoid unnecessary type-checking, create a reference
        // to the provider reference cast to FactoryProvider
        const reference = provider.reference as FactoryProvider;

        if (reference.useValue) {
            // If the factory provider returns an already-initialized value,
            // we can set the provider's instance to the provided value
            provider.instance = reference.useValue;
            return provider;
        }

        if (reference.useFactory) {
            if (reference.deps) {
                if (reference.deps.length === 0) {
                    provider.instance = reference.useFactory();
                    return provider;
                }

                const args = reference.deps.map((dep, index) => {
                    if (isInjectableRef(dep)) {
                        return this._resolveInjectedDeps(
                            index,
                            Reflect.getMetadata(CLASS_NAME, dep),
                            getMetadata(INJECT, dep, [])
                        );
                    }

                    if (isClass(dep)) {
                        const argDeps = getConstructorParameters(dep);

                        if (Object.keys(argDeps).length === 0) {
                            // If the class in deps has no constructor parameters,
                            // we can initialize and return it.
                            return new dep();
                        } else {
                            // Otherwise, we have to throw an error, because we won't be
                            // able to resolve the arguments of the class unless it's registered
                            // as a provider in this module or an imported module's exports
                            const className = getClassName(dep) ?? '?';
                            throw new Error(
                                `Factory provider ${provider.providerName} in Module ${this.moduleName} ` +
                                    `lists in its deps array at index ${index} a class (${className}) ` +
                                    `that has constructor arguments but is not decorated with @Injectable(). ` +
                                    `Please decorate ${className} with @Injectable() or remove it from the deps array.`
                            );
                        }
                    }

                    if (isInitialized(dep)) {
                        // If the dependency is not a class or if it is initialized,
                        // we can return it.
                        return dep;
                    }

                    // If the injected dependency is not an injectable, is not a class,
                    // and is not initialized, we need to throw an error.
                    throw new Error(
                        `Failed to initialize a dependency at index ${index} ` +
                            `of the deps array of the factory provider ${provider.providerName} ` +
                            `in module ${this.moduleName}.`
                    );
                });

                // If no errors have been thrown, we can initialize the instance
                // of the provider factory with the mapped arguments.
                provider.instance = reference.useFactory(...args);
            } else {
                // If the factory provider has no deps, we can call the useFactory function.
                provider.instance = reference.useFactory();
            }
        } else {
            // If somehow someone managed to create a provider factory without
            // implementing either `useClass` or `useValue`, we have to throw an error
            throw new Error(
                `Either 'useFactory' or 'useValue' must be implemented in the ` +
                    `factory provider ${provider.providerName} in module ${this.moduleName}.`
            );
        }

        return provider;
    }

    /**
     * Resolves an injected dependency.
     * @param index The index of the injected dependency
     * @param providerName The name of the provider
     * @param dynamicInjections Injections decoreated with ＠Inject()
     * @returns The `instance` of the injected dependency
     */
    private _resolveInjectedDeps(
        index: number,
        providerName: string,
        dynamicInjections: any[]
    ): any {
        // If a factory provider was injected with `@Inject()`,
        // its instance should already be initialized
        if (dynamicInjections[index]) {
            return this._resolveInjectedDeps(
                index,
                dynamicInjections[index],
                []
            ) as any;
        }

        // Check if this provider is declared in the `root` context
        if (rootProviders[providerName]) {
            if (rootProviders[providerName].instance) {
                // Since `instance` exists, the injected provider has
                // already been initialized
                return rootProviders[providerName].instance;
            } else {
                // The injected provider has not been initialized.
                // We don't need to handle errors, because if the provider
                // cannot be initialized, `initProvider` will throw a useful error.
                rootProviders[providerName] = this._initializeProvider(
                    this.providers[providerName]
                );

                return rootProviders[providerName].instance;
            }
        }

        // Check if this provider is declared locally
        if (this.providers[providerName]) {
            if (this.providers[providerName].instance) {
                // Since `instance` exists, the injected provider has
                // already been initialized
                return this.providers[providerName].instance;
            } else {
                // The injected provider has not been initialized.
                // We don't need to handle errors, because if the provider
                // cannot be initialized, `initProvider` will throw a useful error.
                this.providers[providerName] = this._initializeProvider(
                    this.providers[providerName]
                );

                return this.providers[providerName].instance;
            }
        }

        // If it is not declared in the root context or locally,
        // it either has not been declared or it is exported from
        // an imported module
        const moduleRef = Object.values(this.imports).find(
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
                `Provider ${providerName} at index ${index} of ${providerName}` +
                    'was never initialized in its module.'
            );
        }

        // If the provider cannot be found in any imported modules,
        // then it doesn't exist or wasn't exported from an imported module
        throw new Error(
            `Failed to resolve provider ? at index ${index} of ${providerName}. ` +
                `Did you declare it as a provider in ${this.moduleName} or ` +
                `export it from an imported module?`
        );
    }
}
