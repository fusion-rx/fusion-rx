// @ts-check

import chalk from 'chalk';

/**
 * Executes a task before the app exits.
 * @param {() => void} cleanup A callback that is executed
 * before the program exits.
 */
export const onAppExit = (cleanup) => {
    // Stop the program from instantly closing
    process.stdin.resume();

    /**
     * Bound to the exit processes.
     * @param {boolean} exit Whether `process.exit()` should be called
     * @param {number} exitCode The application exit code
     */
    const exitHandler = (exit, exitCode) => {
        if (exitCode || exitCode === 0) {
            console.log(
                chalk.blue(`\nTerminating process with exit code ${exitCode}.`)
            );
        }

        if (exit) process.exit();
    };

    const EXIT = 'exit';
    const CTRL_C = 'SIGINT';
    const KILL_PID_1 = 'SIGUSR1';
    const KILL_PID_2 = 'SIGUSR2';
    const UNCAUGHT = 'uncaughtException';

    process
        .on(EXIT, exitHandler.bind(cleanup))
        .on(CTRL_C, exitHandler.bind(cleanup, true))
        .on(KILL_PID_1, exitHandler.bind(cleanup, true))
        .on(KILL_PID_2, exitHandler.bind(cleanup, true))
        .on(UNCAUGHT, exitHandler.bind(cleanup));
};
