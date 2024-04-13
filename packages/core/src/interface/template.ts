import { RouteMethod, RouteParamsDef } from '../di';
import { Type } from './type';

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
