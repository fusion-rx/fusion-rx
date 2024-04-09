import { ReflectedInjectable } from './compiler-facade-interface';
import { Type } from '../interface';

/**
 * Reflects dependencies directly injected with `@Inject()`
 * into the `deps` metadata of `type`.
 * @param type A class decorated with `@Injectable`
 * @param token A token provided to the `@Inject()` decorator
 * @param parameterIndex The index of the dep
 */
export const reflectInject = (
    type: Type<ReflectedInjectable>,
    token: string,
    parameterIndex: number
) => {
    type.prototype.deps ??= [];

    if (!type.prototype.deps[parameterIndex]) {
        type.prototype.deps[parameterIndex] = { token };
        return;
    }

    type.prototype.deps[parameterIndex].token = token;
};
