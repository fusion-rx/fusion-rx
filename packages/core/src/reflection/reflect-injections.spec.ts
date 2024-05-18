import { DummyDecorator } from '../test';
import { reflectInjections } from './reflect-injections';
import { Type } from '../interface/public-api';
import { Inject } from '../di/inject';
import { InjectableMetadataFacade } from './compiler-facade-interface';

describe('Reflect Injections', () => {
    @DummyDecorator()
    class NoDeps {}

    @DummyDecorator()
    class HasDeps {
        constructor(public noDeps: NoDeps) {}
    }

    const MY_DYNAMIC_VAL = 'MY_DYNAMIC_VAL';

    @DummyDecorator()
    class HasDynamicDep {
        constructor(@Inject(MY_DYNAMIC_VAL) public myDynamicVal: string) {}
    }

    @DummyDecorator()
    class DynamicClass {}

    const MY_DYNAMIC_CLASS = 'MY_DYNAMIC_CLASS';

    @DummyDecorator()
    class HasDynamicClass {
        constructor(
            @Inject(MY_DYNAMIC_CLASS) public myDynamicVal: DynamicClass
        ) {}
    }

    type ReflectedInjectable = Type<InjectableMetadataFacade>;

    beforeAll(() => {
        reflectInjections(<ReflectedInjectable>NoDeps);
        reflectInjections(<ReflectedInjectable>HasDeps);
        reflectInjections(<ReflectedInjectable>HasDynamicDep);
        reflectInjections(<ReflectedInjectable>DynamicClass);
        reflectInjections(<ReflectedInjectable>HasDynamicClass);
    });

    test('Can reflect class with no injections', () => {
        expect(
            (<ReflectedInjectable>NoDeps).prototype.dependencies.length
        ).toEqual(0);
    });

    test('Can reflect class with injections', () => {
        expect(
            (<ReflectedInjectable>HasDeps).prototype.dependencies.length
        ).toEqual(1);
        expect(
            (<ReflectedInjectable>HasDeps).prototype.dependencies[0].token
        ).toEqual('NoDeps');
    });

    test('Can reflect class with dynamic injections', () => {
        expect(
            (<ReflectedInjectable>HasDynamicClass).prototype.dependencies.length
        ).toEqual(1);
        expect(
            (<ReflectedInjectable>HasDynamicClass).prototype.dependencies[0]
                .token
        ).toEqual('MY_DYNAMIC_CLASS');
    });

    test('Can reflect class with dynamic class injections', () => {
        expect(
            (<ReflectedInjectable>HasDynamicDep).prototype.dependencies.length
        ).toEqual(1);
        expect(
            (<ReflectedInjectable>HasDynamicDep).prototype.dependencies[0].token
        ).toEqual('MY_DYNAMIC_VAL');
    });
});
