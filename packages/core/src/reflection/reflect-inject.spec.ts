import { DummyDecorator } from '../test/dummy-decorator.js';
import { Injectable } from '../di/injectable.js';
import { InjectableMetadataFacade } from './compiler-facade-interface.js';
import { Type } from '../interface/public-api.js';
import { reflectInject } from './reflect-inject.js';

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

type ReflectedInjectable = Type<InjectableMetadataFacade>;

describe('Injectable', () => {
    beforeAll(() => {
        reflectInject(<ReflectedInjectable>ImportService, valueToken, 0);
        reflectInject(
            <ReflectedInjectable>ImportService,
            nonInjectableToken,
            1
        );
        reflectInject(
            <ReflectedInjectable>ImportService,
            dynamicallyInjectedToken,
            2
        );
    });

    test('Can reflect dynamically injected dependencies', () => {
        expect(
            (<ReflectedInjectable>ImportService).prototype.dependencies.length
        ).toEqual(3);
        expect(
            (<ReflectedInjectable>ImportService).prototype.dependencies[0]
        ).toEqual({
            token: valueToken
        });
        expect(
            (<ReflectedInjectable>ImportService).prototype.dependencies[1]
        ).toEqual({
            token: nonInjectableToken
        });
        expect(
            (<ReflectedInjectable>ImportService).prototype.dependencies[2]
        ).toEqual({
            token: dynamicallyInjectedToken
        });
    });
});
