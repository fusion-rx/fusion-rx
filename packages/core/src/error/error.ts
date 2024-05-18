import { DefaultErrorMessages, ErrorCode } from './error-codes.js';
/**
 * An extension of Error that provides verbose logging
 * metadata.
 *
 * @publicApi
 */
export class FsnError extends Error {
    constructor(
        public code?: ErrorCode | undefined,
        public details?: string | undefined
    ) {
        super(
            details
                ? details
                : code
                  ? DefaultErrorMessages[code].message
                  : 'An unknown error was thrown by @fusion-rx/core'
        );
        this.code = code;
        this.details = details;
    }
}
