// @ts-check

import { join, resolve } from 'path';
import ts from 'typescript';
import { existsSync, readFileSync } from 'fs';
import { isNativeError } from 'util/types';

import { readPackageJson } from './npm/index.js';
import { ErrorCode } from './error-codes.js';

/**
 * @typedef {'serve' | 'build' | 'test'} Operation
 */

/**
 * Reads and returns a configuration object.
 * @param { Operation } operation Specifies the `architect` section of the
 * fusion configuration that will be
 * @returns { import('./types').FusionCompilerOptions[] }
 * @throws Will throw an error if the configuration file cannot be found
 * or if it cannot be parsed or read
 */
export const readFusionConfig = (operation) => {
    const fsnConfigDir = resolve('fusion.json');

    if (!existsSync(fsnConfigDir))
        throw {
            message:
                'This command must be run in a directory that includes a fusion.json file.',
            stack: new Error().stack
        };

    /** @type {import('./types').FusionWorkspace} */
    let fsnConfig;

    try {
        /** @type {string | undefined} */
        let fsnConfigRaw = readFileSync(fsnConfigDir, 'utf-8');

        try {
            fsnConfig = JSON.parse(fsnConfigRaw);
        } catch (e) {
            throw {
                message: 'Failed to parse fusion config.',
                stack: isNativeError(e) ? e.stack : new Error().stack
            };
        }
    } catch (e) {
        throw {
            message: 'Failed to read fusion config.',
            stack: isNativeError(e) ? e.stack : new Error().stack
        };
    }

    const projects = Object.keys(fsnConfig.projects).map((projectName) => {
        const project = fsnConfig.projects[projectName];

        const projectRoot = resolve(project.root);
        const buildOptions = project.architect.build;
        const main = join(projectRoot, buildOptions.options.main);
        const outDir = resolve(buildOptions.options.outputPath, projectName);

        const packageJSON = readPackageJson(join(projectRoot, 'package.json'));

        const configFile = ts.readConfigFile(
            buildOptions.options.tsConfig,
            ts.sys.readFile
        );

        if (configFile.error) throw configFile.error;

        const compilerOptions = ts.parseJsonConfigFileContent(
            configFile.config,
            ts.sys,
            './'
        );

        if (compilerOptions.errors.length > 0) throw compilerOptions.errors;

        // Set these both to true, as they required for Fusion projects
        compilerOptions.options.emitDecoratorMetadata = true;
        compilerOptions.options.experimentalDecorators = true;

        // Update the base URL and outDir to the directories specified
        // by the Fusion configuration
        compilerOptions.options.baseUrl = projectRoot;
        compilerOptions.options.outDir = outDir;

        /** @type {import('./types').FusionCompilerOptions} **/
        const fsnCompilerOptions = {
            projectName,
            projectRoot,
            outDir,
            rootNames: main,
            tscOptions: compilerOptions.options,
            main: buildOptions.options.main,
            watch: operation === 'serve',
            packageJSON,
            tsConfigFileName: buildOptions.options.tsConfig
        };

        return fsnCompilerOptions;
    });

    return projects;
};

/**
 *
 * @param {string} [projectName]
 * @param {Operation} [operation]
 * @returns
 */
export const loadProjectConfig = (projectName, operation = 'build') => {
    const config = readFusionConfig(operation);

    if (config.length === 0)
        throw {
            message: 'Failed to build; no project found.',
            name: ErrorCode.FSN_NO_PROJ_FOUND,
            stack: new Error().stack
        };

    if (config.length === 1) {
        const project = config.shift();

        if (!project)
            throw {
                message: 'Failed to build; no project found.',
                name: ErrorCode.FSN_NO_PROJ_FOUND,
                stack: new Error().stack
            };

        return project;
    }

    if (!projectName)
        throw {
            message: 'Failed to build; no project name provided.',
            name: ErrorCode.FSN_NO_PROJ_SPECIFIED,
            stack: new Error().stack
        };

    const project = config.find((proj) => proj.projectName === projectName);

    if (!project)
        throw {
            message: `Failed to build; no project with name ${projectName}`,
            name: ErrorCode.FSN_PROJ_WITH_NAME_NOT_FOUND,
            stack: new Error().stack
        };

    return project;
};
