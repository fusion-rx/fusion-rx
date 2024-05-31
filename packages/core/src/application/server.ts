import express, { Express } from 'express';
import http from 'http';
import https from 'https';
import { registerOnExitEvent } from '../error/error-handler.js';
import chalk from 'chalk';

export declare type ServerOptions = {
    port: number | string;
    hostname: string;
    basePath: string;
    exitOnUncaught: boolean;
};

export declare type HttpsServerOptions = Partial<ServerOptions> & {
    key: string;
    cert: string;
};

const isHttpsServerOptions = (val: any): val is HttpsServerOptions => {
    return (
        val !== undefined &&
        val !== null &&
        typeof val === 'object' &&
        'key' in val &&
        'cert' in val
    );
};

export let expressApp: Express = express();
export let server: http.Server | https.Server;

export class FusionServer {
    constructor() {
        expressApp.use(express.json());
    }

    listen(options?: Partial<ServerOptions> | HttpsServerOptions) {
        server = isHttpsServerOptions(options)
            ? https.createServer(
                  {
                      key: options.key,
                      cert: options.cert
                  },
                  expressApp
              )
            : (server = http.createServer(expressApp));

        server.listen(options?.port ?? 4100, () => {
            console.log(
                chalk.bold.blue(`🚀 Fusion is listening on localhost:${4100}`)
            );
        });

        registerOnExitEvent(() => {
            console.log(chalk.bold.blue(`🛬 Fusion application terminated`));
            server.close();
        });
    }
}
