import chalk from 'chalk';
/**
 * Holds all the exit events to be executed before the Node
 * application is terminated.
 */
const exitEvents: Function[] = [];

/**
 * Registers an event to execute before the Fusion application termination.
 * @param event An event to execute before the app termination
 *
 * @publicApi
 */
export const registerOnExitEvent = (event: Function) => {
    exitEvents.push(event);
};

/**
 * Implement `errorHandler` to catch uncaught errors and/or to
 * log meaningful errors.
 * @param options Specifies options for handling uncaught errors.
 *
 * @publicApi
 */
export const handleErrors = (options: { exitOnUncaught: boolean }) => {
    // Stop the program from instantly closing
    process.stdin.resume();
    /**
     * Bound to the exit processes.
     * @param exitCode The application exit code
     * @param error If an error is thrown for uncaught errors
     * @param exit Whether `process.exit()` should be called
     */
    const exitHandler = (
        exitCode: string | number,
        error?: any,
        exit?: boolean
    ) => {
        if (exitCode !== -1) {
            const msg = (() => {
                if (typeof exitCode !== 'string') return;
                switch (exitCode) {
                    case EXIT:
                        return chalk.blue(
                            `\nTerminating process with exit code ${exitCode}.`
                        );
                    default:
                        return chalk.blue('\n Application terminated');
                }
            })();
            if (msg) console.log(msg);
        }
        if (error) {
            console.error('An uncaught exception occurred:');
            console.error(error);
        }
        if (exit !== false) {
            exitEvents.forEach((event) => event());
            process.exit();
        }
    };
    const EXIT = 'exit';
    const CTRL_C = 'SIGINT';
    const KILL_PID_1 = 'SIGUSR1';
    const KILL_PID_2 = 'SIGUSR2';
    const UNCAUGHT = 'uncaughtException';
    process
        .on(EXIT, (code) => exitHandler(code))
        .on(CTRL_C, (code) => exitHandler(code))
        .on(KILL_PID_1, (code) => exitHandler(code))
        .on(KILL_PID_2, (code) => exitHandler(code))
        .on(UNCAUGHT, (error) => {
            var _a;
            return exitHandler(
                -1,
                error,
                (_a = options.exitOnUncaught) !== null && _a !== void 0
                    ? _a
                    : false
            );
        });
};
