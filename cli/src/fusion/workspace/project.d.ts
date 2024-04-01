export declare interface FusionProject {
    projectType: 'application' | 'library';
    root: string;
    sourceRoot: string;
    preInstall?: boolean;
    architect: {
        build: FusionBuildOptions;
        serve: FusionServeOptions;
        test: FusionTestOptions;
    };
}

export declare interface FusionBuildOptions {
    builder: 'parcel' | 'tsc';
    options: {
        outputPath: string;
        main: string;
        tsConfig: string;
        targets: any[];
    };
}

export declare interface FusionBuildTarget {
    context:
        | 'browser'
        | 'web-worker'
        | 'service-worker'
        | 'worklet'
        | 'node'
        | 'electron-main'
        | 'electron-renderer';
    outputFormat: 'esmodule' | 'commonjs' | 'global';
}

export declare interface FusionServeOptions {}

export declare interface FusionTestOptions {}
