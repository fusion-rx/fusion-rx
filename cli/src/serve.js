// @ts-check

import { readFusionConfig } from './fusion/read-fusion-config.js';
import { join } from 'path';
import { watch } from './watch.js';
import { spawn } from 'child_process';
import bold from 'chalk';
import ora from 'ora';

/**
 *
 * @param {string} projectName
 */
export const serveCli = (projectName) => {
    const fsnConfig = readFusionConfig(projectName);
    const out = join(fsnConfig.outDir, fsnConfig.main.replace('.ts', '.js'));

    /** @type { import('child_process').ChildProcessWithoutNullStreams } */
    let node;

    const serve = () => {
        node = spawn('node', [out, '--w']);

        node.stdout.on('data', (data) => console.log(data.toString().trim()));
        node.stderr.on('data', (data) => console.error(data.toString().trim()));
        node.on('exit', (code) =>
            console.log('child process exited with code ' + code?.toString())
        );

        return node;
    };

    const spinner = ora();

    const watcher = watch(fsnConfig);
    watcher.tsCompilerEventEmitter
        .on('recompile', () => {
            console.clear();
            spinner.start('Building application...\n\n');
            spinner.start('Changes detected; recompiling application...\n\n');
        })
        .on('success', () => {
            spinner.succeed('Compiled successfully.\n');
            console.info('Built at ' + bold(new Date().toISOString()) + '\n');
            if (node === undefined) serve();
        })
        .on('suggestion', (msg) => spinner.info(msg))
        .on('warning', (msg) => spinner.warn(msg))
        .on('error', (err) => spinner.fail(err));
    watcher.watch();
};
