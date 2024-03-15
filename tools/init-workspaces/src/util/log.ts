import { exit } from 'process';

/** Available console colors. */
declare type Color = 'Reset' | 'Red' | 'Green' | 'Yellow' | 'Cyan' | 'White';

/**
 * Colors that can be printed to the console.
 */
const Colors: Record<Color, string> = {
    Reset: '\x1b[0m',
    Red: '\x1b[31m',
    Green: '\x1b[32m',
    Yellow: '\x1b[33m',
    Cyan: '\x1b[36m',
    White: '\x1b[37m'
};

/** Available log types. */
declare type MsgType = 'LOG' | 'ERROR' | 'DEBUG' | 'VERBOSE';

/**
 * Finds the color associated with the log message type.
 * @param type The type of log msg
 * @returns The color associated with `type`
 */
const getColorByLogType = (type: MsgType) => {
    switch (type) {
        case 'DEBUG':
            return 'Yellow';
        case 'ERROR':
            return 'Red';
        case 'VERBOSE':
            return 'Cyan';
        default:
            return 'Green';
    }
};

/**
 * Colors a string for printing to stdout.
 * @param color A {@link Color}
 * @param message A string or object to colorize
 */
const colorize = (color: Color, message: string | object) => {
    if (Buffer.isBuffer(message)) {
        message = message.toString('utf-8');
    } else if (typeof message === 'object') {
        message = JSON.stringify(message, null, 4);
    }

    return Colors[color] + message + Colors.Reset;
};

/**
 * Prepends a zero to single-digit numbers.
 */
const twoDigits = (num: number) => (num < 10 ? '0' : '') + num;

/**
 * Gets the current date/time in a log-friendly format.
 * @param date A date
 * @returns The current date/time in a log-friendly format.
 */
const now = () => {
    const date = new Date();

    const amPm = date.getHours() > 12 ? ' PM' : ' AM';

    return [
        [
            twoDigits(date.getMonth() + 1),
            twoDigits(date.getDate()),
            date.getFullYear()
        ].join('/'),
        [
            twoDigits(date.getHours() % 12),
            twoDigits(date.getMinutes()),
            twoDigits(date.getSeconds())
        ].join(':') + amPm
    ].join(', ');
};

/**
 * Prints a message of `type` to stdout.
 * @param type The typeo of the message.
 * @param message A message to log
 * @param component A component associated with the message=
 */
const formatLogMessage = (
    type: MsgType,
    message: string | object,
    component?: string
) => {
    const color = getColorByLogType(type);
    let colorCode: Color = color;

    if (typeof message === 'object') {
        colorCode = 'White';
        message = JSON.stringify(message, null, 4);
    }

    return [
        colorize('Green', ['[FsnRx]', process.pid, '-'].join(' ')),
        now(),
        colorize(color, type),
        component ? colorize('Yellow', '[' + component + ']') : '',
        colorize(colorCode, message)
    ].join(' ');
};

export class FsnLogger {
    constructor(
        public component: string,
        private _beforeExit?: () => void
    ) {}

    /**
     * Prints a log message to stdout.
     * @param {string} message A message to print to stdout.
     * @returns void
     */
    public log(...message: string[]) {
        console.log(
            formatLogMessage(
                'LOG',
                Array.isArray(message) ? message.join(' ') : message,
                this.component
            )
        );
    }

    /**
     * Prints a debug message to stdout.
     * @param message A debug message to print to stdout.
     * @returns void
     */
    public debug(...message: string[]) {
        console.debug(
            formatLogMessage('DEBUG', message.join(' '), this.component)
        );
    }

    /**
     * Prints a verbose message to stdout.
     * @param {string} message A verbose message to print to stdout.
     * @returns void
     */
    public verbose(...message: string[]) {
        console.log(
            formatLogMessage('VERBOSE', message.join(' '), this.component)
        );
    }

    /**
     * Prints an error message to stdout.
     * @param message An error message to print to stdout.
     * @param err (optional) An error to print to stdout.
     * @param kill (optional) If the program should exit after the error is logged.
     * Defaults to true.
     */
    error(message: string | string[], err?: Error, kill = true) {
        const logErr = (message: string | any[]) => {
            console.error(
                formatLogMessage(
                    'ERROR',
                    'Error: ' +
                        (Array.isArray(message) ? message.join(' ') : message) +
                        (kill ? ' Exiting.' : ''),
                    this.component
                )
            );
        };

        logErr(message);

        if (err) {
            console.error(formatLogMessage('ERROR', err['stack'] ?? err));
        }

        if (kill) {
            if (this._beforeExit) {
                try {
                    this._beforeExit();
                } catch (e) {
                    logErr('Failed to execute post-exit tasks.');
                }
            }

            exit();
        }
    }
}
