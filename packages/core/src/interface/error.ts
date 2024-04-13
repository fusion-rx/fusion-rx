import { HttpStatusCode } from './status-code';

export class FsnAppError extends Error {
    constructor(
        message: string,
        public statusCode: HttpStatusCode
    ) {
        super(message);
    }
}

export const isFsnAppError = (val: any): val is FsnAppError => {
    try {
        return (
            val !== undefined &&
            val !== null &&
            'message' in val &&
            'statusCode' in val
        );
    } catch {
        return false;
    }
};
