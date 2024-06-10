import { ErrorCode } from '../error/error-codes.js';
import { FactoryProvider } from '../di/factory-provider.js';
import { FsnError } from '../error/error.js';
import { InjectableMetadataFacade } from './compiler-facade-interface.js';
import { Type, isType } from '../interface/type.js';

export const reflectFactoryProvider = (provider: FactoryProvider) => {
    let factoryProviderClass: Type<InjectableMetadataFacade>;

    if (provider.useClass) {
        factoryProviderClass = provider.useClass;
    } else {
        factoryProviderClass = <Type<InjectableMetadataFacade>>class {};

        if (provider.useValue) {
            factoryProviderClass.prototype.value = provider.useValue;
        }

        if (provider.useFactory) {
            factoryProviderClass.prototype.constructor = provider.useFactory;
        }

        if (provider.deps) {
            factoryProviderClass.prototype.dependencies = (
                provider.deps ?? []
            ).map((dependency, index) => {
                if (isType<InjectableMetadataFacade>(dependency)) {
                    return {
                        token: dependency.prototype.token
                    };
                }

                throw new FsnError(
                    ErrorCode.INVALID_INJECTABLE,
                    `Factory provider ${provider.provide} includes an ` +
                        `invalid dependency at index ${index}.` +
                        ` Factory provider dependencies must be decorated with @Injectable.`
                );
            });
        } else {
            factoryProviderClass.prototype.dependencies = [];
        }
    }

    factoryProviderClass.prototype.token = provider.provide;

    return factoryProviderClass;
};
