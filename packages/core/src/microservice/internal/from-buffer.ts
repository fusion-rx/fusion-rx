import type { Message } from '../types.js';

/**
 * Converts a buffer to an array.
 * @param buffer A Node buffer
 * @returns The buffer converted to a string or undefined
 */
export function fromBuffer<T = any>(buffer?: Buffer): Message<T> | undefined {
    try {
        if (buffer) {
            return JSON.parse(buffer.toString());
        }
    } catch (err) {
        console.error('Failed to convert buffer to string');
        console.error(err);
    }

    return;
}
