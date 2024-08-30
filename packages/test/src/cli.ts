#! /usr/bin/env node

import { argv, exit } from 'process';
import { error } from 'console';
import { hideBin } from 'yargs/helpers';
import { isNativeError } from 'util/types';

import chalk from 'chalk';
import yargs from 'yargs';
import { basename, dirname, join, resolve } from 'path';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';

import ts from 'typescript';
import { execSync } from 'child_process';

declare interface SourceMapOut {
    /** An array of the absolute path to the input .ts source files. */
    inputSourceFileNames: string[];
    sourceMap: {
        version: number;
        /** The name of the emitted .d.ts file. */
        file: string;
        sourceRoot: string;
        /** An array of the relative path to the source map sources. */
        sources: string[];
        names: string[];
        mappings: string;
        sourcesContent: unknown;
    };
}

/**
 * Recursively reads the contents of a directory.
 * @param dir The path to a file or directory
 * @returns An array of all absolute paths to files
 * in a directory
 */
const readDirSync = (dir: string) => {
    if (!statSync(dir).isDirectory()) return [dir];

    const files: string[] = [];
    readdirSync(dir).forEach((fileOrDir) =>
        files.push(...readDirSync(join(dir, fileOrDir)))
    );
    return files;
};

const executeTest = (testFilePath: string) => {
    execSync(`node ${testFilePath}`, {
        stdio: 'inherit'
    });
};

const compileTypescriptProject = (path: string, tsConfigName: string) => {
    const configFilePath = ts.findConfigFile(
        resolve(path),
        ts.sys.fileExists,
        tsConfigName
    );

    if (!configFilePath) {
        console.error(
            chalk.red(
                'Error: Unable to resolve tsconfig.spec.json. Does one exist in the project workspace?'
            )
        );
        exit();
    }

    const tsconfig = ts.readConfigFile(configFilePath, (path) =>
        readFileSync(path, 'utf-8')
    );

    if (tsconfig.error) {
        console.error(chalk.red(tsconfig.error.messageText));
    }

    const compilerOptions = ts.parseJsonConfigFileContent(
        tsconfig.config,
        ts.sys,
        dirname(configFilePath)
    );

    if (compilerOptions.errors.length > 0) {
        console.error(chalk.red('Failed to parse typescript configuration.'));
        compilerOptions.errors.forEach((error) => {
            console.error(chalk.red(error.messageText));
        });
        exit();
    }

    const outDir = compilerOptions.options.outDir;

    if (!outDir) {
        console.error(chalk.red('Failed to determine output file'));
        exit();
    }

    return {
        outDir,
        emitResults: ts
            .createProgram({
                options: compilerOptions.options,
                rootNames: [path]
            })
            .emit()
    };
};

/**
 * Compiles a typescript project and runs a test file.
 * @param path The path to a test file
 */
const compileAndTest = (path: string) => {
    const { outDir, emitResults } = compileTypescriptProject(
        path,
        'tsconfig.spec.json'
    );

    const testFileSourceMap: SourceMapOut = (<any>emitResults).sourceMaps.find(
        (sm: SourceMapOut) => {
            const input = sm.sourceMap.sources[0];
            if (!input) return false;
            return input.split(/\//g).pop() === basename(path);
        }
    );

    const outFile = readDirSync(outDir).find((path) =>
        path.endsWith(testFileSourceMap.sourceMap.file)
    );

    if (!outFile) {
        throw new Error('Unable to determine emitted test file location.');
    }

    executeTest(outFile);
};

const cli = yargs(hideBin(argv))
    .command(
        'run',
        'Runs a test suite',
        (yargs) => yargs,
        ({ _ }) => {
            let path = _[1];

            if (typeof path !== 'string') {
                console.error(chalk.red('Invalid path provided.'));
                exit();
            }

            path = resolve(path);

            if (!existsSync(path)) {
                console.error(chalk.red('The provided path does not exist.'));
                exit();
            }

            if (path.endsWith('ts')) {
                compileAndTest(path);
            } else {
                executeTest(path);
            }
        }
    )
    .help()
    .fail((msg, err) => {
        if (isNativeError(err)) {
            error(chalk.red(err.message));
            exit();
        }

        if (typeof err === 'string') {
            console.error(chalk.red(err));
            exit(1);
        }

        if (msg) console.error(chalk.red(msg));
    });

await cli.parse();
