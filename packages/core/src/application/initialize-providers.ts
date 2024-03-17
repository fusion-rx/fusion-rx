import {
    CLASS_NAME,
    FactoryProvider,
    INJECT,
    isFactoryProvider,
    isInjectableRef
} from '../di';
import { isClass } from '../interface';
import { getConstructorParameters, getMetadata } from '../reflect';
import { rootProviders } from './bootstrap';
import { FsnProvidereRef, FsnModuleRef } from './refs';

const isNativeError = (e: any): e is Error =>
    e !== undefined &&
    e !== null &&
    typeof e === 'object' &&
    'message' in e &&
    'name' in e;

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
        public providers: Record<string, FsnProvidereRef>,
        /** Imported module names mapped to module refs */
        public imports: Record<string, FsnModuleRef>,
        /** The name of the modules in which `providers` is registered */
        public moduleName: string
    ) {}

    /**
     * Initialize all providers.
     */
    public init() {
        Object.keys(this.providers).forEach((key) => {
            this.providers[key] = this._initializeProvider(this.providers[key]);
        });

        return this.providers;
    }

    /**
     * Initializes a provider.
     * @param provider A reference to a provider
     * @returns The provider reference with an `instance`
     * @throws Will throw a meaningful error if the provider cannot be initialized
     */
    private _initializeProvider(provider: FsnProvidereRef): FsnProvidereRef {
        // If this is a factory provider, should have already been initialized
        // TODO - What do we do if the factory provider has dependencies?
        if (isFactoryProvider(provider.reference)) {
            return this._initializeFactoryProvider(provider);
        }

        // If this provider has an instance, it has already been initialized
        if (provider.instance) return provider;

        // If this provider is not initialized and has no injected dependencies,
        // we initialize it.
        if (
            !isFactoryProvider(provider.reference) &&
            provider.injected.length === 0
        ) {
            provider.instance = new provider.reference();
            return provider;
        }

        // Iterate over the provider's injected dependencies and attempt to
        // inject them from the local module or the exports of an imported module.
        const args = provider.injected.map((providerName, index) => {
            return this._initializeProviderArgs(
                index,
                providerName,
                provider.dynamicInjections
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
                    `in ${this.moduleName}.`;
            }

            throw e;
        }

        // Add providers declared in the root context to the root providers
        if (provider.providedIn === 'root') {
            rootProviders[provider.providerName] = provider.instance;
        }

        return provider;
    }

    private _initializeFactoryProvider(provider: FsnProvidereRef) {
        const reference = provider.reference as FactoryProvider;

        if (reference.useValue) {
            provider.instance = reference.useValue;
        } else if (reference.useFactory) {
            if (reference.deps) {
                if (reference.deps.length === 0) {
                    provider.instance = reference.useFactory();
                } else {
                    const args = reference.deps.map((dep, index) => {
                        if (isInjectableRef(dep)) {
                            return this._initializeProviderArgs(
                                index,
                                Reflect.getMetadata(CLASS_NAME, dep),
                                getMetadata(INJECT, dep, [])
                            );
                        } else if (isClass(dep)) {
                            const argDeps = getConstructorParameters(dep);

                            if (Object.keys(argDeps).length === 0) {
                                return new dep();
                            } else {
                                throw new Error('Injectable error');
                            }
                        } else if (isInitialized(dep)) {
                            return dep;
                        }

                        throw new Error(`Invalid injectable ${dep}`);
                    });

                    provider.instance = reference.useFactory(...args);
                }
            } else {
                provider.instance = reference.useFactory();
            }
        } else {
            throw new Error(
                `Invalid factory provider detected in ${this.moduleName}.`
            );
        }

        return provider;
    }

    private _initializeProviderArgs(
        index: number,
        providerName: string,
        dynamicInjections: any[]
    ) {
        // If a factory provider was injected with `@Inject()`,
        // its instance should already be initialized
        if (dynamicInjections[index]) {
            return dynamicInjections[index].instance;
        }

        // Check if this provider is declared in the `root` context
        if (rootProviders[providerName]) {
            if (rootProviders[providerName].instance) {
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
