import { readFileSync } from 'fs';

/**
 * Reads a file from disk and parses it.
 * @param path A path to a local file
 * @param readError A human-readable error message to throw if file read fails
 * @param parseError A human-readable error message to throw if file parsing fails
 * @returns Object of type T.
 * @throws Will throw an error if reading or parsing fails.
 */
export const readAndParse = <T = any>(
    path: string,
    readError?: string,
    parseError?: string
) => {
    try {
        const rawFile = readFileSync(path, 'utf-8');

        try {
            return JSON.parse(rawFile) as T;
        } catch (err) {
            if (readError) {
                (err as Error).message = readError;
            }
            throw err;
        }
    } catch (err) {
        if (parseError) {
            (err as Error).message = parseError;
        }
        throw err;
    }
};
