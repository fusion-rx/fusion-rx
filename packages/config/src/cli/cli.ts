#! /usr/bin/env node

import {
    readFileSync,
    readdirSync,
    existsSync,
    writeFileSync,
    rmSync,
    cpSync,
    mkdirSync,
    unlinkSync
} from 'fs';
import { resolve, join } from 'path';
import { buildOverloadedCollection } from './util/build-overloaded-collection';
import type { FsnConfig } from './interface/rxconfig.js';
import { CompilerOptions } from './interface/compiler-options';
import { findArgValue } from './util/find-arg-value';

const args = process.argv.slice(2);

// If user has invoked `help`, print the help and exit.
if (args.includes('-h') || args.includes('--help')) {
    console.log(
        [
            'Usage: config --help',
            '       config -p <project-name> [options]',
            '       config --project <project-name> [options]',
            '       config -o <out-dir-path> [options]',
            '       config --outDir <out-dir-path> [options]',
            '',
            'Options:',
            '     --watch          Rebuilds when config files change.'
        ].join('\n')
    );
    process.exit();
}

// If there is no rxconfig.json file, log an error and exit.
if (!existsSync(resolve('rxconfig.json'))) {
    console.error(
        'Error: This command can only be run in a project that includes an rxconfig.json file.'
    );
    process.exit();
}

/** The rxconfig.json file, parsed. */
const config: FsnConfig = JSON.parse(
    readFileSync(resolve('rxconfig.json'), 'utf-8')
);

/** The included configuration files; if null, loads all configuration. */
const include = config['include'] ?? {};

/** The names of the collections included in the compilation. */
const includedCollections = Object.keys(include);

/** The compiler options in fxconfig.json. */
const compilerOptions: CompilerOptions = config.compilerOptions;

/** The url where the configuration files are kept; defaults to `config`. */
const baseURL = compilerOptions?.baseUrl ?? 'config';

/** All of the collections in {@link baseURL}. */
const allCollections = readdirSync(baseURL);

/** The directory of the built config folder; defaults to 'dist'. */
const outDirPath = join(resolve(), compilerOptions?.outDir ?? 'dist');

/** The path of the built config file; defaults to `dist`. */
const outFilePath = join(outDirPath, 'config.json');

/** The directory of the bundled assets; defaults to `dist/assets`. */
const assetsOutDirPath = join(outDirPath, 'assets');

/** Whether there is a 'base' configuration that should be overloaded by a project. */
const overloads = compilerOptions?.overloads ?? false;

/** The name of the project that will overload the base configuration. */
const project = findArgValue(args, '-p', '--project');

/** The built configuration. */
const output: any = {};

// If the configuration output already exists, delete it.
if (existsSync(outFilePath)) {
    try {
        unlinkSync(outFilePath);
    } catch (err) {
        console.error('Failed to delete out file for RxConfig.');
    }
}

// Remake the configuration out-path if it does not exist.
if (!existsSync(outDirPath)) {
    try {
        mkdirSync(outDirPath, {
            recursive: true
        });
    } catch (err) {
        console.error(
            'Failed out make out directory for RxConfig at ' + outFilePath + '.'
        );
        console.error(err);
    }
}

// Build the configuration.
includedCollections.forEach((collectionName) => {
    if (allCollections.includes(collectionName)) {
        if (overloads) {
            output[collectionName] = buildOverloadedCollection(
                collectionName,
                include[collectionName],
                baseURL,
                project
            );
        } else {
            // TODO handle non-overload
        }
    } else {
        console.error(
            `Collection "${collectionName}" specified in rxconfig.json does not exist.`
        );
    }
});

// Attempt to write the file; log any errors.
try {
    writeFileSync(outFilePath, JSON.stringify(output, undefined, 4), 'utf-8');
} catch (e) {
    console.error('Failed to build configuration.');
    console.error(e);
}

// Remove assets folder if exists
if (existsSync(assetsOutDirPath)) {
    rmSync(assetsOutDirPath, {
        recursive: true
    });
}

// If rxconfig specifies assets, make the assets folder
if (config.assets) {
    mkdirSync(assetsOutDirPath);
}

// Bundle assets

config.assets?.forEach((assetCollection) => {
    /** The directory for this collection of assets. */
    const assetDir = join(baseURL, 'assets', assetCollection.collection);

    /** The bundle directory for this collection of assets. */
    const outDir = join(assetsOutDirPath, assetCollection.collection);

    if (existsSync(assetDir)) {
        const collection = readdirSync(assetDir);

        if (assetCollection.overloads === false) {
            cpSync(assetDir, assetsOutDirPath, {
                recursive: true
            });
        } else {
            if (project && collection.includes(project)) {
                cpSync(join(assetDir, project), outDir, {
                    recursive: true
                });
            } else if (project) {
                console.error(
                    `Project "${project}" does not have assets for collection "${assetCollection.collection}".`
                );
            }
        }
    }
});
