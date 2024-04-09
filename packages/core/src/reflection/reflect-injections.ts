import { getMetadata } from '@fusion-rx/shared';

import { ErrorCode, FsnError } from '../application/error-codes';
import { PARAM_TYPES } from './metadata-keys';
import { ReflectedInjectable } from './compiler-facade-interface';
import { Type, isType } from '../interface';

/**
 * Extracts dependencies injected into an injectable's constructor and
 * reflects them into the metadata of `type`.
 * @param type A class decorated with `@Injectable`
 * @returns An array of `reference`'s injected tokens, or an empty array.
 */
export const reflectInjections = (type: Type<ReflectedInjectable>): void => {
    type.prototype.deps ??= [];

    getMetadata<(Type | null)[]>(PARAM_TYPES, type, []).forEach(
        (dep, index) => {
            // If this dependency has already been defined in `type`'s prototype
            // then it is either a dynamic dependency, or it has been marked
            // as optional
            if (type.prototype.deps[index]) {
                // If this dep is dynamic or optional, there's a chance its
                // token name hasn't been defined
                if (type.prototype.deps[index].token.length === 0 && dep) {
                    type.prototype.deps[index].token =
                        dep.prototype.constructor.name;
                }

                return;
            }

            // If this dependency hasn't already been defined, then
            // it has to be a `Type` so we can get its metadata
            if (!isType(dep)) {
                throw new FsnError(
                    ErrorCode.INVALID_INJECTABLE,
                    `Failed to resolve injectable at index ${index} of ${type.prototype.token}.`
                );
            }

            // At this point, we know that the dep hasn't already been defined
            // and that it is a `Type`
            type.prototype.deps[index] = {
                token: dep.prototype.constructor.name
            };
        }
    );
};
