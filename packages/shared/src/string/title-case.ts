import { join } from './join.js';

/**
 * Formats a dash-delimited string as camel case.
 * @param text The string to manipulate.
 * @param delimiter A regular expression with which to split `text`.
 * @returns A string with dashes removed and text following dashes converted to upper-case.
 *
 * @publicApi
 */
export const titleCase = (text: string, delimiter: RegExp) =>
    join(
        ...text
            .split(delimiter)
            .map((text) => text.charAt(0).toUpperCase() + text.slice(1)),
        ' '
    );
