// @ts-check

import { join } from 'path';
import ts from 'typescript';
import ora from 'ora';

import { readFusionConfig } from './fusion/read-fusion-config.js';
import { writePackageManifest } from './manifest.js';
import { exec } from './util/exec-sync.js';

/**
 * @typedef {import('./types').FusionCompilerOptions} FusionCompilerOptions
 */

/**
 * Builds a typescript project by using the CLI.
 * @param {string} projectRoot The root of the Typescript project to compile
 * @param {string} tsConfigFileName The name of the tsconfig.json used for compilations
 * @returns A promise of the command to execute the compilation
 */
export const buildWithTsCLI = (projectRoot, tsConfigFileName) =>
    exec(`npx tsc -p ${join(projectRoot, tsConfigFileName)}`);

/**
 * Creates a typescript program from a fusion.json file.
 * @param {FusionCompilerOptions} options
 * @returns A typescript program
 */
export const createTsProgramFromFsnCompilerOpts = (options) => {
    const program = ts.createProgram({
        options: options.tscOptions,
        rootNames: Array.isArray(options.rootNames)
            ? options.rootNames
            : [options.rootNames]
    });
    return program;
};

/**
 * Compiles a Fusion project
 * @param {string} [projectName] A Fusion project
 * @returns The results of the compilation
 */
export const compile = (projectName) => {
    const project = readFusionConfig(projectName);

    console.log(
        `Building Fusion Package\n\n` +
            '------------------------------------------------------------------------------\n' +
            `Building entry point '${project.packageJSON?.name ?? project.projectName}'\n` +
            '------------------------------------------------------------------------------\n'
    );

    const spinner = ora().start('Compiling Fusion project');

    return new Promise((resolve, reject) => {
        const out = createTsProgramFromFsnCompilerOpts(project);
        const result = out.emit();

        if (result.diagnostics.length > 0) {
            spinner.fail('Compilation failed');
            reject(
                result.diagnostics
                    .map((diagnostic) => {
                        return `${diagnostic.category}: ${diagnostic.messageText} (${diagnostic.code})`;
                    })
                    .join('\n')
            );
        }

        spinner.succeed();
        resolve(result);
    })
        .then((result) => {
            writePackageManifest(
                join(project.projectRoot, 'package.json'),
                join(project.outDir, 'package.json')
            );
            return result;
        })
        .catch((reason) => {
            console.error('\n' + reason);
        });
};
