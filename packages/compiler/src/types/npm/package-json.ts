import { FilePath, Glob, PackageName, SemverRange } from 'compiler/alias';
import { Engines } from './engines';
import { PackageTargetDescriptor } from './package-target-descriptor';

export type PackageDependencies = Record<string, string>;

export type PackageJSON = {
    name: PackageName;
    version: SemverRange;
    type?: 'module';
    main?: FilePath;
    module?: FilePath;
    types?: FilePath;
    browser?: FilePath | Record<FilePath, FilePath | boolean>;
    source?: FilePath | Array<FilePath>;
    alias?: {
        [key in PackageName | FilePath | Glob]?:
            | PackageName
            | FilePath
            | {
                  global: string;
              };
    };
    browserslist?: Array<string> | Record<string, Array<string>>;
    engines?: Engines;
    targets?: Record<string, PackageTargetDescriptor>;
    dependencies?: PackageDependencies;
    devDependencies?: PackageDependencies;
    peerDependencies?: PackageDependencies;
    sideEffects?: boolean | FilePath | Array<FilePath>;
    bin?: string | Record<string, FilePath>;
};
