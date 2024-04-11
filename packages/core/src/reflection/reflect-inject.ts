import { InjectableMetadataFacade } from './compiler-facade-interface';
import { Type } from '../interface';

/**
 * Reflects dependencies directly injected with `@Inject()`
 * into the `deps` metadata of `type`.
 * @param type A class decorated with `@Injectable`
 * @param token A token provided to the `@Inject()` decorator
 * @param parameterIndex The index of the dep
 */
export const reflectInject = (
    type: Type<InjectableMetadataFacade>,
    token: string,
    parameterIndex: number
) => {
    type.prototype.dependencies ??= [];

    if (!type.prototype.dependencies[parameterIndex]) {
        type.prototype.dependencies[parameterIndex] = { token };
        return;
    }

    type.prototype.dependencies[parameterIndex].token = token;
};
