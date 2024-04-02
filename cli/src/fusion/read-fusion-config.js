// @ts-check

import { join, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import { isNativeError } from 'util/types';

import { readPackageJson } from '../npm/index.js';
import { ErrorCode } from '../error-codes.js';
import { readTsConfig } from '../typescript/tsconfig.js';

/**
 * @typedef {import('.').FusionWorkspace } FusionWorkspace
 * @typedef {import('../types').FusionCompilerOptions} FusionCompilerOptions
 */

/**
 * Reads and returns a configuration object.
 * @param { string } [projectName]
 * @returns { FusionCompilerOptions }
 * @throws Will throw an error if the configuration file cannot be found
 * or if it cannot be parsed or read
 */
export const readFusionConfig = (projectName) => {
    const fsnConfigDir = resolve('fusion.json');

    if (!existsSync(fsnConfigDir))
        throw {
            name: ErrorCode.FSN_RESOLVE_CONFIG,
            message:
                'This command must be run in a directory that includes a fusion.json file.',
            stack: new Error().stack
        };

    /** @type {FusionWorkspace} */
    let fsnConfig;

    try {
        /** @type {string | undefined} */
        let fsnConfigRaw = readFileSync(fsnConfigDir, 'utf-8');

        try {
            fsnConfig = JSON.parse(fsnConfigRaw);
        } catch (e) {
            throw {
                name: ErrorCode.FSN_PARSE_CONFIG,
                message: 'Failed to parse fusion config.',
                stack: isNativeError(e) ? e.stack : new Error().stack
            };
        }
    } catch (e) {
        throw {
            name: ErrorCode.FSN_READ_CONFIG,
            message: 'Failed to read fusion config.',
            stack: isNativeError(e) ? e.stack : new Error().stack
        };
    }

    /** @type {import('./workspace/project.js').FusionProject | undefined } */
    let project;

    // No projects have been defined in the fusion config
    if (Object.keys(fsnConfig.projects).length === 0) {
        throw {
            name: ErrorCode.FSN_NO_PROJ_FOUND,
            message: 'No projects in config file.'
        };
    }

    // No project name has been provided, but multiple projects
    // have been defined in the fusion config
    if (!projectName && Object.keys(fsnConfig.projects).length > 1) {
        throw {
            name: ErrorCode.FSN_NO_PROJ_SPECIFIED,
            message:
                'Multiple projects exist in the workspace, but no single project was specified.',
            error: new Error().stack
        };
    }

    // No project name has been provided, but there is only one project
    // in the fusion config, so we default to that one
    if (!projectName && Object.keys(fsnConfig.projects).length === 1) {
        projectName = Object.keys(fsnConfig.projects)[0];
        project = fsnConfig.projects[projectName];
    }

    // The fusion config has one or more projects, and a project name
    // has been provided
    if (projectName) {
        project = fsnConfig.projects[projectName];

        // If a project matching the provided `projectName` does not exit
        if (!project) {
            throw {
                name: ErrorCode.FSN_PROJ_WITH_NAME_NOT_FOUND,
                message: 'Failed to resolve project with name ' + projectName,
                error: new Error().stack
            };
        }
    }

    // If by this point project is not initialized, we need to error
    if (!project) {
        throw {
            name: ErrorCode.FSN_NO_PROJ_FOUND,
            message: 'Fusion project not found.',
            stack: new Error().stack
        };
    }

    // If by this point projectName hasn't been initialized, we need to error
    if (!projectName) {
        throw {
            name: ErrorCode.FSN_NO_PROJ_SPECIFIED,
            message: 'No project name specified.',
            stack: new Error().stack
        };
    }

    // Create an absolute path to the project root relative to the directory
    // from which the cli command was run
    const projectRoot = resolve(project.root);

    const sourceRoot = resolve(project.sourceRoot);

    // Assign the build architect options to a variable to reduce
    // the number of deep calls
    const buildOptions = project.architect.build;

    // Resolve the `main` (or `entry`) file relative to the root of the project
    const main = join(sourceRoot, buildOptions.options.main);

    // If the entry file does not exist, we have to error
    if (!existsSync(main)) {
        throw {
            name: ErrorCode.FSN_RESOLVE_MAIN,
            message: 'Failed to resolve main entry file specified in config',
            stack: new Error().stack
        };
    }

    // Resolve the out directory relative to the directory
    // from which the cli command was run
    const outDir = resolve(buildOptions.options.outputPath, projectName);

    const packageJSON = readPackageJson(join(projectRoot, 'package.json'));

    const compilerOptions = readTsConfig(
        buildOptions.options.tsConfig,
        projectRoot
    );

    if (compilerOptions.errors.length > 0) throw compilerOptions.errors;

    // Set these both to true, as they required for Fusion projects
    compilerOptions.options.emitDecoratorMetadata = true;
    compilerOptions.options.experimentalDecorators = true;

    // Update the base URL and outDir to the directories specified
    // by the Fusion configuration
    compilerOptions.options.baseUrl = projectRoot;
    compilerOptions.options.outDir = outDir;

    /** @type { FusionCompilerOptions } **/
    const fsnCompilerOptions = {
        projectName,
        projectRoot,
        sourceRoot,
        outDir,
        rootNames: main,
        tscOptions: compilerOptions.options,
        main: buildOptions.options.main,
        packageJSON,
        tsConfigFileName: buildOptions.options.tsConfig
    };

    return fsnCompilerOptions;
};
