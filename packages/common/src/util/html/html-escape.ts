/**
 * Sanitizes an HTML string.
 * @param html An HTML string.
 * @param values TODO: document this
 * @package Adapted from the unmaintained [escape-goat repo](https://github.com/sindresorhus/escape-goat).
 */
export function htmlEscape(html: any, ...values: any) {
    const _htmlEscape = (toReplace: string) =>
        toReplace
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

    if (typeof html === 'string') {
        return _htmlEscape(html);
    }

    let output = html[0];
    for (const [index, value] of values.entries()) {
        output = output + _htmlEscape(String(value)) + html[index + 1];
    }

    return output;
}
