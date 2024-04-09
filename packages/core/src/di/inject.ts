import { Type } from '../interface';
import { reflectInject } from '../reflection/reflect-inject';

export const Inject = (provider: string) => {
    // @ts-ignore
    return (target: Type<any>, arg1: any, parameterIndex: number) =>
        reflectInject(target, provider, parameterIndex);
};
