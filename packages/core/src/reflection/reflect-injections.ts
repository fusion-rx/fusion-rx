import { getMetadata } from '@fusion-rx/shared';

import { ErrorCode, FsnError } from '../application/error-codes';
import { InjectableMetadataFacade } from './compiler-facade-interface';
import { PARAM_TYPES } from './metadata-keys';
import { Type, isType } from '../interface';

/**
 * Reflects dependency injection metadata into the prototype of
 * classes decorated with `@Injectable`.
 * @param type A class decorated with `@Injectable`
 * @returns An array of `reference`'s injected tokens, or an empty array.
 */
export const reflectInjections = (
    type: Type<InjectableMetadataFacade>
): void => {
    type.prototype.dependencies ??= [];

    getMetadata<(Type | null)[]>(PARAM_TYPES, type, []).forEach(
        (dep, index) => {
            if (!dep) {
                throw new FsnError(
                    ErrorCode.INVALID_INJECTABLE,
                    `Failed to resolve injectable at index ${index} of ${type.prototype.token}.`
                );
            }

            if (!isType(dep)) {
                throw new FsnError(
                    ErrorCode.INVALID_INJECTABLE,
                    `Failed to resolve injectable at index ${index} of ${type.prototype.token}.`
                );
            }

            if (!type.prototype.dependencies[index]) {
                type.prototype.dependencies[index] = {
                    token: dep.prototype.constructor.name
                };

                return;
            }

            if (type.prototype.dependencies[index].token.length === 0) {
                type.prototype.dependencies[index].token =
                    dep.prototype.constructor.name;
            }
        }
    );
};
