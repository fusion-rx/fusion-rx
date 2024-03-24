import { FilePath, Glob } from './alias';

export type FileInvalidation = {
    filePath: FilePath;
};

export type FileAboveInvalidation = {
    fileName: string;
    aboveFilePath: FilePath;
};

export type FileCreateInvalidation =
    | FileInvalidation
    | GlobInvalidation
    | FileAboveInvalidation;

export type GlobInvalidation = {
    glob: Glob;
};

export type Invalidations = {
    invalidateOnFileCreate: Array<
        FileInvalidation | GlobInvalidation | FileAboveInvalidation
    >;
    invalidateOnFileChange: Set<FilePath>;
    invalidateOnStartup: boolean;
};
