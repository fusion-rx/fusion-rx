import { Project } from './project';

export declare interface Workspace {
    /** The root of the workspace's projects. */
    srcRoot: string;
    /** The output directory of the built projects, relative to the workspace's `package.json`. */
    outDir: string;
    /** The projects within the workspace. */
    projects: Project[];
}
