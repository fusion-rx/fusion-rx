import ts from 'typescript';
import { npm } from './npm';

export declare type FusionCompilerOptions = {
    /** The name of the project to be compiled. */
    projectName: string;
    /** The entry-point of the project. */
    main: string;
    /**
     * The name or names of the files at the root of the compilation,
     * such as the public-api for libraries or the main.ts for projects.
     **/
    rootNames: string | string[];
    /** The root of the project that is being compiled. */
    projectRoot: string;
    /** The output directory of the project. */
    outDir: string;
    /**
     * The typescript compiler options, with options required for
     * Fusion builds updated, and the base
     */
    tscOptions: ts.CompilerOptions;

    /** The project's package.json file. */
    packageJSON?: npm.Config;
    /** If the compilation should be recompiled when the file system changes. */
    watch?: boolean;

    tsConfigFileName: string;
};
