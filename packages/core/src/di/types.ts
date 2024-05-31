import { Ctor } from '../public-api.js';

export declare type Descriptor = {
    value: Function;
    writable: boolean;
    enumerable: boolean;
    configurable: boolean;
};

export declare type FunctionDecorator = (
    prototype: any,
    propertyKey: string,
    descriptor: Descriptor
) => void;

export declare type ParameterDecorator = (
    prototype: Ctor<any>,
    functionName: string,
    argIndex: number
) => void;
