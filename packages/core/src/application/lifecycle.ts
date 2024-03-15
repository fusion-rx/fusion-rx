/**
 * Method that is run after the local module is initialized.
 *
 * @publicApi
 */
export interface OnModuleInit {
    ngOnModuleInit(): void;
}

export const implementsOnModuleInit = (val: any): val is OnModuleInit => {
    return (
        val !== undefined &&
        val !== null &&
        typeof val === 'object' &&
        val.sgOnModuleInit
    );
};

/**
 * Method that is invoked after the application is initialized.
 *
 * @publicApi
 */
export interface AfterAppInit {
    ngAfterAppInit(): void;
}

export const implementsAfterAppInit = (val: any): val is AfterAppInit => {
    return (
        val !== undefined &&
        val !== null &&
        typeof val === 'object' &&
        val.sgAfterAppInit
    );
};
