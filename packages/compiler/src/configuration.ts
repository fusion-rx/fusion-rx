import {
    EnvironmentContext,
    OutputFormat,
    PackageTargetDescriptorBase,
    TargetDescriptor
} from './types';

/**
 * Provides a function for configuring compilation targets.
 * @param distDir A file directory
 * @param context A compilation context, such as `node` or `browser`
 * @param outputFormat An output format, such as `esmodule` or `commonjs`
 * @param options Provide options that apply to the current compilation
 * @returns An {@link TargetDescriptor}
 */
export const configureTarget = (
    distDir: string,
    context: EnvironmentContext,
    outputFormat: OutputFormat,
    options?: PackageTargetDescriptorBase
): TargetDescriptor => ({
    distDir,
    context,
    outputFormat,
    ...(options ?? {})
});
