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
