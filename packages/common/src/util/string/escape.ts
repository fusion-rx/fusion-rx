/**
 * @param val The string to be modified.
 * @returns A string wrapped in double quotation marks.
 */
export const escape = (val: string): string =>
    val.replace(/\//g, '').replace(/\./g, '');
