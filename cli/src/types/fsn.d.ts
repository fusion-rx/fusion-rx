import { npm } from './npm';

export declare namespace Fsn {
    export type Fsn = npm.Config & {
        /** Workspace configuration for library projects. */
        workspacesConf: Workspace;
        projects: Project[];
        localDependencies?: Record<string, string>;
        customers?: Customer[];
        outDir?: string;
        bundle?: string[];
    };

    export interface Workspace {
        /**
         * The root of the workspace relative to `fsnconfig.json`.
         * If undefined, will use resolve() to determine the root.
         */
        root?: string;

        /**
         * The root of the workspace projects relative to `root`.
         * If undefined, will use `root` as the srcRoot.
         **/
        srcRoot?: string;

        /**
         * The output directory of the built projects relative to `root`.
         * If left undefined, will not create the output directory.
         */
        outDir?: string;

        /** The projects within the workspace. */
        projects: Project[];
    }

    export interface Project {
        /** The project's source, relative `root`, defined in Workspace. */
        source: string;
        /** The command used to build the project. */
        buildCommand: string;
        /** Whether the project should be built from the workspace root or the project root. */
        buildFrom: 'root' | 'project';
    }

    export interface Customer {
        /** The name of a customer. */
        name: string;

        /** The environments to which code is deployed. */
        environments: Environment[];

        /** The packages included in the compilation. */
        packages: Package[];
    }

    /**
     * The connection parameters for an application server.
     */
    export interface Environment {
        name: string;
        host: string;
        username?: string;
        password?: string;
        destination?: string;
    }

    export interface Package {
        name: string;
        location: string;
    }

    export interface WorkspaceMeta {
        /** The name of the project from package.json. */
        name: string;
        /** The root of a project. */
        root: string;
        /** The path to the project's package.json */
        pkgJSONPath: string;
        /** The project's package.json */
        pkgJSON: Fsn;
        /** The path to the project's workspace directory. */
        outPath: string;
        /** The path to the package.json in the project's out directory. */
        outFile: string;
        /** The npm command to build the workspace code. */
        buildCommand: string;
        /** Whether the project should be built from the workspace root or the project root. */
        buildFrom: 'root' | 'project';
    }
}
