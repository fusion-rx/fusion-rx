import { FsnModuleMetadataFacade } from '../reflection/compiler-facade-interface';
import { FsnModule } from '../di/module';
import { Injectable } from '../di/injectable';
import { Inject } from '../di/inject';
import { bootstrap } from './bootstrap';
import { AfterAppInit, OnModuleInit } from './lifecycle';
import { ModuleWithProviders, Route } from '../di/public-api';
import { Observable } from 'rxjs';
import { Type } from '../interface/public-api';

describe('Fusion-rx Dependency Injection Reflection', () => {
    /** EXTERNAL MODULE */
    @Injectable()
    class ExternalNoDeps implements AfterAppInit, OnModuleInit {
        public afterAppInit = false;
        public onModuleInit = false;

        constructor() {}

        fsnAfterAppInit(): void {
            this.afterAppInit = true;
        }

        fsnOnModuleInit(): void {
            this.onModuleInit = true;
        }
    }
    @Injectable()
    class ExternalWithDeps {
        constructor(public testInjected: ExternalNoDeps) {}
    }
    @FsnModule({
        providers: [ExternalNoDeps, ExternalWithDeps],
        exports: [ExternalWithDeps]
    })
    class ExternalModule {}

    /** EXTERNAL DYNAMIC MODULE */

    class DynamicClass {}
    @Injectable()
    class DynamicInjectable {}
    @Injectable()
    class DynamicClassWithDeps {
        constructor(public testInjectable: DynamicInjectable) {}
    }
    @Injectable()
    class ExternalWithDynamicClassDep {
        constructor(
            @Inject('DYNAMIC_CLASS') public testInjected: ExternalNoDeps,
            @Inject('DYNAMIC_CLASS_DEP')
            public testInjected2: DynamicClassWithDeps
        ) {}
    }
    @FsnModule({
        providers: [
            ExternalWithDynamicClassDep,
            {
                provide: 'DYNAMIC_CLASS',
                useFactory: () => {
                    return new DynamicClass();
                }
            },
            DynamicClassWithDeps,
            DynamicInjectable,
            {
                provide: 'DYNAMIC_CLASS_DEP',
                useFactory: (arg: DynamicInjectable) => {
                    return new DynamicClassWithDeps(arg);
                },
                deps: [DynamicInjectable]
            }
        ]
    })
    class ExternalDynamicModule {}

    /** MODULE WITH PROVIDERS */

    @Injectable()
    class ModuleWithProvidersProvider {
        constructor() {}
    }

    @FsnModule({})
    class ModuleWithProvidersModule {
        static forRoot(): ModuleWithProviders<ModuleWithProvidersModule> {
            return {
                providers: [ModuleWithProvidersProvider],
                fsnModule: ModuleWithProvidersModule
            };
        }
    }

    /** ROOT MODULE */
    @Route({})
    class TestRoute {
        testEndpoint = new Observable<string>((subscriber) => {
            subscriber.next('Hello world');
            subscriber.complete();
        });
    }

    @Injectable()
    class StaticWithExternalDep {
        constructor(public externalWithDeps: ExternalWithDeps) {}
    }
    @Injectable()
    class StaticWithDeps {
        constructor(@Inject('STATIC_VAL') public myDynamicInjectable: string) {}
    }
    @FsnModule({
        imports: [
            ExternalModule,
            ExternalDynamicModule,
            ModuleWithProvidersModule.forRoot()
        ],
        providers: [
            {
                provide: 'STATIC_VAL',
                useValue: 'MyValue'
            },
            StaticWithDeps,
            StaticWithExternalDep
        ],
        routes: [TestRoute]
    })
    class RootModule {}

    let rootModule: Type<FsnModuleMetadataFacade>;

    beforeAll(() => {
        rootModule = bootstrap(RootModule);
    });

    test('Can initialize a root module', () => {
        expect(rootModule.prototype.token).toBeTruthy();
        expect(Object.keys(rootModule.prototype.providers).length).toEqual(3);
        expect(
            rootModule.prototype.providers['StaticWithDeps'].prototype.instance
        ).toBeTruthy();
        expect(rootModule.prototype.providers['STATIC_VAL']).toBeTruthy();
        expect(
            rootModule.prototype.providers['STATIC_VAL'].prototype.value
        ).toBeTruthy();
    });

    test('Can initialize imported module with dynamic class injection', () => {
        const externalModule =
            rootModule.prototype.imports['ExternalDynamicModule'];
        expect(externalModule).toBeTruthy();
        expect(
            externalModule.prototype.providers['ExternalWithDynamicClassDep']
        ).toBeTruthy();
        expect(
            externalModule.prototype.providers['ExternalWithDynamicClassDep']
                .prototype.instance
        ).toBeTruthy();
    });

    test('Invokes lifecycle hooks', () => {
        const externalNoDeps =
            rootModule.prototype.imports['ExternalModule'].prototype.providers[
                'ExternalNoDeps'
            ].prototype.instance;

        expect(externalNoDeps).toBeTruthy();
        expect(externalNoDeps['onModuleInit']).toEqual(true);
        expect(externalNoDeps['afterAppInit']).toEqual(true);
    });
});
