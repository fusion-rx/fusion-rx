import { Injectable, FactoryProvider, FsnModule, Inject } from '../di';

/**
 * an injectable in the module context
 */
@Injectable({
    providedIn: 'module'
})
export class ModuleProvider {}

/**
 * An injectable in the root context
 */
@Injectable({
    providedIn: 'root'
})
export class RootProvider {}

export const providedInModuleProviders = [ModuleProvider, RootProvider];

@FsnModule({
    providers: providedInModuleProviders
})
export class ProvidedInModule {}

/**
 * A factory provider that uses `useValue`
 */
export const valueFactoryProvider: FactoryProvider = {
    provide: 'VALUE_FACTORY_PROVIDER',
    useValue: 'my_value'
};

/**
 * A standard class, injected into {@link classFactoryProvider}
 */
export class ClassProvider {
    value = 'car';
}

/**
 * A factory provider that returns a non-injectable class
 */
export const classFactoryProvider: FactoryProvider = {
    provide: 'CLASS_FACTORY_PROVIDER',
    useFactory: () => {
        return new ClassProvider();
    }
};

/**
 * A provider with an injected injectable
 */
@Injectable()
class ProviderWithInjectableArg {
    constructor(public factoryValueArg: ModuleProvider) {}
}

/**
 * A factory provider with an Injectable dep
 */
export const injectableFactoryProvider: FactoryProvider = {
    provide: 'FACTORY_PROVIDER',
    useFactory: (arg: ProviderWithInjectableArg) => {
        return new ProviderWithInjectableArg(arg);
    },
    deps: [ModuleProvider]
};

@Injectable()
export class TestFactoryProvider {
    constructor(
        @Inject('VALUE_FACTORY_PROVIDER')
        public valueFactoryProvider: string,
        @Inject('CLASS_FACTORY_PROVIDER')
        public classFactoryProvider: ClassProvider,
        @Inject('FACTORY_PROVIDER')
        public factoryProvider: ProviderWithInjectableArg
    ) {}
}

export const factoryProviderModuleProviders = [
    TestFactoryProvider,
    injectableFactoryProvider,
    classFactoryProvider,
    valueFactoryProvider
];

export const factoryProviderModuleProvidersRef = {
    testFactoryProvider: TestFactoryProvider,
    injectableFactoryProvider,
    classFactoryProvider,
    valueFactoryProvider
};

@FsnModule({
    providers: factoryProviderModuleProviders
})
export class FactoryProviderModule {}

@FsnModule({
    imports: [FactoryProviderModule, ProvidedInModule]
})
export class RootModule {}
