import { cyan, green, red, yellow, white, magenta } from 'chalk';
import { logDateTime } from './log-date-time';

export declare type LogType = 'LOG' | 'ERROR' | 'DEBUG' | 'VERBOSE' | 'WARN';

export class Logger {
    /**
     * Create a new Logger.
     * @param component A label for the unit of code being logged
     */
    constructor(public component?: string) {
        this.component = component;
    }

    /**
     * Print a log message to stdout.
     * @param message A message to print to stdout
     * @returns void
     */
    log(...message: string[]) {
        console.log(
            this.formatLogMessage(
                'LOG',
                Array.isArray(message) ? message.join(' ') : message,
                this.component
            )
        );
    }

    /**
     * Print a debug message to stdout.
     * @param message A debug message to print to stdout.
     * @returns void
     */
    debug(...message: string[]) {
        console.debug(
            this.formatLogMessage('DEBUG', message.join(' '), this.component)
        );
    }

    /**
     * Print a verbose message to stdout.
     * @param message A verbose message to print to stdout
     * @returns void
     */
    verbose(...message: string[]) {
        console.log(
            this.formatLogMessage('VERBOSE', message.join(' '), this.component)
        );
    }

    /**
     * Print a warn message to stdout.
     * @param message A verbose message to print to stdout
     * @returns void
     */
    warn(...message: string[]) {
        console.log(
            this.formatLogMessage('WARN', message.join(' '), this.component)
        );
    }

    /**
     * Print an error message to stdout.
     * @param message An error message to print to stdout
     * @param err (optional) An error to print to stdout
     */
    error(message: string | string[], err?: any) {
        if (err) {
            console.error(
                this.formatLogMessage(
                    'ERROR',
                    err['stack'] ?? err,
                    this.component
                )
            );
        }
        console.error(
            this.formatLogMessage(
                'ERROR',
                'Error: ' +
                    (Array.isArray(message) ? message.join(' ') : message),
                this.component
            )
        );
    }

    /**
     * Prints a message of `type` to stdout.
     * @param type The type of message
     * @param message A message to log
     * @param component (optional) A component associated with the message
     */
    formatLogMessage(
        type: LogType,
        message: string | object,
        component?: string
    ) {
        const color = this.getColorByLogType(type);
        let msgColor = color;
        if (typeof message === 'object') {
            msgColor = white;
            message = JSON.stringify(message, null, 4);
        }
        return [
            green(['[FsnRx]', process.pid, '-'].join(' ')),
            logDateTime(),
            component ? yellow('[' + component + ']') : '',
            msgColor(message)
        ].join(' ');
    }

    /**
     * Finds the color associated with the log message type.
     * @param type The type of log msg
     * @returns The color associated with `type`
     */
    getColorByLogType(type: LogType) {
        switch (type) {
            case 'DEBUG':
                return yellow;
            case 'ERROR':
                return red;
            case 'LOG':
                return green;
            case 'VERBOSE':
                return cyan;
            case 'WARN':
                return magenta;
        }
    }
}

export const GlobalLogger = new Logger('FusionRx');
