//@ts-check

import { writeFileSync, existsSync } from 'fs';
import { exit } from 'process';
import { resolve } from 'path';
import ora from 'ora';

import { resolveOutDirFromTsConfig } from './typescript/tsconfig.js';
import { readPackageJson } from './npm/index.js';
import { logInfo, stringify, wait } from './util/index.js';

/**
 * @typedef {import('./types/npm.js').npm.Config } npm.Config
 * @typedef {import('./types/npm.js').npm.ConfigLib } npm.ConfigLib
 */

/**
 * Creates the package manifest file for a TypeScript project.
 * @param { npm.ConfigLib } packageJson A parsed package.json
 * @returns A stringified package manifest
 */
const createTypeScriptManifest = (packageJson) => {
    /** @type {npm.ConfigLib} */
    const packageManifest = {
        name: packageJson.name,
        version: packageJson.version,
        exports: packageJson.exports,
        main: packageJson.main
    };

    return packageManifest;
};

/**
 * Creates the package manifest file for a Parcel project.
 * @param {npm.Config} packageJson A parsed package.json
 * @returns A stringified package manifest
 */
const createParcelManifest = (packageJson) => {
    /** The `main` entry of the Package.json */
    const main = packageJson.main?.split('/').pop();

    if (main === undefined) {
        throw 'Package.json must have an entry for `main`.';
    }

    /**
     * Create a copy of the package.json to copy to the compiled location.
     * @type {npm.ConfigLib}
     */
    const packageManifest = {
        name: packageJson.name,
        version: packageJson.version,
        license: packageJson.license,
        main,
        dependencies: packageJson.dependencies
    };

    const mdule = packageJson.module?.split('/').pop();
    const types = packageJson.types?.split('/').pop();
    if (mdule) packageManifest.module = mdule;
    if (types) packageManifest.types = types;

    return packageManifest;
};

/**
 * Exports the package manifest file for a TypeScript or
 * Parcel project.
 * @param {string} packageJsonPath
 * @param {string} [outPath]
 */
export const writePackageManifest = (packageJsonPath, outPath) => {
    const isParcelProject = existsSync(resolve('.parcelrc'));

    console.log(
        'Writing package manifest ' +
            `for ${isParcelProject ? 'Parcel' : 'TypeScript'} compilation.`
    );

    const readPackageJSON = () => {
        const spinner = ora().start(
            outPath ? 'Writing package manifest' : 'Reading package.json'
        );

        /** @type {Promise<npm.Config>} */
        return new Promise(async (resolve) => {
            try {
                const packageJson = readPackageJson(packageJsonPath);
                await wait(500);
                spinner.succeed();
                if (packageJson.scripts) {
                    logInfo(
                        `Removing scripts section in package.json as ` +
                            `it's considered a potential security vulnerability.`
                    );
                }
                resolve(packageJson);
            } catch (e) {
                // @ts-ignore
                spinner.fail(e['message']);
                console.log(e);
                exit();
            }
        });
    };

    /**
     *
     * @param {string} outDir
     * @param {npm.Config} packageJson
     * @returns
     */
    const writePackageManifest = (outDir, packageJson) => {
        const spinner = ora().start('Writing package manifest');

        return new Promise(async () => {
            try {
                const packageManifest = isParcelProject
                    ? createParcelManifest(packageJson)
                    : createTypeScriptManifest(packageJson);

                if (packageJson.author)
                    packageManifest.author = packageJson.author;
                if (packageJson.license)
                    packageManifest.license = packageJson.license;
                if (packageJson.bin) packageManifest.bin = packageJson.bin;
                if (packageJson.dependencies)
                    packageManifest.dependencies = packageJson.dependencies;
                if (packageJson.peerDependencies)
                    packageManifest.peerDependencies =
                        packageJson.peerDependencies;
                if (packageJson.exports)
                    packageManifest.exports = packageJson.exports;

                const stringifiedManifest = stringify(
                    packageManifest,
                    'Failed to strinfigy package manifest'
                );
                try {
                    writeFileSync(outDir, stringifiedManifest);
                    await wait(1000);
                    spinner.succeed('Wrote package manifest');
                } catch (e) {
                    spinner.fail('Failed to write package manifest');
                    console.log(e);
                    exit(5);
                }
            } catch (e) {
                // @ts-ignore
                spinner.fail(e);
                console.log(e);
            }
        });
    };

    const spinner = ora();

    if (outPath) {
        readPackageJSON().then((packageJson) => {
            writePackageManifest(outPath, packageJson).then();
        });
    } else {
        spinner.start('Resolving out directory from tsconfig.json.');
        new Promise(async (resolve) => {
            try {
                const outDir = resolveOutDirFromTsConfig();
                await wait(1000);
                spinner.succeed(`Resolved out directory to ${outDir}`);
                resolve(outDir);
            } catch (e) {
                // @ts-ignore
                spinner.fail(e['message']);
                exit(5);
            }
        }).then((outDir) => {
            readPackageJSON().then((packageJson) => {
                writePackageManifest(outDir, packageJson).then();
            });
        });
    }
};
