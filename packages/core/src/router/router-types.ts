import { Observable } from 'rxjs';
import { Request as ɵRequest, Response as ɵResponse } from 'express';

/** An alias for express `Request` objects. */
export declare type FsnRequest = ɵRequest;
/** An alias for express `Request` objects. */
export declare type FsnReq = ɵRequest;
/** An alias for express `Response` objects. */
export declare type FsnResponse = ɵResponse;
/** An alias for express `Response` objects. */
export declare type FsnRes = ɵResponse;
/** Http methods. */
export declare type HttpMethod = 'delete' | 'get' | 'put' | 'post' | 'patch';

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

export declare type RouterProviders<U = any, Q = any, B = any> = {
    cookies: Record<string, any>;
    headers: Record<string, any> | string[];
    rawHeaders: string[];
    hostname: string;
    httpVersion: string;
    urlParams: U;
    queryParams: Q;
    body?: B;
};

export const HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
};
