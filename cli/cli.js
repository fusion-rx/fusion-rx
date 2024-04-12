#! /usr/bin/env node

// @ts-check

import chalk from 'chalk';
import { exit } from 'process';

import { arg, args, printHelp } from './src/util/index.js';
import { compile } from './src/compiler.js';
import { watch } from './src/watch.js';
import { serve } from './src/serve.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFusionConfig } from './src/fusion/read-fusion-config.js';

// @ts-ignore
const metaUrl = import.meta.url;
const rootFile = fileURLToPath(metaUrl);
const rootDir = dirname(rootFile);

const helpText = readFileSync(join(rootDir, 'help.txt'), 'utf-8');
const help = () => printHelp(helpText);

const config = () => {
    const project = arg('-p', '--project');
    //@ts-ignore
    const environment = arg('-e', '--env') ?? arg('-e', '--environment');
    if (project) {
        // new Config(project, environment).build();
    } else {
        console.error(
            chalk.red('You must specify a project to build with ') +
                chalk.blue('[--project | -p]') +
                chalk.red('.')
        );
    }
    return 'done';
};

if (args.includes('-h') || args.includes('--help')) {
    help();
    exit();
}

const project = arg('-p', '--project');

const executeBuild = () => {
    if (args.includes('--watch')) {
        const fsnProject = readFusionConfig(project);
        return watch(fsnProject);
    }

    return compile(project);
};

const executeServe = () => {
    const fsnConfig = readFusionConfig(project);
    return serve(fsnConfig);
};

switch (args[0]) {
    case 'build':
        executeBuild();
        break;
    case 'serve':
        executeServe();
        break;
    case 'config':
        config();
        break;
    default:
        help();
}
