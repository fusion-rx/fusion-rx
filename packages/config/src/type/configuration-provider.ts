export interface ConfigurationProvider {
    /**
     * The name of the configuration collection.
     * @default app
     */
    collection: string;

    /**
     * The name of the configuration. When no name is provided, loads all
     * configuration.
     * @default undefined
     */
    name?: string;

    /**
     * Determines if an error should be thrown if the configuration module or
     * configuration name cannot be found.
     * @default false
     */
    throwNotFoundError?: boolean;

    /**
     * True if your configuration should be grouped by a prefix. This setting is only applied
     * if `dirBasedConfig` is set to `true`.
     * @example If project `x` has a set of environment configurations that should be
     * grouped by key, those configuration files that should be grouped would be
     * prepended with `env_`:
     *   - `env_ips`
     *   - `env_constants`
     *   - ... etc
     *
     * The resulting output will look like:
     * ````
     * {
     *    env: {
     *        ips: {},
     *        constants: {}
     *    }
     * }
     * ````
     */
    // groupByPrefix?: boolean;

    /** If dashes should be converted to camelcase. */
    // sanitizeKeys?: boolean;
}
