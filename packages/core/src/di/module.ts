import { FactoryProvider } from './factory-provider';
import { ModuleWithProviders } from './module-with-provider';
import { Type } from '../interface/type';
import { reflectModule } from '../reflection/reflect-module';

export declare interface FsnModule {
    providers: Array<Type<any> | FactoryProvider>;
    exports: Array<Type<any> | FactoryProvider>;
    imports: Array<Type<any> | ModuleWithProviders<any>>;
    routes: Array<Type<any>>;
}

/**
 * ## FsnModule
 *
 * **FsnModules** configure the injector and the compiler and help organize
 * related things together by promiting abstraction and informating hiding.
 *
 * A FsnModule is a class marked by the `@FsnModule` decorator. `@FsnModule`
 * accepts a metadata object that describes how to compile providers and routes.
 * It identifies the module's own routes, as well as its providers, making some
 * of them public though the `exports` property, so that external providers
 * can use them.
 *
 * @publicApi
 */
export const FsnModule =
    (fsnModule: Partial<FsnModule>) => (reference: Type<any>) => {
        reflectModule(reference, fsnModule);
    };
