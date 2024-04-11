// @ts-check

import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import ts from 'typescript';
import ora from 'ora';

import { readFusionConfig } from './fusion/read-fusion-config.js';
import { writePackageManifest } from './manifest.js';
import { exec } from './util/exec-sync.js';

/**
 * Builds a typescript project by using the CLI.
 * @param {string} projectRoot The root of the Typescript project to compile
 * @param {string} tsConfigFileName The name of the tsconfig.json used for compilations
 * @returns A promise of the command to execute the compilation
 */
export const buildWithTsCLI = (projectRoot, tsConfigFileName) =>
    exec(`npx tsc -p ${join(projectRoot, tsConfigFileName)}`);

/**
 * Lists all typescript files in a directory.
 * @param {string} path The path to the project root
 * @toDo Is there a way to do this with the typescript API?
 */
const listAllTsFiles = (path) => {
    /** @type {string[]} */
    const tsFiles = [];

    if (existsSync(path) && statSync(path).isDirectory()) {
        readdirSync(path).forEach((pathOrDir) => {
            tsFiles.push(...listAllTsFiles(join(path, pathOrDir)));
        });
    } else {
        if (path.endsWith('.ts') && !path.endsWith('.spec.ts')) {
            tsFiles.push(path);
        }
    }

    return tsFiles;
};

/**
 * Creates a typescript program from a fusion.json file.
 * @param {import('./types').FusionCompilerOptions} options
 * @returns A typescript program
 */
export const createTsProgramFromFsnCompilerOpts = (options) => {
    // const allTsFiles = listAllTsFiles(options.sourceRoot);
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
