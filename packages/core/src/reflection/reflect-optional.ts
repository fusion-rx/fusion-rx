import { Type } from '../interface';
import { ReflectedInjectable } from './reflected-interface';

/**
 * Reflects `@Optional()` parameter metadata into the
 * `deps` metadata of `type`.
 * @param type A class decorated with `@Injectable`
 * @param parameterIndex The index of the dep
 */
export const reflectOptional = (
    type: Type<ReflectedInjectable>,
    parameterIndex: number
) => {
    type.prototype.deps ??= [];

    if (!type.prototype.deps[parameterIndex]) {
        type.prototype.deps[parameterIndex] = { token: '', optional: true };
        return;
    }

    type.prototype.deps[parameterIndex].optional = true;
};
