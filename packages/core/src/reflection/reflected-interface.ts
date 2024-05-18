import { FactoryProvider } from '../di/factory-provider.js';
import { ModuleWithProviders } from '../di/module-with-provider.js';
import { Type } from '../interface/type.js';

/**
 * Metadata reflected into the prototype of classes
 * decorated with `@Module`
 */
export type ReflectedFsnModule = {
    token: string;
    imports: Array<Type<ReflectedFsnModule> | ModuleWithProviders<any>>;
    providers: Array<Type<ReflectedInjectable> | FactoryProvider>;
    exports: Array<string>;
    routes: Array<Type<ReflectedRoute>>;
};

/**
 * Metadata reflected into the prototype of classes
 * decorated with `@Injectable`.
 */
export type ReflectedInjectable = {
    /** The injectable's classname or token. */
    token: string;
    deps: ReflectedDependency[];
    instance: any;
    providedIn: 'root' | 'module';
};

/**
 * Metadata reflected into the `deps` value of the prototype
 * of classes decorated with `@Injectable` and FactoryProviders
 */
export declare interface ReflectedDependency {
    /** The dependency's class name or provided token */
    token: string;
    /** Whether the dependency is optional */
    optional?: boolean;
}

/**
 * Metadata reflected into the prototype of classes
 * decorated with `@Route`.
 */
export type ReflectedRoute = ReflectedInjectable & {
    providedIn: 'module';
    baseUrl?: string;
    templateUrl?: string;
    template?: string;
};
