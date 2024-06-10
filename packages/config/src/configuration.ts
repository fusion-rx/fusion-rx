import { yellow, red, makeLogPrefix, resolveRoot } from '@fusion-rx/node';
import { newLine, period } from '@fusion-rx/common';
import { watch } from 'chokidar';
import { existsSync, readFileSync } from 'fs';
import { Subject } from 'rxjs';
import { join } from 'path';

export const configurationChange = new Subject<void>();

export class RxConfiguration {
    private _rxConfig: any = {};

    public get(collection: string, name?: string) {
        if (!this._rxConfig[collection]) {
            throw new Error(period('Collection', collection, 'does not exit'));
        }

        if (name) {
            if (!this._rxConfig[collection][name]) {
                throw new Error(
                    period(
                        'Configuration',
                        name,
                        'in collection',
                        collection,
                        'does not exit'
                    )
                );
            }

            return this._rxConfig[collection][name];
        }

        return this._rxConfig[collection];
    }

    public init() {
        const rxConfigPath = this._findConfigFile();

        if (rxConfigPath) {
            this._watchConfig(rxConfigPath);
            const rawConfig = this._readConfigFile(rxConfigPath);
            if (rawConfig) {
                this._rxConfig = this._parseConfigFile(rawConfig);
            }
        }
    }

    private _findConfigFile() {
        try {
            const home = resolveRoot();

            if (existsSync(join(home.path, 'config.json'))) {
                return join(home.path, 'config.json');
            } else if (existsSync(join(home.path, '..', 'config.json'))) {
                return join(home.path, '..', 'config.json');
            } else {
                throw new Error('Config does not exist.');
            }
        } catch (err) {
            console.error(
                makeLogPrefix('ERROR') +
                    red(
                        newLine(
                            'Failed to resolve config.json.',
                            'Did you compile your configuration with the RxConfig cli? See the @fusion-rx/common Readme for information and troubleshooting.',
                            (err as Error).stack ?? ''
                        )
                    ).join('')
            );
        }

        process.exit();
    }

    private _watchConfig(rxConfigPath: string) {
        if (rxConfigPath) {
            watch(rxConfigPath).on('change', () => {
                console.log(
                    makeLogPrefix('DEBUG') +
                        yellow(
                            'Configuration change detected. Reloading config.'
                        ).join('')
                );
                const rawConfig = this._readConfigFile(rxConfigPath);
                if (rawConfig) {
                    this._rxConfig = this._parseConfigFile(rawConfig);
                }
                configurationChange.next();
            });
        }
    }

    private _readConfigFile(rxConfigPath: string | null) {
        if (rxConfigPath && existsSync(rxConfigPath)) {
            try {
                return readFileSync(rxConfigPath, 'utf-8');
            } catch (err) {
                console.error(
                    makeLogPrefix('ERROR') +
                        red(
                            newLine(
                                'Failed to read config.json. Did you compile your configuration with the RxConfig cli? See the Readme for details.',
                                (err as Error).name +
                                    ': ' +
                                    (err as Error).message,
                                (err as Error).stack ?? ''
                            )
                        ).join('')
                );
            }
        } else {
            const err = new Error('ENOENT: RxConfig not found.');
            console.error(
                makeLogPrefix('ERROR') +
                    red(
                        newLine(
                            'Path to config.json not found. Did you compile your configuration with the RxConfig cli? See the Readme for details.',
                            err.name + ': ' + err.message,
                            err.stack ?? ''
                        )
                    ).join('')
            );
        }

        return null;
    }

    private _parseConfigFile(rawConfig: string) {
        try {
            return JSON.parse(rawConfig);
        } catch (err: any) {
            console.error(
                makeLogPrefix('ERROR') +
                    red(
                        newLine(
                            'Failed to parse config.json. Did you compile your configuration with the RxConfig cli? See the Readme for details.',
                            (err as Error).name + ': ' + (err as Error).message,
                            (err as Error).stack ?? ''
                        )
                    ).join('')
            );
        }

        return null;
    }
}
