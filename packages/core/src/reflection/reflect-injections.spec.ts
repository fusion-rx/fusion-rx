import { DummyDecorator } from '../../test';
import { reflectInjections } from './reflect-injections';
import { Type } from '../../interface';
import { ReflectedInjectable } from '../compiler-facade-interface';
import { Inject } from '../inject';

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

    beforeAll(() => {
        reflectInjections(<Type<ReflectedInjectable>>NoDeps);
        reflectInjections(<Type<ReflectedInjectable>>HasDeps);
        reflectInjections(<Type<ReflectedInjectable>>HasDynamicDep);
        reflectInjections(<Type<ReflectedInjectable>>DynamicClass);
        reflectInjections(<Type<ReflectedInjectable>>HasDynamicClass);
    });

    test('Can reflect class with no injections', () => {
        expect(
            (<Type<ReflectedInjectable>>NoDeps).prototype.deps.length
        ).toEqual(0);
    });

    test('Can reflect class with injections', () => {
        expect(
            (<Type<ReflectedInjectable>>HasDeps).prototype.deps.length
        ).toEqual(1);
        expect(
            (<Type<ReflectedInjectable>>HasDeps).prototype.deps[0].token
        ).toEqual('NoDeps');
    });

    test('Can reflect class with dynamic injections', () => {
        expect(
            (<Type<ReflectedInjectable>>HasDynamicClass).prototype.deps.length
        ).toEqual(1);
        expect(
            (<Type<ReflectedInjectable>>HasDynamicClass).prototype.deps[0].token
        ).toEqual('MY_DYNAMIC_CLASS');
    });

    test('Can reflect class with dynamic class injections', () => {
        expect(
            (<Type<ReflectedInjectable>>HasDynamicDep).prototype.deps.length
        ).toEqual(1);
        expect(
            (<Type<ReflectedInjectable>>HasDynamicDep).prototype.deps[0].token
        ).toEqual('MY_DYNAMIC_VAL');
    });
});
