/**
 * Appends `'` or `'s` to a string to make it possessive.
 * @param text The text to make possessive
 * @returns The possessive of a string, such as `Alexander => Alexander's`,
 * or `Carlos => Carlos'`
 *
 * @publicApi
 */
export function makePossessive(text: string) {
    return text + (text.endsWith('s') ? `'` : `'s`);
}
