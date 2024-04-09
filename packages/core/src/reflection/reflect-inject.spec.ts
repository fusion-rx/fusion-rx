import { Type } from '../../interface';
import { DummyDecorator } from '../../test';
import { ReflectedInjectable } from '../compiler-facade-interface';
import { Injectable } from '../injectable';
import { reflectInject } from './reflect-inject';

const valueToken = 'VALUE_TOKEN';

const nonInjectableToken = 'NON_INJECTABLE';
class NonInjectableProvider {
    constructor(public myVal: string) {}
}

@Injectable()
class DynamicallyInjected {
    constructor() {}

    returnValue() {
        return 3;
    }
}

const dynamicallyInjectedToken = 'DYNAMICALLY_INJECTED';
@DummyDecorator()
class DynamicInjectable {
    constructor(public dynamicallyInjected: DynamicallyInjected) {}

    returnDynamicVal() {
        return this.dynamicallyInjected.returnValue();
    }
}

@DummyDecorator()
class ImportService {
    constructor(
        public myTestProvider: string,
        public myFactoryProvider: NonInjectableProvider,
        public dynamicallyInjected: DynamicInjectable
    ) {}
}

describe('Injectable', () => {
    beforeAll(() => {
        reflectInject(<Type<ReflectedInjectable>>ImportService, valueToken, 0);
        reflectInject(
            <Type<ReflectedInjectable>>ImportService,
            nonInjectableToken,
            1
        );
        reflectInject(
            <Type<ReflectedInjectable>>ImportService,
            dynamicallyInjectedToken,
            2
        );
    });

    test('Can reflect dynamically injected dependencies', () => {
        expect(
            (<Type<ReflectedInjectable>>ImportService).prototype.deps.length
        ).toEqual(3);
        expect(
            (<Type<ReflectedInjectable>>ImportService).prototype.deps[0]
        ).toEqual({
            token: valueToken
        });
        expect(
            (<Type<ReflectedInjectable>>ImportService).prototype.deps[1]
        ).toEqual({
            token: nonInjectableToken
        });
        expect(
            (<Type<ReflectedInjectable>>ImportService).prototype.deps[2]
        ).toEqual({
            token: dynamicallyInjectedToken
        });
    });

    test('Dynamically injected', () => {});
});
