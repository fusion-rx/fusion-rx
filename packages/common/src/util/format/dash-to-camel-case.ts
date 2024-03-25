import { squish } from '../string';

/**
 * Formats a dash-delimited string as camel case.
 * @param text The string to manipulate.
 * @returns A string with dashes removed and text following dashes converted to upper-case.
 * @deprecated Use `formatCamelCase` instead. This method will be removed in a future release.
 */
export function dashToCamelCase(text: string) {
    const cc = squish(
        ...text
            .split('-')
            .map((text) => text.charAt(0).toUpperCase() + text.slice(1))
    );

    return cc.charAt(0).toLowerCase() + cc.slice(1);
}
