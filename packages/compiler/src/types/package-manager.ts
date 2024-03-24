import { DependencySpecifier, FilePath, SemverRange } from './alias';
import {
    FileAboveInvalidation,
    FileInvalidation,
    GlobInvalidation,
    Invalidations
} from './file-create-invalidation';
import { PackageJSON } from './npm';

export interface PackageManager {
    require(
        id: DependencySpecifier,
        from: FilePath,
        arg2:
            | {
                  range?: SemverRange | null | undefined;
                  shouldAutoInstall?: boolean;
                  saveDev?: boolean;
              }
            | null
            | undefined
    ): Promise<any>;
    resolve(
        id: DependencySpecifier,
        from: FilePath,
        arg2:
            | {
                  range?: SemverRange | null | undefined;
                  shouldAutoInstall?: boolean;
                  saveDev?: boolean;
              }
            | null
            | undefined
    ): Promise<ResolveResult>;
    getInvalidations(id: DependencySpecifier, from: FilePath): Invalidations;
    invalidate(id: DependencySpecifier, from: FilePath): void;
}

export type ResolveResult = {
    resolved: FilePath | DependencySpecifier;
    pkg?: PackageJSON | null | undefined;
    invalidateOnFileCreate: Array<
        FileInvalidation | GlobInvalidation | FileAboveInvalidation
    >;
    invalidateOnFileChange: Set<FilePath>;
    type: number;
};
