import { Type } from '../interface';
import { reflectOptional } from '../reflection/reflect-optional';

export const Optional =
    // @ts-ignore
    () => (target: Type<any>, arg1: any, parameterIndex: number) =>
        reflectOptional(target, parameterIndex);
