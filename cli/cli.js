#! /usr/bin/env node

// @ts-check

import chalk from 'chalk';
import { exit } from 'process';

import { arg, args, printHelp } from './src/util/index.js';
import { compile } from './src/compiler.js';
import { watchCli } from './src/watch.js';

const help = () => printHelp('help.txt');

const build = () => {
    const project = arg('-p', '--project');
    const watch = args.includes('--watch') ? true : false;

    if (project) {
        if (watch) return watchCli(project);
        return compile(project);
    } else {
        if (watch) return watchCli();
        return compile();
    }
};

const serve = () => {
    const project = arg('-p', '--project');
    const watch = args.includes('--watch');

    return {
        project,
        watch
    };
};

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

switch (args[0]) {
    case 'build':
        build();
        break;
    case 'serve':
        serve();
        break;
    case 'config':
        config();
        break;
    default:
        help();
}
