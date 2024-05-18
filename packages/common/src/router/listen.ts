import chalk from 'chalk';
import express from 'express';
export const expressApp = express();
expressApp.use(express.json());
/**
 * Calls the native `listen` method for the global express application.
 * @param routes The routes to register
 * @param hostname The hostname on which express will listen
 * @param port The port on which express will listen
 */
// @ts-ignore
export const listen = (hostname?: string, port?: number) => {
    return expressApp.listen(
        {
            hostname,
            port
        },
        () => {
            console.log(
                chalk.bold.blue(`✨ Fusion is listening on ${hostname}:${port}`)
            );
        }
    );
};
// TODO register on exit
