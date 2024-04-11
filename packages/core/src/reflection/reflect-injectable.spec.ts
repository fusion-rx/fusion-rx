import { Type } from '../interface';
import { DummyDecorator } from '../test';
import { Inject } from '../di/inject';
import { reflectInjectable } from './reflect-injectable';
import { InjectableMetadataFacade } from './compiler-facade-interface';

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

    type ReflectedInjectable = Type<InjectableMetadataFacade>;

    beforeAll(() => {
        reflectInjectable(<ReflectedInjectable>StaticNoDeps);
        reflectInjectable(<ReflectedInjectable>DynamicWithDeps);
        reflectInjectable(<ReflectedInjectable>StaticWithDeps);
    });

    test('Can reflect metadata for class with no injected dependencies', () => {
        expect(
            (<ReflectedInjectable>StaticNoDeps).prototype.instance
        ).toBeTruthy();
    });

    test('Can reflect metadata for class with injected dependencies', () => {
        expect(
            (<ReflectedInjectable>DynamicWithDeps).prototype.dependencies.length
        ).toEqual(1);
        expect(
            (<ReflectedInjectable>DynamicWithDeps).prototype.dependencies[0]
                .token
        ).toEqual('StaticNoDeps');
    });

    test('Can reflect metadata for class with multiple dynamically injected deps', () => {
        expect(
            (<ReflectedInjectable>StaticWithDeps).prototype.dependencies.length
        ).toEqual(3);
        expect(
            (<ReflectedInjectable>StaticWithDeps).prototype.dependencies[0]
                .token
        ).toEqual('STATIC_VAL');
    });
});
