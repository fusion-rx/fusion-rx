import { Environment } from './environment';
import { MutableDependencySymbols } from './mutable-dependency-symbol';
import { JSONObject } from '../json';
import { DependencySpecifier, SemverRange } from '../alias';
import { Target } from './package-target-descriptor';

export declare type SpecifierType = 'commonjs' | 'esm' | 'url' | 'custom';
export declare type DependencyPriority = 'sync' | 'parallel' | 'lazy';
export declare type BundleBehavior = 'inline' | 'isolated';

/**
 * The location within the source file where the dependency was found.
 * Source locations are 1-based, meaning lines and columns start at 1
 */
export declare type SourceLocation = {
    readonly filePath: string;

    /** inclusive */
    readonly start: {
        readonly line: number;
        readonly column: number;
    };

    /** exclusive */
    readonly end: {
        readonly line: number;
        readonly column: number;
    };
};

/**
 * A Dependency denotes a connection between two assets \
 * (likely some effect from the importee is expected - be it a side effect or a value is being imported).
 *
 * @section transformer
 */
export declare interface Dependency {
    /** The id of the dependency. */
    readonly id: string;

    /** A specifier used to resolve the dependency. */
    readonly specifier: DependencySpecifier;

    /**
     * How the specifier should be interpreted.
     *   - esm: An ES module specifier. It is parsed as a URL, but bare specifiers are treated as node_modules.
     *   - commonjs: A CommonJS specifier. It is not parsed as a URL.
     *   - url: A URL that works as in a browser. Bare specifiers are treated as relative URLs.
     *   - custom: A custom specifier. Must be handled by a custom resolver plugin.
     */
    readonly specifierType: SpecifierType;

    /**
     * When the dependency should be loaded.
     *   - sync: The dependency should be resolvable synchronously. The resolved asset will be placed
     *       in the same bundle as the parent, or another bundle that's already on the page.
     *   - parallel: The dependency should be placed in a separate bundle that's loaded in parallel
     *       with the current bundle.
     *   - lazy: The dependency should be placed in a separate bundle that's loaded later.
     * @default 'sync'
     */
    readonly priority: DependencyPriority;

    /**
     * Controls the behavior of the bundle the resolved asset is placed into. Use in combination with `priority`
     * to determine when the bundle is loaded.
     *   - inline: The resolved asset will be placed into a new inline bundle. Inline bundles are not written
     *       to a separate file, but embedded into the parent bundle.
     *   - isolated: The resolved asset will be isolated from its parents in a separate bundle.
     *       Shared assets will be duplicated.
     */
    readonly bundleBehavior: BundleBehavior | null | undefined;

    /**
     * When the dependency is a bundle entry (priority is "parallel" or "lazy"), this controls the naming
     * of that bundle. `needsStableName` indicates that the name should be stable over time, even when the
     * content of the bundle changes. This is useful for entries that a user would manually enter the URL
     * for, as well as for things like service workers or RSS feeds, where the URL must remain consistent
     * over time.
     */
    readonly needsStableName: boolean;

    /** Whether the dependency is optional. If the dependency cannot be resolved, this will not fail the build. */
    readonly isOptional: boolean;

    /** Whether the dependency is an entry. */
    readonly isEntry: boolean;

    readonly loc: SourceLocation | null | undefined;

    /** The environment of the dependency. */
    readonly env: Environment;

    /**
     * A list of custom conditions to use when resolving package.json "exports" and "imports".
     * This is combined with the conditions from the environment. However, it overrides the
     * default "import" and "require" conditions inferred from the specifierType. To include those
     * in addition to custom conditions, explicitly add them to this list.
     */
    readonly packageConditions: Array<string> | null | undefined;

    /** Plugin-specific metadata for the dependency. */
    readonly meta: JSONObject;

    /** If this is an entry, this is the target that is associated with that entry. */
    readonly target: Target | null | undefined;

    /** The id of the asset with this dependency. */
    readonly sourceAssetId: string | null | undefined;

    /** The file path of the asset with this dependency. */
    readonly sourcePath: string | null | undefined;

    /** The type of the asset that referenced this dependency. */
    readonly sourceAssetType: string | null | undefined;

    /**
     * The file path where the dependency should be resolved from.
     * By default, this is the path of the source file where the dependency was specified.
     */
    readonly resolveFrom: string | null | undefined;

    /** The semver version range expected for the dependency. */
    readonly range: SemverRange | null | undefined;

    /** The pipeline defined in .parcelrc that the dependency should be processed with. */
    readonly pipeline: string | null | undefined;
    // TODO make immutable

    /** The symbols within the resolved module that the source file depends on. */
    readonly symbols: MutableDependencySymbols;
}
