// @ts-check

import { resolve } from 'path';
import ts from 'typescript';

export const readTsConfig = (tsConfigName = 'tsconfig.build.json') => {
    const configFilePath = ts.findConfigFile(
        resolve(),
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
        './'
    );

    if (compilerOptions.errors.length > 0) {
        throw {
            message: 'Failed to parse tsconfig.json',
            stack: compilerOptions.errors
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
