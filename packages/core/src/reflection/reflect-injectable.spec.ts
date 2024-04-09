import { Type } from '../../interface';
import { DummyDecorator } from '../../test';
import { ReflectedInjectable } from '../compiler-facade-interface';
import { Inject } from '../inject';
import { reflectInjectable } from './reflect-injectable';

describe('FusionRx dependency reflection', () => {
    @DummyDecorator()
    class StaticNoDeps {}

    @DummyDecorator()
    class DynamicWithDeps {
        constructor(public myInjectable: StaticNoDeps) {}
    }

    @DummyDecorator()
    class DynamicNoDeps {
        constructor() {}
    }

    @DummyDecorator()
    class StaticWithDeps {
        constructor(
            @Inject('STATIC_VAL') public myDynamicInjectable: string,
            @Inject('DYNAMIC') public myDynamicClass: DynamicNoDeps,
            @Inject('DYNAMIC_W_DEPS')
            public myDynamicClassWithDeps: DynamicWithDeps
        ) {}
    }

    beforeAll(() => {
        reflectInjectable(<Type<ReflectedInjectable>>StaticNoDeps);
        reflectInjectable(<Type<ReflectedInjectable>>DynamicWithDeps);
        reflectInjectable(<Type<ReflectedInjectable>>StaticWithDeps);
    });

    test('Can reflect metadata for class with no injected dependencies', () => {
        expect(
            (<Type<ReflectedInjectable>>StaticNoDeps).prototype.instance
        ).toBeTruthy();
    });

    test('Can reflect metadata for class with injected dependencies', () => {
        expect(
            (<Type<ReflectedInjectable>>DynamicWithDeps).prototype.deps.length
        ).toEqual(1);
        expect(
            (<Type<ReflectedInjectable>>DynamicWithDeps).prototype.deps[0].token
        ).toEqual('StaticNoDeps');
    });

    test('Can reflect metadata for class with multiple dynamically injected deps', () => {
        expect(
            (<Type<ReflectedInjectable>>StaticWithDeps).prototype.deps.length
        ).toEqual(3);
        expect(
            (<Type<ReflectedInjectable>>StaticWithDeps).prototype.deps[0].token
        ).toEqual('STATIC_VAL');
    });
});
