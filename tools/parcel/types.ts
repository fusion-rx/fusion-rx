import type { InitialParcelOptions } from '@parcel/types';
import type { Cache } from '@parcel/cache';
import type WorkerFarm from '@parcel/workers';

/** An alias for string */
export declare type DependencySpecifier = string;

/** An alias for string */
export declare type FilePath = string;

/** An alias for string */
export declare type Glob = string;

/** An alias for string */
export declare type PackageName = string;

/** An alias for string */
export declare type SemverRange = string;

export declare interface CompilerOptions extends InitialParcelOptions {
    readonly entries?: FilePath | Array<FilePath>;
    /** The path to .parcelrc relative to this file. */
    readonly config?: string;
    /** The default parcel configuration to extend, such as `@parcel/config-default` */
    readonly defaultConfig?: DependencySpecifier;
    /** Proves the compiler with process.env */
    readonly env?: typeof process.env;
    /** Provide Parcel with additional targets to build. */
    readonly targets?: Array<string> | Record<string, TargetDescriptor> | null;
    /** If the parcel cache should be used when compiling. */
    readonly shouldDisableCache?: boolean;
    /** Specify the directory of the cache. */
    readonly cacheDir?: FilePath;
    /** Specify a directory to watch. */
    readonly watchDir?: FilePath;
    /** Specify an environment mode. */
    readonly mode?: 'development' | 'production' | string;
    /**
     * Enable hot reloading.
     *
     * @example
     *
     * ```typescript
     * {
     *      hmrOptions: { port: 1234, host: 'localhost' },
     *      mode: 'development',
     *      additionalReporters: [
     *          { packageName: '@parcel ... ' }
     *      ]
     * }
     *
     * const options = {
     *      ...
     *      hmrOptions: { port: 3000, host: '0.0.0.0' } }),
     *      ...
     * }
     *
     * const bundler = new parcel.Parcel(options);
     *
     * const watch = async () => {
     *      return await bundler.watch((err, event) => {
     *          if (err) { // fatal error throw err }
     *
     *          if (event?.type === 'buildSuccess') {
     *              let bundles = event.bundleGraph.getBundles();
     *              console.log(
     *                  `✨ Built ${bundles.length} bundles in ${event.buildTime}ms!`
     *              )
     *          } else if (event?.type === 'buildFailure') {
     *              console.error(event.diagnostics);
     *          }
     *      }
     * }
     * ```
     */
    readonly hmrOptions?: {
        port?: number;
        host?: string;
    } | null;
    /**
     * If true, Parcel will automatically inlcude content hashes in the names
     * of all output files, which enables long-term browser caching.
     * This includes static assets like images, scripts, and CSS files.
     */
    readonly shouldContentHash?: boolean;
    /**
     * If true, Parcel will automatically install necessary dependencies for
     * languages or plugins that aren't included by default.
     */
    readonly shouldAutoInstall?: boolean;
    /** Specify the logs output by the compiler. */
    readonly logLevel?: 'none' | 'error' | 'warn' | 'info' | 'verbose';

    readonly shouldProfile?: boolean;
    /**
     * If true, Parcel will generate a profile report with a tracer reporter
     * specified in `additionalReporters`.
     */
    readonly shouldTrace?: boolean;
    /** @docToDo */
    readonly shouldPatchConsole?: boolean;
    /** @docToDo */
    readonly shouldBuildLazily?: boolean;
    /** @docToDo */
    readonly lazyIncludes?: string[];
    /** @docToDo */
    readonly lazyExcludes?: string[];
    /** @docToDo */
    readonly shouldBundleIncrementally?: boolean;
    /** @docToDo */
    readonly unstableFileInvalidations?: Array<{
        path: FilePath;
        type: 'create' | 'update' | 'delete';
    }>;
    /** Provide a custom cache to your parcel build. */
    readonly cache?: Cache;
    /** Implement custom "multi-threading", such as 'web workers' or Node's 'worker threads' */
    readonly workerFarm?: WorkerFarm;
    /** TODO - Documentation */
    readonly packageManager?: PackageManager;
    /** Specify the number of assets for which the build report will print details. */
    readonly detailedReport?: {
        assetsPerBundle?: number;
    } | null;
    /** Specify options for the default target build. */
    readonly defaultTargetOptions?: DefaultTargetOptions;
    /** Provide parcel with additional reporters. */
    readonly additionalReporters?: Array<{
        /**
         * Defines the location of a dependency in relation to the file that imports it.
         * @docToDo Accuracy
         **/
        packageName: DependencySpecifier;
        /**
         * Proves the location from which `packageName` should be resolved.
         * @docToDo Accuracy
         */
        resolveFrom: FilePath;
    }>;
}

