import { DependencySpecifier, FilePath } from './alias';
import { Cache } from './cache';
import { PackageManager } from './package-manager';
import { TargetDescriptor } from './npm';
import { WorkerFarm } from './worker-farm';
import { InitialParcelOptions } from '@parcel/types';
import { DefaultTargetOptions } from './default-target-options';

export declare interface CompilerOptions extends InitialParcelOptions {
    readonly entries?: FilePath | Array<FilePath>;
    /** The path to .parcelrc relative to this file. */
    readonly config?: string;
    /** The default parcel consistency, such as `@parcel/config-default` */
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
