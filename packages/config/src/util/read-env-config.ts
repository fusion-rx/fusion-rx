import { forEach } from '@fusion-rx/common';
import { readAndParseFileSync, findBack } from '@fusion-rx/node';

import { join } from 'path';
import { parse } from 'yaml';

import { readDotEnv } from './read-dot-env';
import { configNotFoundMsg } from './config-not-found-msg';

export function readEnvConfig<T = any>(): T {
    const dotEnv = readDotEnv<T>();
    const envConfigDir = findBack('env.config.json');

    if (envConfigDir) {
        const envConfig = parse(
            readAndParseFileSync(join(envConfigDir, 'env.config.json'))
        );

        forEach(dotEnv, (val, key) => {
            envConfig[key] = val;
        });

        return envConfig;
    } else {
        throw new Error(configNotFoundMsg);
    }
}
