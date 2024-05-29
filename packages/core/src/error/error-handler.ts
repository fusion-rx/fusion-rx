import { exit } from 'process';

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
 * Executes the on-exit events registered with
 * `registerOnExitEvent`.
 */
const executeOnExitEvents = () => {
    console.log();
    exitEvents.forEach((evt) => {
        try {
            evt();
        } catch (e) {
            console.error('Failed to execute on exit event:');
            console.error(e);
        }
    });
    exit();
};

const EXIT = 'exit';
/** CTRL+C */
const SIGINT = 'SIGINT';
/** KILL PID (ex. Nodemon) */
const KILL_PID_1 = 'SIGUSR1';
/** KILL PID (ex. Nodemon) */
const KILL_PID_2 = 'SIGUSR2';
/** Uncaught Exceptions */
const UNCAUGHT = 'uncaughtException';

/**
 * Events that should terminate the application, regardless of
 * user preferences.
 **/
const KILL_SIGNALS = [SIGINT, KILL_PID_1, KILL_PID_2];

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

    // Register the signals that should execute on-exit events
    KILL_SIGNALS.forEach((evt) => {
        process.on(evt, () => executeOnExitEvents());
    });

    process
        .on(EXIT, () => exit())
        .on(UNCAUGHT, (error, origin) => {
            console.error('An uncaught exception occurred:');
            console.error(error);
            console.error(origin);
            if (options.exitOnUncaught) {
                executeOnExitEvents();
            }
        });
};
