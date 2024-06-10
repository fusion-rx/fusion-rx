import { FsnModule, Inject, Injectable } from '../di/public-api.js';
import { FsnModuleMetadataFacade } from './compiler-facade-interface.js';
import { Type } from '../interface/public-api.js';
import { reflectModule } from './reflect-module.js';

describe('FsnModule Reflection', () => {
    @Injectable()
    class InjectableNoDeps {}

    @Injectable()
    class InjectableOneDep {
        constructor(public noDeps: InjectableNoDeps) {}
    }

    class DynamicClassNoDeps {}

    @Injectable()
    class DynamicClassWithDeps {
        constructor(public injectableNoDeps: InjectableNoDeps) {}
    }

    @Injectable()
    class InjectableDynamicDeps {
        constructor(
            @Inject('DEP_1') public staticValDep: string,
            @Inject('DEP_2') public dynamicClassNoDeps: DynamicClassNoDeps,
            @Inject('DEP_3') public dynamicClassWithDeps: DynamicClassWithDeps
        ) {}
    }

    class ModuleTest {}
    const moduleMetadata: Partial<FsnModule> = {
        providers: [
            InjectableNoDeps,
            DynamicClassWithDeps,
            InjectableDynamicDeps,
            InjectableOneDep,
            {
                provide: 'DEP_1',
                useValue: 'myTestValue'
            },
            {
                provide: 'DEP_2',
                useClass: DynamicClassNoDeps
            },
            {
                provide: 'DEP_3',
                useFactory: (
                    arg1: string,
                    arg2: DynamicClassNoDeps,
                    arg3: DynamicClassWithDeps
                ) => {
                    return new InjectableDynamicDeps(arg1, arg2, arg3);
                }
            }
        ],
        exports: [
            {
                provide: 'DEP_1',
                useValue: 'myTestValue'
            },
            {
                provide: 'DEP_2',
                useClass: DynamicClassNoDeps
            },
            {
                provide: 'DEP_3',
                useFactory: (
                    arg1: string,
                    arg2: DynamicClassNoDeps,
                    arg3: DynamicClassWithDeps
                ) => {
                    return new InjectableDynamicDeps(arg1, arg2, arg3);
                }
            },
            InjectableDynamicDeps
        ]
    };

    class ModuleImportTest {}
    const moduleImportTestMetadata: Partial<FsnModule> = {
        imports: [ModuleTest]
    };

    type ReflectedModule = Type<FsnModuleMetadataFacade>;

    beforeAll(() => {
        reflectModule(<ReflectedModule>ModuleTest, moduleMetadata);
        reflectModule(
            <ReflectedModule>ModuleImportTest,
            moduleImportTestMetadata
        );
    });

    test('Can relfect module providers', () => {
        expect(
            Object.keys((<ReflectedModule>ModuleTest).prototype.providers)
                .length
        ).toEqual(7);
        expect(
            (<ReflectedModule>ModuleTest).prototype.providers['DEP_2']
        ).toBeTruthy();
    });

    test('Can reflect module exports', () => {
        expect((<ReflectedModule>ModuleTest).prototype.exports.length).toEqual(
            4
        );
    });

    test('Can reflect module imports', () => {
        expect(
            Object.keys((<ReflectedModule>ModuleImportTest).prototype.imports)
                .length
        ).toEqual(1);
        expect(
            (<ReflectedModule>ModuleImportTest).prototype.imports['ModuleTest']
        ).toBeTruthy();
        expect(
            (<ReflectedModule>ModuleImportTest).prototype.imports['ModuleTest']
                .prototype.exports
        ).toBeTruthy();
    });
});
