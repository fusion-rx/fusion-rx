import { createServer, Socket } from 'net';
import { isObservable, Observable } from 'rxjs';
import chalk from 'chalk';

import { fromBuffer } from './internal/from-buffer.js';
import { writeMessage } from './internal/write-message.js';
import EventEmitter from 'events';
import { Contract } from './types.js';
import { FsnModule } from '../public-api.js';

/**
 * Provides details for microservice connection.
 *
 * @publicApi
 */
export declare type MicroserviceProvider = FsnModule & {
    name: string;
    port: number;
    ip?: string;
};

/**
 * Opens a socket for the microservice connection.
 *
 * @publicApi
 */
export class Microservice {
    private _events = new EventEmitter();

    constructor(private _provider: MicroserviceProvider) {
        createServer()
            .listen(_provider.port, _provider.ip ?? '0.0.0.0', () => {})
            .on('connection', (socket) => {
                socket
                    .on('data', (buffer) => {
                        const data = fromBuffer(buffer);
                        if (data) {
                            this._events.emit(data.cmd, {
                                socket,
                                uniqueCMD: data.reqKey,
                                data: data.data
                            });
                        }
                    })
                    .on('close', () => {
                        console.info(
                            chalk.bold.blue('Connection terminated by gateway.')
                        );
                    })
                    .on('error', (err) => {
                        console.error(chalk.red(err));
                    });
            });
    }

    public subscribe<T extends Contract>(
        eventName: T['cmd'],
        respond: (data: T['req']) => T['res'] | Observable<T['res']>
    ): this {
        console.log(
            chalk.magentaBright(
                [
                    'Subscribed {',
                    eventName,
                    '} <= Port ',
                    this._provider.port
                ].join('')
            )
        );
        this._events.on(
            eventName,
            (data: { socket: Socket; data: T['req']; uniqueCMD: string }) => {
                const reply = respond(data.data);
                if (isObservable(reply)) {
                    reply.subscribe({
                        next: (val) => {
                            writeMessage(data.socket, {
                                cmd: data.uniqueCMD,
                                data: val
                            });
                        },
                        error: (err) => {
                            writeMessage(data.socket, {
                                cmd: data.uniqueCMD,
                                error: err
                            });
                        },
                        complete: () => {
                            writeMessage(data.socket, {
                                cmd: data.uniqueCMD,
                                complete: true
                            });
                        }
                    });
                } else {
                    writeMessage(data.socket, {
                        cmd: data.uniqueCMD,
                        data: reply,
                        complete: true
                    });
                }
            }
        );
        return this;
    }
}
