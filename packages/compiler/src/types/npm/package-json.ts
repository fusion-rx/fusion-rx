import { FilePath, Glob, PackageName, SemverRange } from '../alias';
import { Engines } from '../default-target-options';
import { PackageTargetDescriptor } from './package-target-descriptor';

export declare type PackageDependencies = Record<string, string>;

export declare type PackageJSON = {
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
