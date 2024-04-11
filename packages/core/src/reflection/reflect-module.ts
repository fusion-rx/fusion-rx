import { FsnModule } from '../di/module';
import { Type, isType } from '../interface';
import { ErrorCode, FsnError } from '../application/error-codes';
import { isFactoryProvider } from '../di/factory-provider';
import {
    FsnModuleMetadataFacade,
    InjectableMetadataFacade,
    RouteMetadataFacade
} from './compiler-facade-interface';
import { isModuleWithProviders } from '../di/module-with-provider';
import { reflectFactoryProvider } from './reflect-factory-provider';

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
            const fsnModule: Type<FsnModuleMetadataFacade> = imported.fsnModule;
            reflectModule(fsnModule, {
                exports: imported.exports,
                imports: imported.imports,
                providers: imported.providers,
                routes: imported.routes
            });
            type.prototype.imports[fsnModule.prototype.token] = fsnModule;
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

    type.prototype.routes = {};
    meta.routes?.forEach((route) => {
        if (isType<RouteMetadataFacade>(route)) {
            type.prototype.routes[route.prototype.token] = route;
        }
    });
};
