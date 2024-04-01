// @ts-check

import { existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';

/**
 * Creates a directory if it does not exist.
 * @param {string} dir A path to a directory
 * @param throwError True if an error should be thrown. Defaults to false.
 */
export const mkDirIfNotExists = (dir, throwError = false) => {
    try {
        if (!existsSync(dir)) {
            mkdirSync(dir, {
                recursive: true
            });
        }
    } catch (e) {
        if (throwError) throw e;
    }
};

/**
 * Sets environment variables from a `.env` file at the project root.
 */
export const dotEnv = () => {
    let dotEnvPath = join(process.cwd(), '.env');
    if (!existsSync(dotEnvPath)) {
        console.warn('Warning: .env not found.');
        return;
    }
    readFileSync(dotEnvPath, 'utf-8')
        .trim()
        .split(/\n|\r/g)
        .forEach((ln) => {
            process.env[ln.substring(0, ln.indexOf(':')).trim()] = ln
                .substring(ln.indexOf(':') + 1)
                .trim();
        });
};

/**
 * Removes a directory or file if it exists.
 * @param {string} path A directory or file path
 * @param throwError Whether errors should be thrown. Defaults to `false`.
 */
export const rmSyncIfExists = (path, throwError = false) => {
    if (existsSync(path)) {
        try {
            rmSync(path, {
                recursive: true
            });
        } catch (e) {
            if (throwError) throw e;
        }
    }
};
