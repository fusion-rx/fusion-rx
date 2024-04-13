import { Type, RouteTemplate } from '../interface';
import { ReflectedDependency } from './reflected-interface';
import { RouteMethod, RouteParamsDef, RouteProvider } from '../di';

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

export declare type RegisteredRouteMetadataFacade = {
    /** The method of the route. */
    method: RouteMethod;

    /** The route path. */
    path: string;

    /** The express parts that will be given to the method */
    provide: RouteProvider[];

    /** Type definition for parsing the url params */
    urlParamsDef?: RouteParamsDef;

    /** Type definition for parsing the query params */
    queryParamsDef?: RouteParamsDef;
};

export declare type RouteMetadataFacade = InjectableMetadataFacade & {
    /** The injection context has to be root for modules. */
    providedIn: 'module';

    /** The base URL for all the endpoints in this route. */
    baseUrl: string;

    /** The route definitions. */
    template: RouteTemplate<any>;

    /** Endpoints registered in this route. */
    registered: {
        [handlerName: string]: RegisteredRouteMetadataFacade;
    };
};
