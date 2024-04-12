// @ts-check

import chalk from 'chalk';
import ora from 'ora';
import { join } from 'path';
import { spawn } from 'child_process';

import { watch } from './watch.js';
import { onAppExit } from './util/cleanup.js';

/**
 * @typedef { import('./types/compiler.js').FusionCompilerOptions } FusionCompilerOptions
 * @typedef { import('child_process').ChildProcessWithoutNullStreams } ChildProcess
 */

/**
 * Compiles and serves a Fusion project, recompiling when the code changes.
 * @param {FusionCompilerOptions} fsnConfig A project configuration
 */
export const serve = (fsnConfig) => {
    const out = join(fsnConfig.outDir, fsnConfig.main.replace('.ts', '.js'));

    /** @type { ChildProcess } */
    let node;

    const serve = () => {
        node = spawn('node', [out, '--w'], { stdio: 'inherit' });
        node.stdout?.on('data', (data) => console.log(data.toString().trim()));
        node.stderr?.on('data', (data) =>
            console.error(data.toString().trim())
        );
    };

    const spinner = ora();
    const watcher = watch(fsnConfig);
    watcher.tsCompilerEventEmitter
        .on('recompile', () => {
            node?.kill();
            console.clear();
            spinner.start('Building application...\n\n');
        })
        .on('success', () => {
            spinner.succeed('Compiled successfully.\n');
            console.info(
                'Built at ' + chalk.bold(new Date().toISOString()) + '\n'
            );
            serve();
        })
        .on('suggestion', (msg) => spinner.info(msg))
        .on('warning', (msg) => spinner.warn(msg))
        .on('error', (err) => spinner.fail(err));

    onAppExit(() => {
        if (node) {
            console.info(
                `Terminating child process ${node.pid ? `with pid ${node.pid} ` : ''}...`
            );
        }
    });

    watcher.watch();
};
