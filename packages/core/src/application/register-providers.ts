import { FsnInjectableRef } from './refs';
import {
    FactoryProvider,
    isFactoryProvider,
    CLASS_NAME,
    PROVIDED_IN,
    INJECTED_DEPS,
    INJECT,
    isInjectableRef
} from '../di';
import { Class, isClass } from '../interface';
import { getInjectedDependencies, getMetadata } from '../reflect';

/**
 * Registers a local provider.
 * @param ref An injected class or Factory Provider
 */
export const registerProvider = (ref: Class<any>) => {
    // If this is not a factory provider, all of the provider's metadata
    // was registered in the Injectable() decorator, so we can create its
    // refernece from the registered metadata
    const provider: FsnInjectableRef = {
        providerName: Reflect.getMetadata(CLASS_NAME, ref),
        providedIn: getMetadata<'module' | 'root'>(PROVIDED_IN, ref, 'module'),
        injected: getMetadata<string[]>(INJECTED_DEPS, ref, []),
        dynamicInjections: getMetadata(INJECT, ref, []),
        reference: ref
    };

    // If the provider's name is not defined in its metadata,
    // then it is an invalid provider
    if (provider.providerName === undefined) {
        throw new Error(
            `Unable to determine provider name from provider ${ref}.`
        );
    }

    return provider;
};

export const registerFactoryProvider = (ref: FactoryProvider) => {
    // The factory provider provides the name, reference (the provider itself).
    const provider: FsnInjectableRef = {
        providerName: ref.provide,
        injected: [],
        providedIn: 'module', // All factory providers are injected in the 'module' context
        reference: ref,
        dynamicInjections: []
    };

    if (ref.useValue !== undefined) {
        // If this FactoryProvider returns a value, set the provider's
        // instance to the value.
        provider.instance = ref.useValue;
    } else if (ref.useFactory) {
        // If this factory provider returns a `useFactory` function,
        // we need to resolve or initialize the injections
        (ref.deps ?? []).map((arg, index) => {
            if (isInjectableRef(arg)) {
                const injectedClassName = Reflect.getMetadata(CLASS_NAME, arg);

                if (!injectedClassName) {
                    throw new Error(
                        `Failed to resolve provider ? at index ${index}` +
                            `of ${provider.providerName}. Did you declare it as a provider ` +
                            `in this module or export it from an imported module?`
                    );
                }

                // Set the index of injected  to the name of the injected
                // class, so we can provide the injected class after it has been
                // initialized.
                provider.injected[index] = injectedClassName;
            } else if (isClass(arg)) {
                // If a non-injectable class is provided, we get its
                // injected dependencies.
                const argParams = getInjectedDependencies(arg);

                // We can only accept non-injectable classes if they have no
                // constructor arguments. If it has provider arguments, we'll
                // have no way to resolve them, since the class was not decorated
                // with @Injectable
                if (Object.keys(argParams).length === 0) {
                    provider.injected[index] = new arg();
                } else {
                    throw new Error(
                        `A class was provided to ${provider.providerName} at index ${index}` +
                            `with arguments in its constructor, but the class was not ` +
                            `decorated with @Injectable()`
                    );
                }
            }

            // TODO - are we missing a base case?
        });
    }

    return provider;
};

/**
 * Registers a local provider.
 * @param ref An injected class or Factory Provider
 */
export const registerProviders = (refs: (Class<any> | FactoryProvider)[]) => {
    const providers: Record<string, FsnInjectableRef> = {};

    refs.forEach((ref) => {
        let provider: FsnInjectableRef;

        if (isFactoryProvider(ref)) {
            provider = registerFactoryProvider(ref);
        } else {
            provider = registerProvider(ref);
        }

        providers[provider.providerName] = provider;
    });

    return providers;
};
