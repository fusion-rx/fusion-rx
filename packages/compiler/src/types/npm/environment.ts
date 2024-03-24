import { PackageName } from 'compiler/alias';
import { SourceLocation } from './dependency';
import { TargetSourceMapOptions } from './target-source-map-options';
import { Engines } from './engines';

/**
 * Options used when {@link Environment}.
 */
export type EnvironmentOptions = {
    readonly context?: EnvironmentContext;
    readonly engines?: Engines;
    readonly includeNodeModules?:
        | boolean
        | Array<PackageName>
        | Record<PackageName, boolean>;
    readonly outputFormat?: OutputFormat;
    readonly sourceType?: SourceType;
    readonly isLibrary?: boolean;
    readonly shouldOptimize?: boolean;
    readonly shouldScopeHoist?: boolean;
    readonly sourceMap?: TargetSourceMapOptions | null | undefined;
    readonly loc?: SourceLocation | null | undefined;
};

export interface Environment {
    readonly id: string;
    readonly context: EnvironmentContext;
    readonly engines: Engines;

    /** Whether to include all/none packages \
     *  (<code>true / false</code>), an array of package names to include, or an object \
     *  (of a package is not specified, it's included).
     */
    readonly includeNodeModules:
        | boolean
        | Array<PackageName>
        | Record<PackageName, boolean>;
    readonly outputFormat: OutputFormat;
    readonly sourceType: SourceType;

    /** Whether this is a library build (e.g. less loaders) */
    readonly isLibrary: boolean;

    /** Whether the output should be minified. */
    readonly shouldOptimize: boolean;

    /** Whether scope hoisting is enabled. */
    readonly shouldScopeHoist: boolean;
    readonly sourceMap: TargetSourceMapOptions | null | undefined;
    readonly loc: SourceLocation | null | undefined;

    /** Whether <code>context</code> specifies a browser context. */
    isBrowser(): boolean;

    /** Whether <code>context</code> specifies a node context. */
    isNode(): boolean;

    /** Whether <code>context</code> specifies an electron context. */
    isElectron(): boolean;

    /** Whether <code>context</code> specifies a worker context. */
    isWorker(): boolean;

    /** Whether <code>context</code> specifies a worklet context. */
    isWorklet(): boolean;

    /** Whether <code>context</code> specifies an isolated context (can't access other loaded ancestor bundles). */
    isIsolated(): boolean;
    matchesEngines(minVersions: VersionMap, defaultValue?: boolean): boolean;
    supports(feature: EnvironmentFeature, defaultValue?: boolean): boolean;
}

/** In which environment the output should run (influces e.g. bundle loaders) */
export type EnvironmentContext =
    | 'browser'
    | 'web-worker'
    | 'service-worker'
    | 'worklet'
    | 'node'
    | 'electron-main'
    | 'electron-renderer';

export type EnvironmentFeature =
    | 'esmodules'
    | 'dynamic-import'
    | 'worker-module'
    | 'service-worker-module'
    | 'import-meta-url'
    | 'arrow-functions'
    | 'global-this';

export type OutputFormat = 'esmodule' | 'commonjs' | 'global';

export type SourceType = 'script' | 'module';

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
export type VersionMap = {
    edge?: string;
    firefox?: string;
    chrome?: string;
    safari?: string;
    opera?: string;
    [browser: string]: string | undefined;
};
