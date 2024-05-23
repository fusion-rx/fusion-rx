import { Observable } from 'rxjs';
import { FsnReq, FsnRes } from './router.js';

export declare type RequestDef = {
    urlParams?: any;
    queryParams?: any;
};

export declare type RequestDefWithBody = RequestDef & {
    body?: any;
};

export declare type RequestHandler<T extends RequestDef> = (
    providers: {
        urlParams: T['urlParams'];
        queryParams: T['queryParams'];
    },
    req: FsnReq,
    res: FsnRes
) => Observable<any> | Promise<any> | any;

export declare type RequestHandlerWithBody<T extends RequestDefWithBody> = (
    providers: {
        urlParams: T['urlParams'];
        queryParams: T['queryParams'];
        body: T['body'];
    },
    req: FsnReq,
    res: FsnRes
) => Observable<any> | Promise<any> | any;

export declare type ParamType =
    | 'string'
    | 'boolean'
    | 'number'
    | 'array'
    | 'string[]'
    | 'number[]'
    | 'boolean[]'
    | '_string'
    | '_boolean'
    | '_number'
    | '_array'
    | '_string[]'
    | '_number[]'
    | '_boolean[]';

export declare type RequestProviders<U = any, Q = any, B = any> = {
    cookies: Record<string, any>;
    headers: Record<string, any> | string[];
    rawHeaders: string[];
    hostname: string;
    httpVersion: string;
    urlParams: U;
    queryParams: Q;
    body?: B;
};
