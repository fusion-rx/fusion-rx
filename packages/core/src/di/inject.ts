export const INJECT = '__ng-inject__';

export declare interface FactoryProvider {
    provide: any;
    useValue?: any;
    /**
     * A function to invoke to create a value for this token.
     * The function is invoked with resolved values of tokens
     * in the deps field.
     */
    useFactory?: Function;
    /**
     * A list of tokens to be resolved by the injector.
     * The list of values is then used as arguments to the
     * useFactory function.
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

export function Inject(provider: string) {
    // @ts-ignore
    return (target: any, arg1: any, parameterIndex: number) => {
        const injected = Reflect.getMetadata(INJECT, target) ?? [];
        injected[parameterIndex] = provider;
        Reflect.defineMetadata(INJECT, injected, target);
    };
}
