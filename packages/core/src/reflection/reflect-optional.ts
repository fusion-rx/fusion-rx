import { Type } from '../interface/type.js';
import { InjectableMetadataFacade } from './compiler-facade-interface.js';

/**
 * Reflects `@Optional()` parameter metadata into the
 * `deps` metadata of `type`.
 * @param type A class decorated with `@Injectable`
 * @param parameterIndex The index of the dep
 */
export const reflectOptional = (
    type: Type<InjectableMetadataFacade>,
    parameterIndex: number
) => {
    type.prototype.dependencies ??= [];

    if (!type.prototype.dependencies[parameterIndex]) {
        type.prototype.dependencies[parameterIndex] = {
            token: '',
            optional: true
        };
        return;
    }

    type.prototype.dependencies[parameterIndex].optional = true;
};
