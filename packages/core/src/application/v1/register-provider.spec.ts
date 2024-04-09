import { Injectable } from '../../di';
import {
    registerFactoryProvider,
    registerProvider
} from './register-providers';
import {
    classFactoryProvider,
    injectableFactoryProvider,
    valueFactoryProvider
} from './test.spec';

describe('register-provider', () => {
    test('Can register module-level provider', () => {
        @Injectable({
            providedIn: 'module'
        })
        class TestProvider {}
        const provider = registerProvider(TestProvider);
        expect(provider.providerName).toEqual('TestProvider');
        expect(provider.providedIn).toEqual('module');
        expect(provider.injected).toEqual([]);
        expect(provider.instance).toBeUndefined();
    });

    test('Can register root-level provider', () => {
        @Injectable()
        class TestProvider {}
        const provider = registerProvider(TestProvider);
        expect(provider.providerName).toEqual('TestProvider');
        expect(provider.providedIn).toEqual('root');
        expect(provider.injected).toEqual([]);
        expect(provider.instance).toBeUndefined();
    });

    test('Can register factory value provider', () => {
        const provider = registerFactoryProvider(valueFactoryProvider);
        expect(provider.providedIn).toEqual('module');
        expect(provider.instance).toEqual('my_value');
        console.log(provider);
    });

    test('Can register factory class provider', () => {
        const provider = registerFactoryProvider(classFactoryProvider);
        expect(provider.providedIn).toEqual('module');
    });

    test('Can register factory injectable provider', () => {
        const provider = registerFactoryProvider(injectableFactoryProvider);
        expect(provider.providedIn).toEqual('module');
        expect(provider.injected).toEqual(['ModuleProvider']);
    });
});