/**
 * The target format when using the JS API. Same as {@link PackageTargetDescriptor},
 * but `distDir` is required.
 */
export declare type TargetDescriptor = PackageTargetDescriptor & {
    readonly distDir: FilePath;
    readonly distEntry?: FilePath;
};

export declare type PackageTargetDescriptor = PackageTargetDescriptorBase & {
    readonly context?: EnvironmentContext;
    readonly engines?: Engines;
    readonly outputFormat?: OutputFormat;
    readonly distDir?: FilePath;
};

export declare type PackageTargetDescriptorBase = {
    readonly includeNodeModules?:
        | boolean
        | Array<PackageName>
        | Record<PackageName, boolean>;
    readonly publicUrl?: string;
    readonly sourceMap?: boolean | TargetSourceMapOptions;
    /**
     * Specifies whether this is a library build. Setting to `true`
     * results in fewer loaders.
     **/
    readonly isLibrary?: boolean;
    readonly optimize?: boolean;
    readonly scopeHoist?: boolean;
    readonly source?: FilePath | Array<FilePath>;
};

export declare type OutputFormat = 'esmodule' | 'commonjs' | 'global';

export declare type Engines = {
    readonly browsers?: string | Array<string>;
    readonly electron?: SemverRange;
    readonly node?: SemverRange;
    readonly parcel?: SemverRange;
};

/** In which environment the output should run (influces e.g. bundle loaders) */
export declare type EnvironmentContext =
    | 'browser'
    | 'web-worker'
    | 'service-worker'
    | 'worklet'
    | 'node'
    | 'electron-main'
    | 'electron-renderer';

