import { Workspace } from './workspace-config';

export declare interface PackageJSON {
    name: string;
    version?: string;
    description?: string;
    author?: string;
    license?: string;
    workspaces: string[];
    workspacesConf: Workspace;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
}
