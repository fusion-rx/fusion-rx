import { FactoryProvider, Inject, Injectable } from '../../di';
import { ProviderInitializer } from './initialize-providers';
import {
    registerFactoryProvider,
    registerProvider
} from './register-providers';

describe('Initialize providers', () => {
    @Injectable()
    class TestInjectableA {
        public randomNumber = this.random();

        constructor() {}

        random() {
            return Math.floor(Math.random() * 1000);
        }
    }

    @Injectable()
    class TestInjectableB {
        constructor(public testInjectable: TestInjectableA) {}
    }

    @Injectable()
    class TestInjectableC {
        constructor(public testInjectable: TestInjectableA) {}
    }

    @Injectable()
    class TestInjectableD {
        constructor(@Inject('INJECT') public inject: string) {}
    }

    const FactoryProviderA: FactoryProvider = {
        provide: 'INJECTABLE_A',
        useFactory: () => {
            return new TestInjectableA();
        }
    };

    const FactoryProviderB: FactoryProvider = {
        provide: 'INJECTABLE_B',
        useFactory: (testInjectableA: TestInjectableA) => {
            return new TestInjectableC(testInjectableA);
        },
        deps: [TestInjectableA]
    };

    const FactoryProviderC: FactoryProvider = {
        provide: 'INJECT',
        useValue: 'i-am-injected'
    };

    const injectableRefA = registerProvider(TestInjectableA);
    const injectableRefB = registerProvider(TestInjectableB);
    const injectableRefD = registerProvider(TestInjectableD);

    const factoryProviderRefA = registerFactoryProvider(FactoryProviderA);
    const factoryProviderRefB = registerFactoryProvider(FactoryProviderB);
    const factoryProviderRefC = registerFactoryProvider(FactoryProviderC);

    const localProviders = {
        TestInjectableA: injectableRefA,
        TestInjectableB: injectableRefB,
        INJECTABLE_A: factoryProviderRefA,
        INJECTABLE_B: factoryProviderRefB,
        TestInjectableD: injectableRefD,
        INJECT: factoryProviderRefC
    };

    test('Can initialize providers', () => {
        const initializedA = new ProviderInitializer(
            localProviders,
            {},
            'TestModule'
        )['_initializeProvider'](injectableRefA);

        const initializedB = new ProviderInitializer(
            localProviders,
            {},
            'TestModule'
        )['_initializeProvider'](injectableRefB);

        const initializedD = new ProviderInitializer(
            localProviders,
            {},
            'TestModule'
        )['_initializeProvider'](injectableRefD);

        const initializedAFP = new ProviderInitializer(
            localProviders,
            {},
            'TestModule'
        )['_initializeFactoryProvider'](factoryProviderRefA);

        const initializedBFP = new ProviderInitializer(
            localProviders,
            {},
            'TestModule'
        )['_initializeFactoryProvider'](factoryProviderRefB);

        const initializedCFB = new ProviderInitializer(
            localProviders,
            {},
            'TestModule'
        )['_initializeFactoryProvider'](factoryProviderRefC);

        // console.log(initializedBFP);

        expect(initializedA.instance).toBeTruthy();
        expect(initializedB.instance).toBeTruthy();
        expect(initializedAFP.instance).toBeTruthy();
        expect(initializedB.instance['testInjectable']).toBeTruthy();
        expect(initializedBFP.instance).toBeTruthy();
        expect(initializedCFB.instance).toBeTruthy();
        expect(initializedD.instance).toBeTruthy();
        console.log(initializedD.instance);
        expect(initializedD.instance['inject']).toEqual('i-am-injected');
    });

    test('Does not initialize providers more than once', () => {
        const initializedProviders = new ProviderInitializer(
            localProviders,
            {},
            'TestModule'
        ).init();

        expect(
            initializedProviders['TestInjectableA'].instance['randomNumber']
        ).toEqual(
            initializedProviders['TestInjectableB'].instance['testInjectable']
                .randomNumber
        );
    });
});
