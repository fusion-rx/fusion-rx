import { ErrorCode, FsnError } from '../application/error-codes';
import { Injectable } from '../di/injectable';
import { InjectableMetadataFacade } from './compiler-facade-interface';
import { Type } from '../interface';
import { reflectInjections } from './reflect-injections';

/**
 * Reflects `@Injectable` decorator metadata into the prototype of
 * classes decorated with `@Injectable`.
 * @param type A class decorated with `@Injectable`
 * @param meta Injectable options injected via the `@Injectable` decorator
 */
export const reflectInjectable = (
    type: Type<InjectableMetadataFacade>,
    meta?: Injectable
): void => {
    // Derive the class name (its 'token') from `type`
    const token = type?.prototype?.constructor?.name;

    // If we can't resolve the class name then this is an invalid
    // injectable, so we have to error.
    if (!token) {
        throw new FsnError(
            ErrorCode.DERIVE_INJECTABLE_TOKEN,
            `Failed to initialize `
        );
    }

    reflectInjections(type);

    type.prototype.token = token;
    type.prototype.instance =
        type.prototype.dependencies.length === 0 ? new type() : undefined;
    type.prototype.providedIn = meta?.providedIn ?? 'module';
};
