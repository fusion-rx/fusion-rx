import { Type } from '../interface/type.js';
import { ReflectedDependency } from './reflected-interface.js';

export declare interface FsnModuleMetadataFacade {
    /** The name of the module. */
    token: string;
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
