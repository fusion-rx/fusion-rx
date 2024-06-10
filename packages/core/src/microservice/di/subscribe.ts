import { Ctor, Type } from '../../interface/type.js';

export declare type S = Type<SubscriberMetadataFacade>;

export declare type SubscriberMetadataFacade = {
    token: string;
    cmds: {
        [command: string]: string;
    };
};

const reflectSubscribe = (
    routeCtor: SubscriberMetadataFacade,
    cmd: string,
    fnName: string
) => {
    routeCtor ??= <SubscriberMetadataFacade>{};
    routeCtor.cmds ??= {};
    routeCtor.cmds[cmd] = fnName;
};

/**
 * Registers a microservice endpoint.
 * @param cmd The microservice endpoint path
 *
 * @publicApi
 */
export function Subscribe(cmd: string) {
    return (routeCtor: Ctor<any>, propertyKey: string) => {
        reflectSubscribe(routeCtor, cmd, propertyKey);
    };
}

const reflectSubscriber = (type: Type<SubscriberMetadataFacade>) => {
    type.prototype.token = type.prototype.constructor.name;
};

export function Subscriber() {
    return (type: Type<any>) => {
        reflectSubscriber(type);
    };
}
