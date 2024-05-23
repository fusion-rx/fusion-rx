import { Type } from '../interface/type.js';

export declare interface FactoryProvider {
    /**
     * A unique injection token.
     */
    provide: string;
    /**
     * A static value provided for injection.
     */
    useValue?: any;
    /**
     * A function to invoke to create a value for this token.
     * The function is invoked with resolved values of any tokens
     * provided in `deps`.
     */
    useFactory?: Function;

    /**
     * A class to
     */
    useClass?: Type<any>;
    /**
     * A list of tokens to be resolved by the injector.
     * The list of values is used as arguments to the
     * `useFactory` function.
     */
    deps?: Type<any>[];
}

export const isFactoryProvider = (val: any): val is FactoryProvider => {
    return (
        typeof val === 'object' &&
        'provide' in val &&
        ('useValue' in val || 'useFactory' in val || 'useClass' in val)
    );
};

/**
 * Helper for creating a factory provider.
 * @param provide An injection token
 * @param useValue A value to inject
 * @returns A factory provider or undefined if `useValue` is undefined.
 */
export const provideVal = (
    provide: string,
    useValue?: any
): FactoryProvider | undefined => {
    if (useValue === undefined) return;
    return {
        provide,
        useValue
    };
};
