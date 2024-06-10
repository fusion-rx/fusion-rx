import { join } from 'path';
import { existsSync, readFileSync, readdirSync } from 'fs';

import type { Collection } from '../interface/collection.js';

/**
 * Cleans the metadata from a filename.
 * @param {string} projectName the name of the project to clean from the filename.
 * @param {string} filename The filename to clean.
 * @returns A clean string.
 */
const cleanFilename = (projectName: string = '', filename: string) => {
    const regexp = new RegExp('(' + projectName + '|\\.|config|json)', 'g');
    return filename.replace(regexp, '');
};

/**
 * Reads a collection's files.
 * @param {string} collectionName The name of the collection to read.
 * @param {object} project The name of the overload project.
 * @returns An object whose keys are the collection's clean filenames and whose
 * values are the parsed collection files.
 */
export const readCollection = (
    collectionName: string,
    collection: Collection,
    baseURL: string,
    project?: string
) => {
    /**
     * - **key**: cleaned filename
     * - **value**: parsed file
     */
    const parsedCollectionFiles = {} as any;

    /** An array of the path segments to the collection, only including project if it is nonNullable. */
    const collectionPath = project
        ? [baseURL, collectionName, project]
        : [baseURL, collectionName];

    /** Files that will be included in the build. */
    const exprts = collection.exports ?? '*';

    /** Files that exist in the collection's directory. */
    const collectionFiles = readdirSync(join(...collectionPath));

    collectionFiles.forEach((collectionFile: string) => {
        const cleanFlnm = cleanFilename(project, collectionFile);

        if (
            (typeof exprts === 'string' && exprts === '*') ||
            (Array.isArray(exprts) && exprts.includes(cleanFlnm))
        ) {
            const collectionFilePath = join(...collectionPath, collectionFile);

            if (existsSync(collectionFilePath)) {
                try {
                    parsedCollectionFiles[cleanFlnm] = JSON.parse(
                        readFileSync(collectionFilePath, 'utf-8')
                    );
                } catch (e) {
                    console.error(
                        'Error: Failed to read collection file at "' +
                            collectionFilePath +
                            '".'
                    );
                }
            }
        }
    });

    return parsedCollectionFiles;
};
