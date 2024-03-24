export declare interface FusionWorkspaces {
    name: string;
    version: string;
    newProjectRoot?: string;
    workspace?: FusionWorkspace;
    workspaces?: Record<string, FusionWorkspace>;
}

export declare interface FusionWorkspace {
    root?: string;
    srcRoot?: string;
    outDir: string;
    preInstall?: boolean;
    projects: FusionProject[];
}

export declare interface FusionProject {
    source: string;
    buildCommand: string;
    buildFrom: 'root' | 'project';
}
