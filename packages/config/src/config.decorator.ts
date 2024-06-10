import { forEach } from '@fusion-rx/common';
import { getConfiguration } from './get-configuration';
import { ConfigurationProvider } from './type/configuration-provider';
import { configurationChange } from './configuration';

export function Config(...providers: ConfigurationProvider[]) {
    return function (target: Object, propertyKey: string | symbol) {
        let configuration: any;

        configurationChange.subscribe(() => {
            configuration = null;
        });

        Object.defineProperty(target, propertyKey, {
            get: () => {
                if (configuration) return configuration;

                configuration = {};

                const configs = providers.map((provider) =>
                    getConfiguration(provider)
                );

                configs.forEach((config) => {
                    forEach(config, (val, key) => {
                        configuration[key] = val;
                    });
                });

                return configuration;
            }
        });
    };
}
