#! /usr/bin/env node
//@ts-check

const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { resolve } = require('path');
const { exit } = require('process');

/**
 * @typedef {{
 *      name: string,
 *      version: string,
 *      description: string,
 *      author: string,
 *      license: string,
 *      main: string,
 *      module?: string,
 *      types?: string,
 *      dependencies?: Record<string, string>,
 *      peerDependencies?: Record<string, string>,
 *      exports?: Record<string, any>
 * }} ExportPackageJSON
 * @typedef {ExportPackageJSON & {
 *      source: string,
 *      targets: Record<string, any>,
 *      scripts: Record<string, string>,
 *      devDependencies: Record<string, string>,
 * }} PackageJSON
 *
 */

/**
 * The package JSON in the current directory.
 * @type {PackageJSON}
 */
const packageJSON = JSON.parse(readFileSync(resolve('package.json'), 'utf-8'));

/** The `main` entry of the Package.json */
const main = packageJSON.main.split('/').pop();

if (main === undefined) {
    console.error('Package.json must have an entry for `main`. Exiting.');
    exit(5);
}

/**
 * Create a copy of the package.json to copy to the compiled location.
 * @type {ExportPackageJSON}
 */
const packageCopy = {
    name: packageJSON.name,
    version: packageJSON.version,
    description: packageJSON.description,
    author: packageJSON.author,
    license: packageJSON.license,
    main,
    dependencies: packageJSON.dependencies
};

const mdule = packageJSON.module?.split('/').pop();
const types = packageJSON.types?.split('/').pop();

if (mdule) packageCopy.module = mdule;
if (types) packageCopy.types = types;
if (packageJSON.exports) packageCopy.exports = packageJSON.exports;
if (packageJSON.peerDependencies)
    packageCopy.peerDependencies = packageJSON.peerDependencies;

/** Get the location of the out directory from the compiled main file. */
const outDir = resolve(
    packageJSON.main.substring(0, packageJSON.main.lastIndexOf('/'))
);
const outPath = resolve(outDir, 'package.json');

if (!existsSync(outDir)) {
    mkdirSync(outDir, {
        recursive: true
    });
}

writeFileSync(outPath, JSON.stringify(packageCopy, null, 4));
