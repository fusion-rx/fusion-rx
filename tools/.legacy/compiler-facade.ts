// export declare type RegisteredRouteMetadataFacade = {
//     /** The method of the route. */
//     method: RouteMethod;

//     /** The route path. */
//     path: string;

//     /** The express parts that will be given to the method */
//     provide: RouteProvider[];

//     /** Type definition for parsing the url params */
//     urlParamsDef?: RouteParamsDef;

//     /** Type definition for parsing the query params */
//     queryParamsDef?: RouteParamsDef;
// };

// export declare type RouteMetadataFacade = InjectableMetadataFacade & {
//     /** The injection context has to be root for modules. */
//     providedIn: 'module';

//     /** The base URL for all the endpoints in this route. */
//     baseUrl: string;

//     /** The route definitions. */
//     template: RouteTemplate<any>;

//     /** Endpoints registered in this route. */
//     registered: {
//         [handlerName: string]: RegisteredRouteMetadataFacade;
//     };
// };
