// @ts-check

import { existsSync, readFileSync } from 'fs';
import { isNativeError } from 'util/types';
import { ErrorCode } from '../error-codes.js';
import { resolve } from 'path';

/**
 * Reads and parses a package.json file, resolving the file
 * from the current working directory.
 * @param {string} [packageJsonPath]
 * @returns {import('../types/npm').npm.Config} A parsed package.json file
 * @throws Will throw an error if the package.json cannot be
 * found, read, or parsed.
 */
export const readPackageJson = (packageJsonPath) => {
    // If a path hasn't been passed, attempt to read from the
    // resolved directory
    packageJsonPath = packageJsonPath ?? resolve('package.json');

    if (!existsSync(packageJsonPath)) {
        throw {
            name: ErrorCode.NPM_RESOLVE_CONFIG,
            message: 'Failed to resolve package.json',
            error: new Error().stack
        };
    }

    try {
        const packageJsonRaw = readFileSync(packageJsonPath, 'utf-8');

        try {
            return JSON.parse(packageJsonRaw);
        } catch (e) {
            throw {
                name: ErrorCode.NPM_PARSE_CONFIG,
                message: 'Failed to parse package.json',
                stack: isNativeError(e) ? e.stack : new Error().stack
            };
        }
    } catch (e) {
        throw {
            name: ErrorCode.NPM_READ_CONFIG,
            message: 'Failed to read package.json',
            stack: isNativeError(e) ? e.stack : new Error().stack
        };
    }
};
