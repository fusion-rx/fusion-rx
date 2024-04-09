export enum ErrorCode {
    DERIVE_CLASS_NAME = 1000,
    DERIVE_INJECTABLE_TOKEN = 2000,
    CANNOT_RESOLVE_DEPENDENCY = 2001,
    INVALID_INJECTABLE = 2002,
    UNRESOLVED_INJECTABLE = 2003,
    DERIVE_MODULE_NAME = 3000,
    INVALID_MODULE = 3001,
    REFERENCES_SELF = 3002,
    INVALID_EXPORT = 3003,
    INVALID_ROUTE = 4000
}

export const ErrorCodeMeanings: Record<
    ErrorCode,
    {
        message: string;
    }
> = {
    1000: {
        message: 'Failed to dervice class name from class reference.'
    },
    2000: {
        message: 'Failed to derive injectable name from reference.'
    },
    2001: {
        message: 'Failed to resolve dependency.'
    },
    2002: {
        message: 'Invalid injectable detected.'
    },
    2003: {
        message: 'Encountered uninitialized dependency from external module.'
    },
    3000: {
        message: 'Failed to derive module name from reference.'
    },
    3001: {
        message: 'An invalid module was detected.'
    },
    3002: {
        message: 'A module cannot import itself.'
    },
    3003: {
        message: 'Invalid export detected'
    },
    4000: {
        message: 'Invalid route detected'
    }
};

export class FsnError extends Error {
    constructor(
        public code?: ErrorCode,
        public details?: string
    ) {
        super(
            details
                ? details
                : code
                  ? ErrorCodeMeanings[code].message
                  : 'An unknown error was thrown by @fusion-rx/core'
        );
    }
}

export const FusionError = (code: ErrorCode, message: string, stack?: any) => ({
    code,
    message,
    stack: stack ?? new Error().stack
});
