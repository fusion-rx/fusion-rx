/**
 * Safely assert whether the given value is an ArrayBuffer.
 *
 * In some execution environments ArrayBuffer is not defined.
 */
export function isArrayBuffer(value: any): value is ArrayBuffer {
    return typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer;
}
