// @ts-check

/**
 * @param {string} line A line of CLI help text
 * @param {import('chalk').ChalkInstance} color A color to apply to a section of `line`
 * @param {string} startChar The start character of the section to color
 * @param {string} [endChar] The end character of the section to color
 */
export const colorCLITags = (line, color, startChar, endChar) => {
    const argStart = line.indexOf(startChar);
    const argEnd = endChar ? line.indexOf(endChar) : line.length;

    if (argStart > -1 && argEnd > -1) {
        line =
            line.substring(0, argStart) +
            ' ' +
            color(line.substring(argStart, argEnd + 1)) +
            ' ' +
            line.substring(argEnd + 1, line.length);
    }

    return line;
};
