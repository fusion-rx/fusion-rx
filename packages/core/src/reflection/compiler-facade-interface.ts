import { ReflectedDependency } from './reflected-interface.js';
import { RouterMetadataFacade } from '../router/router-facade-interface.js';
import { Type } from '../interface/type.js';

export declare interface FsnModuleMetadataFacade {
    /** The name of the module. */
    token: string;
    /** Injectables declared by this module. */
    providers: Record<string, Type<InjectableMetadataFacade>>;
    /** The routes that this module declares. */
    routes: Record<string, Type<RouterMetadataFacade>>;
    /** The names of injectables exported from this module. */
    exports: string[];
    /** The fsnModules that this module imports */
    imports: Record<string, Type<FsnModuleMetadataFacade>>;
}

/** Alias for Type<FsnModuleMetadataFacade> */
export declare type M = Type<FsnModuleMetadataFacade>;

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

/** Alias for Type<InjectableMetadataFacade> */
export declare type I = Type<InjectableMetadataFacade>;
