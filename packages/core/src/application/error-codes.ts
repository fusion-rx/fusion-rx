export enum ErrorCode {
    DERIVE_CLASS_NAME = 1000,
    DERIVE_INJECTABLE_TOKEN = 2000,
    CANNOT_RESOLVE_DEPENDENCY = 2001,
    INVALID_INJECTABLE = 2002,
    UNRESOLVED_INJECTABLE = 2003,
    INVALID_PROVIDER = 2004,
    DERIVE_MODULE_NAME = 3000,
    INVALID_MODULE = 3001,
    REFERENCES_SELF = 3002,
    INVALID_EXPORT = 3003,
    CIRCULAR_DEPENDENCY = 3004,
    INVALID_ROUTE = 4000
}

export const DefaultErrorMessages: Record<
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
    2004: {
        message: 'Invalid provider detected'
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
    3004: {
        message: 'Circular dependency detected'
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
                  ? DefaultErrorMessages[code].message
                  : 'An unknown error was thrown by @fusion-rx/core'
        );
    }
}
