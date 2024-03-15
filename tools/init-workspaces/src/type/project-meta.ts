export declare interface ProjectMeta {
    /** The name of the project from package.json. */
    name: string;
    /** The root of a project. */
    root: string;
    /** The path to the project's package.json */
    pkgJSONPath: string;
    /** The project's package.json */
    pkgJSON: string;
    /** The path to the project's workspace directory. */
    outPath: string;
    /** The path to the package.json in the project's out directory. */
    outFile: string;
    /** The npm command to build the workspace code. */
    buildCommand: string;
    /** Whether the project should be built from the workspace root or the project root. */
    buildFrom: 'root' | 'project';
}
