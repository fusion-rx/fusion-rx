import { reflectRegister } from '../../packages/core/src/reflection/reflect-register';
import { RouteMetadataFacade } from '../../packages/core/src/reflection/compiler-facade-interface';
import { Ctor } from '../../packages/core/src/interface';

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
        reflectRegister(
            <Ctor<RouteMetadataFacade>>type,
            propertyKey,
            routeDetails
        );
