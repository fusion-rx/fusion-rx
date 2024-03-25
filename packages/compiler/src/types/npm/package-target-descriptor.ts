import { SourceLocation } from './dependency';
import { Environment, EnvironmentContext } from './environment';
import { FilePath, PackageName } from '../alias';
import { TargetSourceMapOptions } from './target-source-map-options';
import { Engines, OutputFormat } from '../default-target-options';

export declare type PackageTargetDescriptorBase = {
    readonly includeNodeModules?:
        | boolean
        | Array<PackageName>
        | Record<PackageName, boolean>;
    readonly publicUrl?: string;
    readonly sourceMap?: boolean | TargetSourceMapOptions;
    readonly isLibrary?: boolean;
    readonly optimize?: boolean;
    readonly scopeHoist?: boolean;
    readonly source?: FilePath | Array<FilePath>;
};

export declare type PackageTargetDescriptor = PackageTargetDescriptorBase & {
    readonly context?: EnvironmentContext;
    readonly engines?: Engines;
    readonly outputFormat?: OutputFormat;
    readonly distDir?: FilePath;
};

/**
 * The target format when using the JS API. Same as {@link PackageTargetDescriptor},
 * but `distDir` is required.
 */
export declare type TargetDescriptor = PackageTargetDescriptor & {
    readonly distDir: FilePath;
    readonly distEntry?: FilePath;
};

/**
 * A parsed version of {@link PackageTargetDescriptor}
 */
export declare interface Target {
    /** The output filename of the entry */
    readonly distEntry: FilePath | null | undefined;

    /** The output folder */
    readonly distDir: FilePath;
    readonly env: Environment;
    readonly name: string;
    readonly publicUrl: string;

    /** The location that created this Target, e.g. `package.json#main`*/
    readonly loc: SourceLocation | null | undefined;
}
