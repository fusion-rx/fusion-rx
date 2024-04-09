import { applyColorFromTags } from '@fusion-rx/shared';
import { Type } from '../../interface';
import { DummyDecorator } from '../../test';
import { FsnModuleMetadataFacade } from '../compiler-facade-interface';
import { FsnModule } from '../module';
import { reflectModule } from './reflect-module';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Injectable } from '../injectable';
import { Inject } from '../inject';

console.log(
    applyColorFromTags(
        readFileSync(join(__dirname, 'reflection.spec.txt'), 'utf-8'),
        'Red',
        true
    )
);

describe('Fusion-rx Dependency Injection Reflection', () => {
    /** EXTERNAL MODULE */

    @Injectable()
    class ExternalNoDeps {
        constructor() {}
    }

    @Injectable()
    class ExternalWithDeps {
        constructor(public testInjected: ExternalNoDeps) {}
    }

    @DummyDecorator()
    class ExternalModule {}
    const externalModuleMetadata: Partial<FsnModule> = {
        providers: [ExternalNoDeps, ExternalWithDeps],
        exports: [ExternalWithDeps]
    };

    /** ROOT MODULE */

    @Injectable()
    class StaticWithExternalDep {
        constructor(public externalWithDeps: ExternalWithDeps) {}
    }

    @Injectable()
    class StaticWithDeps {
        constructor(@Inject('STATIC_VAL') public myDynamicInjectable: string) {}
    }

    @DummyDecorator()
    class RootModule {}
    const rootModuleMetadata: Partial<FsnModule> = {
        imports: [ExternalModule],
        providers: [
            {
                provide: 'STATIC_VAL',
                useValue: 'MyValue'
            },
            StaticWithDeps,
            StaticWithExternalDep
        ]
    };

    beforeAll(() => {
        reflectModule(
            ExternalModule as Type<FsnModuleMetadataFacade>,
            externalModuleMetadata
        );
        reflectModule(
            RootModule as Type<FsnModuleMetadataFacade>,
            rootModuleMetadata
        );
    });

    test('Can initialize simple module', () => {
        expect(
            (<Type<FsnModuleMetadataFacade>>RootModule).prototype.name
        ).toBeTruthy();
    });
});
