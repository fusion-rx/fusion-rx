import { ErrorCode } from '../error/error-codes.js';
import { FsnError } from '../error/error.js';
import { FsnModule } from '../di/module.js';
import {
    FsnModuleMetadataFacade,
    InjectableMetadataFacade,
    M
} from './compiler-facade-interface.js';
import { RouterMetadataFacade } from '../router/router-facade-interface.js';
import { Type, isType } from '../interface/type.js';
import { isFactoryProvider } from '../di/factory-provider.js';
import { isModuleWithProviders } from '../di/module-with-provider.js';
import { reflectFactoryProvider } from './reflect-factory-provider.js';

/**
 * Reflects `@FsnModule` decorator metadata into the prototype of
 * classes decorated with `@FsnModule`.
 * @param type A class decorated with `@FsnModule`
 * @param meta Module options injected via the `@FsnModule` decorator
 */
export const reflectModule = (
    type: Type<FsnModuleMetadataFacade>,
    meta: Partial<FsnModule>
) => {
    const token = type?.prototype?.constructor?.name;

    if (!token) {
        throw new FsnError(ErrorCode.INVALID_MODULE);
    }

    type.prototype.token = token;
    type.prototype.imports = {};
    meta.imports?.forEach((imported) => {
        if (isType<FsnModuleMetadataFacade>(imported)) {
            type.prototype.imports[imported.prototype.token] = imported;
        } else if (isModuleWithProviders(imported)) {
            @FsnModule({
                imports: imported.imports,
                exports: imported.exports,
                providers: imported.providers,
                routes: imported.routes
            })
            class Module {}

            (<M>Module).prototype.token = imported.fsnModule.prototype.token;
            (<M>Module).prototype.constructor =
                imported.fsnModule.prototype.constructor;

            type.prototype.imports[imported.fsnModule.prototype.token] = <M>(
                Module
            );
        }
    });

    type.prototype.providers = {};
    meta.providers?.forEach((provider) => {
        if (isType<InjectableMetadataFacade>(provider)) {
            type.prototype.providers[
                provider.prototype.token ?? provider.prototype.constructor.name
            ] = provider;
        } else if (isFactoryProvider(provider)) {
            type.prototype.providers[provider.provide] =
                reflectFactoryProvider(provider);
        }
    });

    type.prototype.routes = {};
    meta.routes?.forEach((route) => {
        if (isType<RouterMetadataFacade>(route)) {
            type.prototype.routes[
                route.prototype.token ?? route.prototype.constructor.name
            ] = route;
        } else {
            throw new FsnError(ErrorCode.INVALID_ROUTE);
        }
    });

    type.prototype.exports = (meta.exports ?? []).map((exported, index) => {
        if (isType<InjectableMetadataFacade>(exported)) {
            const exportToken = exported.prototype.token;

            if (exportToken === undefined) {
                throw new FsnError(
                    ErrorCode.INVALID_EXPORT,
                    `Failed to resolve export from module ${token} at index ${index}.`
                );
            }

            return exportToken;
        } else if (isFactoryProvider(exported)) {
            return exported.provide;
        }

        throw new FsnError(
            ErrorCode.INVALID_PROVIDER,
            `A provider that is neither a class, ` +
                `decorated with @Injectable, or a FactoryProvider ` +
                `was detected in the 'providers' array at index ${index} of module ${token}.`
        );
    });

    return type;
};
