import { DependencySpecifier, EnvMap, FilePath } from './alias';
import { Cache } from './cache';
import { PackageManager } from './package-manager';
import { TargetDescriptor, Engines, OutputFormat } from './npm';
import { WorkerFarm } from './worker-farm';
import { Dependency } from './npm';
import { InitialParcelOptions } from '@parcel/types';

export declare type DefaultTargetOptions = {
    readonly shouldOptimize?: boolean;
    readonly shouldScopeHoist?: boolean;
    readonly sourceMaps?: boolean;
    readonly publicUrl?: string;
    readonly distDir?: FilePath;
    readonly engines?: Engines;
    readonly outputFormat?: OutputFormat;
    readonly isLibrary?: boolean;
};

export type DetailedReportOptions = {
    assetsPerBundle?: number;
};

export interface CompilerOptions extends InitialParcelOptions {
    readonly entries?: FilePath | Array<FilePath>;
    /** See {@link Dependency} */
    readonly config?: DependencySpecifier;
    readonly defaultConfig?: DependencySpecifier;
    readonly env?: EnvMap;
    readonly targets?:
        | (Array<string> | Readonly<Record<string, TargetDescriptor>>)
        | null
        | undefined;
    readonly shouldDisableCache?: boolean;
    readonly cacheDir?: FilePath;
    readonly watchDir?: FilePath;
    readonly mode?: 'development' | 'production' | string;
    readonly hmrOptions?:
        | {
              port?: number;
              host?: string;
          }
        | null
        | undefined;
    readonly shouldContentHash?: boolean;
    readonly shouldAutoInstall?: boolean;
    readonly logLevel?: 'none' | 'error' | 'warn' | 'info' | 'verbose';
    readonly shouldProfile?: boolean;
    readonly shouldTrace?: boolean;
    readonly shouldPatchConsole?: boolean;
    readonly shouldBuildLazily?: boolean;
    readonly lazyIncludes?: string[];
    readonly lazyExcludes?: string[];
    readonly shouldBundleIncrementally?: boolean;
    readonly unstableFileInvalidations?: Array<{
        path: FilePath;
        type: 'create' | 'update' | 'delete';
    }>;
    readonly cache?: Cache;
    readonly workerFarm?: WorkerFarm;
    readonly packageManager?: PackageManager;
    readonly detailedReport?: DetailedReportOptions | null | undefined;
    readonly defaultTargetOptions?: DefaultTargetOptions;
    readonly additionalReporters?: Array<{
        packageName: DependencySpecifier;
        resolveFrom: FilePath;
    }>;
}
