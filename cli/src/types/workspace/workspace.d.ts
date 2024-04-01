import { FusionProject } from './project';

export declare interface FusionWorkspace {
    name: string;
    version: string;
    newProjectsRoot: string;
    projects: Record<string, FusionProject>;
}
