import { Socket } from 'net';

/**
 * Writes a message to an opened socket.
 * @param socket An open socket
 * @param message A message to write to the socket
 */
export function writeMessage<T = any>(socket: Socket, message: T): void {
    try {
        socket.write(JSON.stringify(message) + '\n');
    } catch (err) {
        console.error('Failed to convert string to buffer');
        console.error(err);
    }
}
