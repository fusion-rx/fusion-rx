/**
 * Formats `text` in CamelCase
 * @param text A string formatted in sentence, snake, kebab, or a random case
 * @returns `text` formatted in CamelCase
 * @summary Removes all non-alphanumeric characters, splits by `\s`, `-`, and `_`,
 * and capitalizes first character of each segment.
 */
export function formatCamelCase(text: string) {
    return text
        .replace(/[^a-zA-Z_-\s]/g, '')
        .split(/[\s-_]/g)
        .map(
            (val, index) =>
                (index > 0
                    ? val.charAt(0).toUpperCase()
                    : val.charAt(0).toLowerCase()) + val.slice(1)
        )
        .join('');
}
