import { SemverRange } from './alias';

export declare type OutputFormat = 'esmodule' | 'commonjs' | 'global';

export declare type Engines = {
    readonly browsers?: string | Array<string>;
    readonly electron?: SemverRange;
    readonly node?: SemverRange;
    readonly parcel?: SemverRange;
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
     * Specifies whether the compilation is a library.
     * @docToDo Details
     **/
    readonly isLibrary?: boolean;
};
