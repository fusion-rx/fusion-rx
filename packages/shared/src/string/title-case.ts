import { join } from './join';

/**
 * Formats a dash-delimited string as camel case.
 * @param text The string to manipulate.
 * @returns A string with dashes removed and text following dashes converted to upper-case.
 */
export const titleCase = (text: string, delimiter: RegExp) =>
    join(
        ...text
            .split(delimiter)
            .map((text) => text.charAt(0).toUpperCase() + text.slice(1)),
        ' '
    );
