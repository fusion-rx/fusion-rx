import { reflectRouteRegistration } from '../reflection/reflect-route-registration';
import { RouteMetadataFacade } from '../reflection/compiler-facade-interface';
import { Ctor } from '../interface';

export declare type RouteMethod =
    | 'all'
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'patch'
    | 'options'
    | 'head';

export declare type RouteProvider =
    | 'request'
    | 'req'
    | 'response'
    | 'res'
    | 'body'
    | 'query'
    | 'params'
    | 'headers'
    | 'rawHeaders';

export declare type RouteParamType =
    | 'string'
    | 'number'
    | 'float'
    | 'boolean'
    | 'string[]'
    | 'number[]'
    | 'float[]'
    | 'boolean[]'
    | 'Date'
    | 'DateTz';

export declare type RouteParamsDef = {
    [paramName: string]:
        | RouteParamType
        | {
              type: RouteParamType;
              optional: true;
          };
};

export declare type Provider = {
    provide: RouteProvider[];
    paramsDef: RouteParamsDef;
    queryDef: RouteParamsDef;
};

export declare type Register = {
    method: RouteMethod;
    path: string | string[];
};

export const Register =
    (routeDetails: Register & Partial<Provider>) =>
    (type: any, propertyKey: string) =>
        reflectRouteRegistration(
            <Ctor<RouteMetadataFacade>>type,
            propertyKey,
            routeDetails
        );
