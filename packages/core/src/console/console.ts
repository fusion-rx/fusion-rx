import Chalk from 'chalk';
import { isNativeError } from 'util/types';

import { logPrefix } from './log-prefix.js';

const colorize = (args: any[], colorFn: Function) => {
    return args.map((arg) => {
        if (typeof arg === 'object') {
            try {
                return (
                    logPrefix().toString() +
                    colorFn(JSON.stringify(arg, null, 3))
                );
            } catch {
                return arg;
            }
        }

        logPrefix().toString() + colorFn(arg);
    });
};

const log = console.log;
console.log = (...args) =>
    log(
        ...args.map((arg) => {
            if (typeof arg === 'object') {
                try {
                    return arg;
                } catch {
                    return arg;
                }
            }
            return logPrefix().toString() + arg;
        })
    );

const debug = console.debug;
console.debug = (...args) => debug(...colorize(args, Chalk.gray));

const warn = console.warn;
console.warn = (...args) => warn(...colorize(args, Chalk.yellow));

const info = console.info;
console.info = (...args) => info(...colorize(args, Chalk.cyan));

const error = console.error;
console.error = (...args) => {
    args.forEach((arg) => {
        if (isNativeError(arg)) {
            // error(Chalk.red(arg.stack));
            error(logPrefix().toString(), Chalk.red(console.log(arg.stack)));
        } else {
            error(logPrefix().toString(), Chalk.red(arg));
        }
    });
};
