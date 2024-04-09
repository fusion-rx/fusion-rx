import { Type } from '../interface';
import { FsnModule } from '../di/module';

export declare interface DependencyMetadataFacade {
    /** The dependency's class name or provided token */
    token: string;
    /** Whether the dependency is optional */
    optional?: boolean;
}

export type ReflectedInjectable = {
    /** The injectable's classname or token. */
    token: string;
    deps: DependencyMetadataFacade[];
    instance: any;
    providedIn: 'root' | 'module';
};

export type ReflectedRoute = ReflectedInjectable & {
    providedIn: 'module';
    baseUrl?: string;
    templateUrl?: string;
    template?: string;
};

export declare interface InjectableMetadataFacade {
    /** The class name or provided token */
    token: string;
    /** A reference to the uninitialized injectable */
    type?: Type<ReflectedInjectable>;
    /** The injection context of the injectable. */
    providedIn: 'root' | 'module' | null;
    /** Dependences injected into this constructor */
    dependencies?: DependencyMetadataFacade[];
    /** The initialized injectable or provided value */
    instance?: any;
    /** The factory provider */
    factory?: Function;
}

export declare type RouteMetadataFacade = InjectableMetadataFacade & {
    /** A reference to the uninitialized injectable */
    type: Type<ReflectedInjectable>;
    /** The injection context has to be root for modules. */
    providedIn: 'module';
};

export declare interface FsnModuleMetadataFacade {
    /** The name of the module. */
    name: string;
    /** A reference to the uninitialized module */
    type: Type<FsnModule>;
    /** The routes that this fsnModule declares */
    routes: Record<string, RouteMetadataFacade>;
    /** Injectables declared by this module. */
    providers: Record<string, InjectableMetadataFacade>;
    /** The names of injectables exported from this module. */
    exports: string[];
    /** The fsnModules that this module imports */
    imports: Record<string, Type<FsnModuleMetadataFacade>>;
}
