import { FilePath, Glob } from './alias';

export declare type FileInvalidation = {
    filePath: FilePath;
};

export declare type FileAboveInvalidation = {
    fileName: string;
    aboveFilePath: FilePath;
};

export declare type FileCreateInvalidation =
    | FileInvalidation
    | GlobInvalidation
    | FileAboveInvalidation;

export declare type GlobInvalidation = {
    glob: Glob;
};

export declare type Invalidations = {
    invalidateOnFileCreate: Array<
        FileInvalidation | GlobInvalidation | FileAboveInvalidation
    >;
    invalidateOnFileChange: Set<FilePath>;
    invalidateOnStartup: boolean;
};
