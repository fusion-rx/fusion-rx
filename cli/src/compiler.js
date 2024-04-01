// @ts-check

import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import ts from 'typescript';
import ora from 'ora';

import { readFusionConfig } from './fusion/read-fusion-config.js';
import { writePackageManifest } from './manifest.js';

/**
 *
 * @param {import('./types').FusionCompilerOptions} options
 * @returns
 */
export const createTsProgramFromFsnCompilerOpts = (options) => {
    /**
     * @param {string} path
     * @toDo is there a way to do this with the typescript API?
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

    console.log(options);

    const allTsFiles = listAllTsFiles(options.sourceRoot);
    const program = ts.createProgram({
        options: options.tscOptions,
        rootNames: Array.isArray(options.rootNames)
            ? [...options.rootNames, ...allTsFiles]
            : [options.rootNames, ...allTsFiles]
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
    new Promise((resolve) => {
        project.tscOptions.module = ts.ModuleKind.ES2015;
        project.tscOptions.target = ts.ScriptTarget.ES2017;
        project.tscOptions.outDir = project.outDir;

        const out = createTsProgramFromFsnCompilerOpts(project);
        const es2015 = out.emit();
        spinner.succeed('Compilation complete');

        resolve(es2015);
    }).then((result) => {
        writePackageManifest(
            join(project.projectRoot, 'package.json'),
            join(project.outDir, 'package.json')
        );
        return result;
    });
};
