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
     * A list of tokens to be resolved by the injector.
     * The list of values is used as arguments to the
     * `useFactory` function.
     */
    deps?: any[];
}

export const isFactoryProvider = (val: any): val is FactoryProvider => {
    return (
        typeof val === 'object' &&
        'provide' in val &&
        ('useValue' in val || 'useFactory' in val)
    );
};
