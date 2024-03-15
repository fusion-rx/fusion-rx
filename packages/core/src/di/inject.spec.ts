import { boostrap } from '../application';
import { Inject } from './inject';
import { Injectable } from './injectable';
import { FsnModule } from './module';

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
@Injectable()
class DynamicInjectable {
    constructor(public dynamicallyInjected: DynamicallyInjected) {}

    returnDynamicVal() {
        return this.dynamicallyInjected.returnValue();
    }
}

@Injectable()
class ImportService {
    constructor(
        @Inject(valueToken) public myTestProvider: string,
        @Inject(nonInjectableToken)
        public myFactoryProvider: NonInjectableProvider,
        @Inject(dynamicallyInjectedToken)
        public dynamicallyInjected: DynamicInjectable
    ) {}
}

@FsnModule({
    providers: [
        ImportService,
        {
            provide: valueToken,
            useValue: 'myTestValue'
        },
        {
            provide: nonInjectableToken,
            useFactory: () => new NonInjectableProvider('thisIsMyValue')
        },
        {
            provide: dynamicallyInjectedToken,
            useFactory: (dynamicallyInected: DynamicallyInjected) =>
                new DynamicInjectable(dynamicallyInected),
            deps: [DynamicallyInjected]
        }
    ]
})
class MyModule {}

describe('Injectable', () => {
    test('Module', () => {
        const app = boostrap(MyModule);
        expect(
            app.providers['ImportService'].instance['myTestProvider']
        ).toEqual('myTestValue');
    });

    test('Dynamically injected', () => {
        const app = boostrap(MyModule);
        const importService: ImportService =
            app.providers['ImportService'].instance;
        expect(importService.dynamicallyInjected.returnDynamicVal()).toEqual(3);
    });
});
