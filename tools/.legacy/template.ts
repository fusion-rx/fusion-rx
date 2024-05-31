import { RouteMethod, RouteParamsDef } from '../../packages/core/src/di';
import { Type } from '../../packages/core/src/interface/type';

export declare interface RouteTemplate<T extends Type<any>> {
    [path: string]: {
        method: RouteMethod;
        guard?: Type<any>;
        handler: keyof T['prototype'];
        params?: RouteParamsDef;
        query?: RouteParamsDef;
    };
}

export declare interface Provide {}
