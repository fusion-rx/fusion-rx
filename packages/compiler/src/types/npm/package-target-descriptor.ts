import { SourceLocation } from './dependency';
import { Environment, EnvironmentContext, OutputFormat } from './environment';
import { FilePath, PackageName } from '../alias';
import { TargetSourceMapOptions } from './target-source-map-options';
import { Engines } from './engines';

/**
 * The target format when using the JS API.
 *
 * (Same as PackageTargetDescriptor, but <code>distDir</code> is required.)
 */
export type TargetDescriptor = PackageTargetDescriptor & {
    readonly distDir: FilePath;
    readonly distEntry?: FilePath;
};

export type PackageTargetDescriptor = {
    readonly context?: EnvironmentContext;
    readonly engines?: Engines;
    readonly includeNodeModules?:
        | boolean
        | Array<PackageName>
        | Record<PackageName, boolean>;
    readonly outputFormat?: OutputFormat;
    readonly publicUrl?: string;
    readonly distDir?: FilePath;
    readonly sourceMap?: boolean | TargetSourceMapOptions;
    readonly isLibrary?: boolean;
    readonly optimize?: boolean;
    readonly scopeHoist?: boolean;
    readonly source?: FilePath | Array<FilePath>;
};

/**
 * A parsed version of PackageTargetDescriptor
 */
export interface Target {
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
