import { rootProviders } from './bootstrap';
import { FsnModuleRef, FsnProvidereRef } from './refs';

/**
 * Method that is run after the local module is initialized.
 *
 * @publicApi
 */
export interface OnModuleInit {
    fsnOnModuleInit(): void;
}

export const implementsOnModuleInit = (val: any): val is OnModuleInit => {
    return (
        val !== undefined &&
        val !== null &&
        typeof val === 'object' &&
        val.fsnOnModuleInit
    );
};

export const onModuleInit = (
    localProviders: Record<string, FsnProvidereRef>
) => {
    Object.values(localProviders).forEach((provider) => {
        if (implementsOnModuleInit(provider.instance))
            provider.instance.fsnOnModuleInit();
    });
};

/**
 * Method that is invoked after the application is initialized.
 *
 * @publicApi
 */
export interface AfterAppInit {
    fsnAfterAppInit(): void;
}

export const implementsAfterAppInit = (val: any): val is AfterAppInit => {
    return (
        val !== undefined &&
        val !== null &&
        typeof val === 'object' &&
        val.fsnAfterAppInit
    );
};

export const afterAppInit = (fsnModule: FsnModuleRef) => {
    /**
     * Calls `fsn
     * @param moduleRef An initialized module reference
     */
    const processModuleProviders = (moduleRef: FsnModuleRef) => {
        // Call `afterAppInit` on all providers that implement the
        // `AfterAppInit` interface
        Object.values(moduleRef.providers).forEach((provider) => {
            if (implementsAfterAppInit(provider.instance)) {
                provider.instance.fsnAfterAppInit();
            }
        });

        // Recursively call `afterAppInit` on all providers declared
        // by this module's imports
        Object.values(moduleRef.imports ?? {}).forEach((imported) => {
            processModuleProviders(imported);
        });
    };

    // Check for `afterAppInit` lifecycle hook in root module
    // providers and imported modules
    processModuleProviders(fsnModule);

    // Check for `afterAppInit` lifecycle hook in root providers
    Object.values(rootProviders).forEach((provider) => {
        if (implementsAfterAppInit(provider.instance))
            provider.instance.fsnAfterAppInit();
    });
};
