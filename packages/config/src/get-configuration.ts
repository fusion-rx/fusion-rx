import { newLine } from '@fusion-rx/common';
import { makeLogPrefix, red } from '@fusion-rx/node';

import { ConfigurationProvider } from './type';
import { RxConfiguration } from './configuration';

const rxConfig = new RxConfiguration();
rxConfig.init();

export function getConfiguration<T extends object>(
    provider: ConfigurationProvider
): T {
    try {
        return rxConfig.get(provider.collection, provider.name);
    } catch (error) {
        if (provider.throwNotFoundError) {
            throw error;
        } else {
            console.error(
                makeLogPrefix('ERROR', 'getConfiguration'),
                red(newLine((error as Error).stack ?? '')).join('')
            );
            return {} as T;
        }
    }
}
