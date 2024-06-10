/**
 * Defines contracts for communcation between a gateway and microservice.
 *
 * @publicApi
 */
export declare interface Contract<T_Req = any, T_Res = any, T_cmd = string> {
    cmd: T_cmd;
    req: T_Req;
    res: T_Res;
}

/**
 * Provides an interface for internal communication between a gateway
 * and a microservice.
 */
export declare interface Message<T = any> {
    cmd: string;
    reqKey: string;
    data?: T;
    complete?: boolean;
    error?: any;
}
