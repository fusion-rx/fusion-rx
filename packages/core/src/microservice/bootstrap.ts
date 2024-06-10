import { Socket, createServer } from 'net';
import { MS } from './di/microservice.js';
import { Type } from '../interface/type.js';
import chalk from 'chalk';
import { fromBuffer } from './internal/from-buffer.js';
import { Observable, isObservable } from 'rxjs';
import { writeMessage } from './internal/write-message.js';

export const bootstrap = (microservice: Type<any>) => {
    createMicroservice(microservice);
};

/**
 * Maps commands to subscriber instances and method names.
 */
declare type Subscribers = {
    [cmd: string]: {
        instance: any;
        method: string;
    };
};

/**
 * Executes incoming messages and writes the result to the socket.
 * @param socket An incoming socket connection
 * @param uniqueCMD The unique ID of an incoming request
 * @param methodRes A Subscriber's response to the incoming request
 */
const executeDecoratedMethod = <T = any>(
    socket: Socket,
    uniqueCMD: string,
    methodRes: T | Observable<T>
) => {
    if (isObservable(methodRes)) {
        methodRes.subscribe({
            next: (val) =>
                writeMessage(socket, {
                    cmd: uniqueCMD,
                    data: val
                }),
            error: (error) =>
                writeMessage(socket, {
                    cmd: uniqueCMD,
                    error
                }),
            complete: () =>
                writeMessage(socket, {
                    cmd: uniqueCMD,
                    complete: true
                })
        });
    } else {
        writeMessage(socket, {
            cmd: uniqueCMD,
            data: methodRes,
            complete: true
        });
    }
};

/**
 * Logs command subscriptions.
 * @param cmd The command of incoming requests
 * @param port The port of the microservice that has subscribed to a command
 */
const printEvent = (cmd: string, port: number) => {
    console.log(
        chalk.magentaBright(['Subscribed {', cmd, '} <= Port ', port].join(''))
    );
};

/**
 * Serves this microservice.
 * @param port The port of this microservice
 * @param host The hostname of this microservice
 * @param subscribers The incoming request subscribers registered with `@Subscribe`
 */
const serve = (port: number, host: string, subscribers: Subscribers) => {
    createServer()
        .listen(port, host, () => {
            console.log(
                chalk.bold.blue(
                    '🛫 Fusion microservice listening on ' + host + ':' + port
                )
            );
        })
        .on('connection', (socket) => {
            socket
                .on('data', (buffer) => {
                    const data = fromBuffer(buffer);

                    if (!data) {
                        console.error('Received an empty requests.');
                        return;
                    }

                    const subscriber = subscribers[data.cmd];

                    if (data.data) {
                        executeDecoratedMethod(
                            socket,
                            data.reqKey,
                            subscriber.instance[subscriber.method](data.data)
                        );
                    } else {
                        executeDecoratedMethod(
                            socket,
                            data.reqKey,
                            subscriber.instance[subscriber.method]()
                        );
                    }
                })
                .on('close', () => {
                    console.log(
                        chalk.bold.green(
                            'Success: connection terminated by gateway.'
                        )
                    );
                })
                .on('error', (err) => {
                    console.error(err);
                });
        })
        .on('close', () => {
            console.log('Connection closed.');
        });
};

const createMicroservice = (microservice: MS) => {
    const subscriptions: Subscribers = {};

    microservice.prototype.subscribers.forEach((subscriber) => {
        const instance = new subscriber();

        Object.keys(subscriber.prototype.cmds).forEach((cmd) => {
            printEvent(cmd, microservice.prototype.port);
            subscriptions[cmd] = {
                instance,
                method: subscriber.prototype.cmds[cmd]
            };
        });
    });

    serve(
        microservice.prototype.port,
        microservice.prototype.host,
        subscriptions
    );
};
