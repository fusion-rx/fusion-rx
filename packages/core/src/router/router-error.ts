import { isNativeError } from 'util/types';
import { HttpStatusCode } from './router-types.js';

/** A native JavaScript error that requires an http status code. */
export class FsnRouterError extends Error {
    public status: number;

    constructor(status: keyof typeof HttpStatusCode, message: string) {
        super(message);
        this.status = HttpStatusCode[status];
    }
}

export const isRouterError = (val: any): val is FsnRouterError =>
    isNativeError(val) && 'status' in val;

/**
 * Handles errors thrown in express methods.
 * @param error An error thrown by a incoming request handler
 * @param res An express response object
 */
export const formatResponseError = (error: any) => {
    console.error('A request error occurred:');
    console.error(error);

    if (isRouterError(error))
        return {
            status: error.status,
            message: error.message
        };

    if (isNativeError(error))
        return {
            status: 500,
            message: error.message
        };

    if (error === undefined || error === null)
        return {
            message: 'An unknown error occurred.',
            status: 500
        };

    if (typeof error === 'object')
        return {
            message: error['message'] ?? 'A request error occurred.',
            status: error['status'] ?? 500
        };

    return {
        message: 'An unknown error occurred.',
        status: 500
    };
};
