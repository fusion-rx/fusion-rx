import { Type } from '../interface/type.js';
import { reflectOptional } from '../reflection/reflect-optional.js';

/**
 * Decorate constructor parameters with `@Optional` to indicate
 * to the Fusion compiler that an injected provider is optional.
 *
 * @publicApi
 */
export const Optional =
    // @ts-ignore
    () => (target: Type<any>, arg1: any, parameterIndex: number) => {
        reflectOptional(target, parameterIndex);
    };
