export declare interface Project {
    /** The project's source, relative to the workspace's `package.json`. */
    source: string;
    /** The command used to build the project. */
    buildCommand: string;
    /** Whether the project should be built from the workspace root or the project root. */
    buildFrom: 'root' | 'project';
}
