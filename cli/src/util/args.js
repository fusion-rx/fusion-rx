// @ts-check

/**
 * CLI arguments with node pathing removed.
 */
export const args = process.argv.slice(2);

/**
 * Extracts an argument's value from the input of process.argv given the short
 * and long form of the argument.
 * @param {string} short The short form of the argument (i.e. `-h` for `help`)
 * @param {string} long The long form of the argument (i.e. `--help` for `help`.)
 * @returns The argument's value or undefined.
 */
export const arg = (short, long) => {
    let foundArg = args.includes(short)
        ? short
        : args.includes(long)
          ? long
          : undefined;

    if (foundArg) return args[args.indexOf(foundArg) + 1];

    return;
};
