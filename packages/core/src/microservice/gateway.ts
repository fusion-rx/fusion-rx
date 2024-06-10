import { Observable } from 'rxjs';
import { Socket } from 'net';
import * as split from 'split2';
import chalk from 'chalk';

import { requestKey } from './internal/request-key.js';
import { fromBuffer } from './internal/from-buffer.js';
import { writeMessage } from './internal/write-message.js';

import type { Contract } from './types.js';

export declare interface ServiceProvider {
    name: string;
    port: number;
    ip?: string;
}

export class Gateway {
    constructor(private _provider: ServiceProvider) {
        console.log(
            chalk.magentaBright(
                'Gateway {' + _provider.name + '} => Port ' + _provider.port
            )
        );
    }

    public connect() {
        try {
            new Socket({
                readable: true,
                writable: true
            })
                .setEncoding('utf-8')
                .connect({
                    port: this._provider.port
                });
        } catch (err) {
            console.error(err);
        }

        return this;
    }

    public testConnection() {
        try {
            new Socket({
                readable: true,
                writable: true
            })
                .setEncoding('utf-8')
                .connect({
                    port: this._provider.port
                });
            return true;
        } catch (err) {
            console.error(err);
        }

        return false;
    }

    public request<
        T extends Contract,
        CMD extends T['cmd'],
        Req extends T['req'],
        Res extends T['res']
    >(eventName: CMD, payload?: Req): Observable<Res>;

    public request<
        T extends Contract,
        CMD extends T['cmd'],
        Req extends T['req'],
        Res extends T['res']
    >(
        eventName: CMD,
        payload?: Req,
        returnHttpException?: boolean
    ): Observable<Res>;

    public request<
        T extends Contract,
        CMD extends T['cmd'],
        Req extends T['req'],
        Res extends T['res']
    >(
        eventName: CMD,
        payload?: Req,
        socket?: Socket,
        returnHttpException?: boolean
    ): Observable<Res>;

    public request<
        T extends Contract,
        CMD extends T['cmd'],
        Req extends T['req'],
        Res extends T['res']
    >(
        eventName: CMD,
        payload?: Req,
        socketOrHttp?: Socket | boolean,
        returnException?: boolean
    ): Observable<Res> {
        const key = requestKey(eventName);

        let socket: Socket;
        let returnHttpException = false;

        if (typeof socketOrHttp === 'boolean') {
            returnHttpException = socketOrHttp;
        } else if (socketOrHttp !== undefined) {
            socket = socketOrHttp;
        }

        if (returnException !== undefined) {
            returnHttpException = returnException;
        }

        return new Observable((subscriber) => {
            if (!socket) {
                try {
                    socket = new Socket({
                        readable: true,
                        writable: true
                    })
                        .setEncoding('utf-8')
                        .connect({
                            port: this._provider.port
                        });
                } catch (error) {
                    subscriber.error(error);
                }
            }

            socket.pipe(split.default('\n')).on('data', (buffer) => {
                if (buffer) {
                    const data = fromBuffer<Res>(buffer);

                    if (!data) {
                        throw {
                            message:
                                'Something went wrong, and we were unable to complete your request.',
                            status: 500
                        };
                    }

                    if (data.cmd === key) {
                        if (!data.complete && data.data) {
                            subscriber.next(data.data);
                        } else if (data.complete && !data.error) {
                            if (data.data) subscriber.next(data.data);
                            socket.end(() => {
                                subscriber.complete();
                            });
                        } else if (data.error) {
                            if (returnHttpException) {
                                throw {
                                    status: data.error['status'] ?? 500,
                                    message:
                                        data.error['response'] ??
                                        data.error['message'] ??
                                        'Something went wrong, and we were unable to complete your request.'
                                };
                            } else {
                                subscriber.error(data.error);
                            }
                        }
                    }
                }
            });

            writeMessage(socket, {
                cmd: eventName,
                data: payload,
                reqKey: key
            });
        });
    }
}
