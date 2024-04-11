// @ts-check

import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import ts from 'typescript';
import ora from 'ora';

import { readFusionConfig } from './fusion/read-fusion-config.js';
import { writePackageManifest } from './manifest.js';
import { execSync } from 'child_process';

/**
 *
 * @param {unknown} val
 * @returns {val is {
 *  output: (null | Buffer)[],
 *  stdout: Buffer,
 *  stderr: Buffer
 * }}
 */
export const isExecSyncErr = (val) => {
    return (
        val !== null &&
        typeof val === 'object' &&
        'output' in val &&
        'stdout' in val
    );
};

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
    new Promise((resolve, reject) => {
        try {
            const output = execSync(
                `npx tsc -p ${join(project.projectRoot, project.tsConfigFileName)}`
            );
            spinner.succeed();
            resolve(output.toString('utf-8'));
        } catch (e) {
            if (isExecSyncErr(e)) {
                spinner.fail('Compilation failed');
                const err = e.stdout.toString('utf-8');
                reject(err);
            }
        }
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

// project.tscOptions.module = ts.ModuleKind.CommonJS;
// project.tscOptions.target = ts.ScriptTarget.ES2017;
// project.tscOptions.declaration = true;
// project.tscOptions.declarationMap = true;
// project.tscOptions.lib = ['es2020'];
// project.tscOptions.outDir = project.outDir;
// const out = createTsProgramFromFsnCompilerOpts(project);
// const es2015 = out.emit();
