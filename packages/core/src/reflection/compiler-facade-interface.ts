import { Type } from '../interface';
import { ReflectedDependency } from './reflected-interface';

export declare interface FsnModuleMetadataFacade {
    /** The name of the module. */
    token: string;
    /** The routes that this fsnModule declares */
    routes: Record<string, Type<RouteMetadataFacade>>;
    /** Injectables declared by this module. */
    providers: Record<string, Type<InjectableMetadataFacade>>;
    /** The names of injectables exported from this module. */
    exports: string[];
    /** The fsnModules that this module imports */
    imports: Record<string, Type<FsnModuleMetadataFacade>>;
}

export declare interface InjectableMetadataFacade {
    /** The class name or provided token */
    token: string;
    /** The injection context of the injectable. */
    providedIn: 'root' | 'module' | null;
    /** Dependences injected into this constructor */
    dependencies: ReflectedDependency[];
    /** The initialized injectable or provided value */
    instance?: any;
    /** The type provided by a factory provider. */
    value?: any;
}

export declare type RouteMetadataFacade = InjectableMetadataFacade & {
    /** The injection context has to be root for modules. */
    providedIn: 'module';
    baseUrl?: string;
    templateUrl?: string;
    template?: string;
};
