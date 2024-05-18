import { Type } from '../interface/type.js';
import { reflectInject } from '../reflection/reflect-inject.js';

/**
 * Decorate constructor parameters with `@Inject` to inject
 * FactoryProviders into classes decorated with `@Injectable`.
 * @param provider The injection token of a dynamic provider
 *
 * @publicApi
 */
export const Inject = (provider: string) => {
    // @ts-ignore
    return (target: Type<any>, arg1: any, parameterIndex: number) =>
        reflectInject(target, provider, parameterIndex);
};
