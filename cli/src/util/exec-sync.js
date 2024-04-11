// @ts-check

import { execSync } from 'child_process';

/**
 * @typedef {{
 *      output: (null | Buffer)[],
 *      stdout: Buffer,
 *      stderr: Buffer
 * }} ExecSyncError
 */

/**
 * Safely assert whether `errOrUnknown` is an error
 * thrown by `execSync`.
 * @param {unknown} errOrUnknown
 * @returns {errOrUnknown is ExecSyncError}
 */
export const isExecSyncErr = (errOrUnknown) => {
    return (
        errOrUnknown !== null &&
        typeof errOrUnknown === 'object' &&
        'output' in errOrUnknown &&
        'stdout' in errOrUnknown
    );
};

/**
 * Wraps execSync in a promise.
 * @param {string} command A command to execute
 * @returns A promise that resolves the stdout if the command
 * succeeds and rejects with a ExecSyncError if the command fails
 */
export const exec = async (command) => {
    return new Promise((resolve, reject) => {
        try {
            const output = execSync(command);
            resolve(output.toString('utf-8'));
        } catch (err) {
            if (isExecSyncErr(err)) {
                const errOut = err.stdout.toString('utf-8');
                reject(errOut);
            } else {
                reject(err);
            }
        }
    });
};
