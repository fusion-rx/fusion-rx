import { S } from './subscribe.js';
import { Type } from '../../interface/type.js';

export declare type MS = Type<MicroserviceMetadataFacade>;

declare type MicroserviceMetadataFacade = {
    host: string;
    port: number;
    subscribers: S[];
};

const reflectMicroservice = (
    router: Type<MicroserviceMetadataFacade>,
    facade: Microservice
) => {
    router.prototype.host = facade.host ?? '0.0.0.0';
    router.prototype.port = facade.port ?? 4000;
    router.prototype.subscribers = <S[]>facade.subscribers;
};

export interface Microservice {
    host?: string;
    port?: number;
    subscribers: any[];
}

export const Microservice = (options: Microservice) => {
    return (type: any) => {
        reflectMicroservice(type, options);
    };
};
