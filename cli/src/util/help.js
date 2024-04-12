// @ts-check

import chalk from 'chalk';

import { colorCLITags } from './color-cli-tags.js';

/**
 * Formats and prints the `help.txt`.
 * @param {string} helpText The path to the `help.txt file.
 */
export const printHelp = (helpText) => {
    const helpFormatted = helpText
        .split(/\n/g)
        .map((ln) => {
            ln = colorCLITags(ln, chalk.blue, '[', ']');
            ln = colorCLITags(ln, chalk.yellow, '<', '>');

            if (ln.trim().startsWith('fsn')) {
                const fsnIndex = ln.indexOf('fsn');

                let hitIndex = false;
                let endIndex = ln.length;

                out: for (let i = fsnIndex; i < ln.length; i++) {
                    if (ln.charAt(i) === ' ') {
                        if (hitIndex === true) {
                            endIndex = i;
                            break out;
                        }
                        hitIndex = true;
                    }
                }

                ln =
                    ln.substring(0, ln.indexOf('fsn') + 3) +
                    chalk.green(ln.substring(ln.indexOf('fsn') + 3, endIndex)) +
                    ln.substring(endIndex, ln.length);
            }

            return ln;
        })
        .join('\n');

    console.log(helpFormatted);
};
