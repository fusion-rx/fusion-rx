// @ts-check

import { resolve } from 'path';
import ts from 'typescript';

/**
 *
 * @param {string} tsConfigName The name of the tsconfig file (such as `tsconfig.build.json`).
 * Defaults to `tsconfig.json`.
 * @param {string} [path] The path to the tsconfig file.
 * @returns
 */
export const readTsConfig = (tsConfigName = 'tsconfig.json', path) => {
    const configFilePath = ts.findConfigFile(
        path ?? resolve(),
        ts.sys.fileExists,
        tsConfigName
    );

    if (!configFilePath) {
        throw {
            message: 'Failed to resolve ' + tsConfigName,
            stack: new Error().stack
        };
    }

    const configFile = ts.readConfigFile(configFilePath, ts.sys.readFile);

    if (configFile.error) {
        throw {
            message: configFile.error.messageText,
            stack: configFile.error
        };
    }

    const compilerOptions = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        path ?? './'
    );

    if (compilerOptions.errors.length > 0) {
        throw {
            message: 'Failed to parse tsconfig.json',
            errors: compilerOptions.errors,
            stack: new Error().stack
        };
    }

    return compilerOptions;
};

export const resolveOutDirFromTsConfig = () => {
    const compilerOptions = readTsConfig();

    const outDir = compilerOptions.options.outDir;

    if (!outDir) {
        throw {
            message: 'No outDir specified in tsconfig.build.json.',
            stack: new Error().stack
        };
    }

    return resolve(outDir, 'package.json');
};
