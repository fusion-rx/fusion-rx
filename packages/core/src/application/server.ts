import { GlobalLogger } from '@fusion-rx/shared';
import express, { Express } from 'express';
import http from 'http';
import https from 'https';
import { Injectable } from '../di';

export declare interface ServerOptions {
    port: number;
    hostname: string;
}

export declare type HttpsServerOptions = {
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

@Injectable({
    providedIn: 'root'
})
export class FusionServer {
    public expressApp: Express;
    public server?: https.Server | http.Server;

    constructor() {
        this.expressApp = express();
    }

    listen(
        options?:
            | Partial<ServerOptions>
            | (Partial<ServerOptions> & HttpsServerOptions)
    ) {
        this.server = isHttpsServerOptions(options)
            ? https.createServer({
                  key: options.key,
                  cert: options.cert
              })
            : (this.server = http.createServer());

        const serverOptions: ServerOptions = {
            port: options?.port ?? 4100,
            hostname: options?.hostname ?? 'localhost'
        };

        this.server.listen(serverOptions.port, serverOptions.hostname);
        GlobalLogger.log(
            `Application listening on ${serverOptions.hostname}:${serverOptions.port}`
        );
    }
}
