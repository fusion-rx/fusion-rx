/**
 * Extracts an argument's value from the input of process.argv given the short
 * and long form of the argument.
 * @param {string[]} args The arguments from process.argv.
 * @param {string} short The short form of the argument (i.e. `-h` for `help`)
 * @param {string} long The long form of the argument (i.e. `--help` for `help`.)
 * @returns The argument's value or undefined.
 */
export const findArgValue = (args: string[], short: string, long: string) =>
    args[(args.includes(short) ? args.indexOf(short) : args.indexOf(long)) + 1];
