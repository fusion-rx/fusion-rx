import { InjectableMetadataFacade } from '../reflection/compiler-facade-interface';

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
        'fsnOnModuleInit' in val
    );
};

export const onModuleInit = (
    localProviders: Record<string, InjectableMetadataFacade>
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
        'fsnAfterAppInit' in val
    );
};
