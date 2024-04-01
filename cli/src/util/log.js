// @ts-check

import chalk from 'chalk';

/**
 * Prints an error message, prepending by a red fail character.
 * @param {string} msg An error message to print
 * @param {any} [e] the error
 */
export const logError = (msg, e) => {
    console.error(chalk.red('✖ ') + msg);

    if (e) {
        console.error(e.stack ?? e.message);
    }
};

/**
 * Prints a warning message, prepending by a yellow warning character.
 * @param {string} msg A warning message to print
 */
export const logWarning = (msg) => {
    console.warn(chalk.yellow('⚠ ') + msg);
};

/**
 * Prints an ino message, prepending by a blue info character.
 * @param {string} msg An error message to print
 */
export const logInfo = (msg) => {
    console.log(chalk.blue('ℹ ') + msg);
};

/**
 * Prints a success message, prepending by a green check.
 * @param {string} msg An error message to print
 */
export const logSuccess = (msg) => {
    console.log(chalk.green('✔ ') + msg);
};
