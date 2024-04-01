export declare namespace npm {
    interface ConfigBase {
        name: string;
        version?: string;
        description?: string;
        author?: string;
        license?: string;
        dependencies?: Record<string, string>;
        peerDependencies?: Record<string, string>;
        main?: string;
        module?: string;
        types?: string;
        bin?: any;
        exports?: any;
    }

    export interface Config extends ConfigBase {
        private?: boolean;
        devDependencies?: Record<string, string>;
        scripts?: Record<string, string>;
        jest?: Record<string, string>;
        workspaces?: string[];
        contributors?: string[];
    }

    export interface ConfigModules {
        main: string;
        module?: string;
        types: string;
    }

    export interface ConfigExports {
        /** Entry-point for `import "my-package"` in ESM */
        // import: {
        //     /** Where TypeScript will look. */
        //     default: string;
        //     /** File from which TypeScript will resolve types. */
        //     types: string;
        // };
        /** ESM entry-point */
        import: string;
        /** Commonjs entry-point */
        require: string;
        /** Commonjs type resolver */
        types: string;
        /** The default export. */
        default: string;
    }

    export interface ConfigLib extends ConfigBase, ConfigModules {
        type?: 'module' | 'commonjs';
        exports?: {
            './package.json': {
                default: string;
            };
            '.': ConfigExports;
            './browser'?: ConfigExports;
        };
    }
}
