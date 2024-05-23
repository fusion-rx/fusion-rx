import { isNativeError } from 'util/types';
import { HttpStatusCode } from './http-status-codes.js';

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
