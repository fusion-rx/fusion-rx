import { period } from '@fusion-rx/common';
import { findBack } from '@fusion-rx/node';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

let loggedDotEnvWarning = false;

/**
 * Reads the contents of a .env file.
 * @returns The contents of a loaded .env file or an empty object
 * if the file cannot be found or read.
 */
export const readDotEnv = <T = any>(): Partial<T> => {
    const envConfigDir = findBack('env.config.json');
    const dotEnv: any = {};

    if (envConfigDir) {
        const dotEnvDir = join(envConfigDir, '.env');

        if (existsSync(dotEnvDir)) {
            try {
                const dotEnvRaw = readFileSync(dotEnvDir, 'utf-8');
                dotEnvRaw
                    .split(/\n|\r/g)
                    .map((row) => row.split(/:|=/g))
                    .filter((row) => row.length === 2)
                    .forEach((row) => (dotEnv[row[0].trim()] = row[1].trim()));
            } catch {
                if (!loggedDotEnvWarning) {
                    console.error('Error: Failed to load .env.');
                }
            }
        } else {
            if (!loggedDotEnvWarning) {
                console.warn(period(`You might want to create a .env file`));
                loggedDotEnvWarning = true;
            }
        }
    }

    return dotEnv;
};