export declare type TargetSourceMapOptions = {
    readonly sourceRoot?: string;
    readonly inline?: boolean;
    readonly inlineSources?: boolean;
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

export declare interface Environment {
    readonly id: string;
    readonly context: EnvironmentContext;
    readonly engines: Engines;

    /**
     * One of...
     * - `boolean`: Whether to include all (true) or no (false) packages
     * - an array of package names to include
     * - an object (of a package is not specified, it's included).
     */
    readonly includeNodeModules:
        | boolean
        | Array<PackageName>
        | Record<PackageName, boolean>;
    readonly outputFormat: OutputFormat;
    readonly sourceType: 'script' | 'module';

    /**
     * Specifies whether this is a library build. Setting to `true`
     * results in fewer loaders.
     **/
    readonly isLibrary: boolean;

    /** Whether the output should be minified. */
    readonly shouldOptimize: boolean;

    /**
     * Define whether Parcel should use scope hositing for this target build.
     *
     * @definition
     * Scope hoisting is a technique used by Parcel to combine modules into
     * a single scope in production builds. This technique improves
     * runtime performance and makes minification more effective. Scope hoisting works by:
     * 1. Analyzing each module independently and in parallel
     * 1. Concatenating the modules together
     * 1. Renaming the top-level variables of each module to ensure they are unique
     * 1. Renaming imported variables to match the exported variable names from the resolved module
     * 1. Removing any unused exports
     */
    readonly shouldScopeHoist: boolean;
    readonly sourceMap: TargetSourceMapOptions | null | undefined;
    readonly loc: SourceLocation | null | undefined;

    /** Whether `context` specifies a browser context. */
    isBrowser(): boolean;

    /** Whether `context` specifies a node context. */
    isNode(): boolean;

    /** Whether `context` specifies an electron context. */
    isElectron(): boolean;

    /** Whether `context` specifies a worker context. */
    isWorker(): boolean;

    /** Whether `context` specifies a worklet context. */
    isWorklet(): boolean;

    /** Whether `context` specifies an isolated context (can't access other loaded ancestor bundles). */
    isIsolated(): boolean;
    matchesEngines(minVersions: VersionMap, defaultValue?: boolean): boolean;
    supports(
        feature:
            | 'esmodules'
            | 'dynamic-import'
            | 'worker-module'
            | 'service-worker-module'
            | 'import-meta-url'
            | 'arrow-functions'
            | 'global-this',
        defaultValue?: boolean
    ): boolean;
}

/**
 * A resolved browserslist.
 *
 * @example
 * ````ts
 * {
 *   edge: '76',
 *   firefox: '67',
 *   chrome: '63',
 *   safari: '11.1',
 *   opera: '50',
 * }
 * ````
 */
export declare type VersionMap = {
    edge?: string;
    firefox?: string;
    chrome?: string;
    safari?: string;
    opera?: string;
    [browser: string]: string | undefined;
};

/**
 * The location within the source file where the dependency was found.
 * Source locations are 1-based, meaning lines and columns start at 1
 */
export declare type SourceLocation = {
    readonly filePath: string;

    /** inclusive */
    readonly start: {
        readonly line: number;
        readonly column: number;
    };

    /** exclusive */
    readonly end: {
        readonly line: number;
        readonly column: number;
    };
};

export declare interface PackageManager {
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

export declare type ResolveResult = {
    resolved: FilePath | DependencySpecifier;
    pkg?: PackageJSON | null | undefined;
    invalidateOnFileCreate: Array<
        FileInvalidation | GlobInvalidation | FileAboveInvalidation
    >;
    invalidateOnFileChange: Set<FilePath>;
    type: number;
};

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
    dependencies?: { [packageName: string]: string };
    devDependencies?: { [packageName: string]: string };
    peerDependencies?: { [packageName: string]: string };
    sideEffects?: boolean | FilePath | Array<FilePath>;
    bin?: string | Record<string, FilePath>;
};

export declare type Invalidations = {
    invalidateOnFileCreate: Array<
        FileInvalidation | GlobInvalidation | FileAboveInvalidation
    >;
    invalidateOnFileChange: Set<FilePath>;
    invalidateOnStartup: boolean;
};

export declare type FileInvalidation = {
    filePath: FilePath;
};

export declare type FileAboveInvalidation = {
    fileName: string;
    aboveFilePath: FilePath;
};

export declare type GlobInvalidation = {
    glob: Glob;
};

export declare type DefaultTargetOptions = {
    readonly shouldOptimize?: boolean;
    /**
     * Define whether Parcel should use scope hositing for this target build.
     *
     * @definition
     * Scope hoisting is a technique used by Parcel to combine modules into
     * a single scope in production builds. This technique improves
     * runtime performance and makes minification more effective. Scope hoisting works by:
     * 1. Analyzing each module independently and in parallel
     * 1. Concatenating the modules together
     * 1. Renaming the top-level variables of each module to ensure they are unique
     * 1. Renaming imported variables to match the exported variable names from the resolved module
     * 1. Removing any unused exports
     */
    readonly shouldScopeHoist?: boolean;
    /** Whether Parcel should produce source maps. */
    readonly sourceMaps?: boolean;
    /** @docToDo */
    readonly publicUrl?: string;
    /** Specify the path to the compiled output directory. */
    readonly distDir?: string;
    /** Specify the platforms for which this target is being compiled. */
    readonly engines?: Engines;
    /** Specify the format of the compilation, such as `esmodule` or `commonjs`. */
    readonly outputFormat?: OutputFormat;
    /**
     * Specifies whether this is a library build. Setting to `true`
     * results in fewer loaders.
     **/
    readonly isLibrary?: boolean;
};
