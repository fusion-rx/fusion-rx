import { detailedDiff, diff } from 'deep-object-diff';
import { isNativeError } from 'util/types';
import { colorize } from 'json-colorizer';

export class ExpectError extends Error {
    constructor(
        message: string,
        public details?: any
    ) {
        super(message);
    }

    formatDetails() {
        if (!this.details) return;

        if (typeof this.details === 'object' && !Array.isArray(this.details)) {
            return colorize(JSON.stringify(this.details, null, 4));
        }

        return this.details;
    }
}

export const isExpectError = (val: any): val is ExpectError => {
    return isNativeError(val) && 'formatDetails' in val;
};

export const expect = (actual: any) => {
    return {
        toEqual: (expected: any) => {
            if (typeof actual === 'object') {
                const results = diff(actual, expected);
                if (Object.keys(results).length === 0) return;
                throw new ExpectError(
                    `Objects are not equal.`,
                    detailedDiff(actual, expected)
                );
            }
            if (actual === expected) return;
            throw new Error(`Expected ${actual}, received ${expected}.`);
        },

        toBeGreaterThan: (expected: number) => {
            if (actual > expected) return;
            throw new Error(`${expected} is not greater than ${actual}.`);
        },
        toBeGreaterThanOrEqualTo: (expected: number) => {
            if (actual >= expected) return;
            throw new Error(
                `${expected} is not greater than or equal to ${actual}.`
            );
        },
        toBeLessThan: (expected: number) => {
            if (actual < expected) return;
            throw new Error(
                `${expected} is not less than or equal to ${actual}`
            );
        },
        toBeLessThanOrEqualTo: (expected: number) => {
            if (actual <= expected) return;
            throw new Error(
                `${actual} is not less than or equal to ${expected}.`
            );
        },
        toBeTruthy: () => {
            if (actual !== undefined && actual !== null) return;
            throw new Error(`Expected ${actual} to be truthy; it is falsy.`);
        },
        toBeFalsy: () => {
            if (actual === undefined || actual === null) return;
            throw new Error(`Expected ${actual} to be falsy; it is truthy.`);
        },
        toBeAny: (literal: Function) => {
            if (typeof actual === typeof literal()) return;
            throw new Error(
                `Expected ${typeof literal()}, recieved ${typeof actual}.`
            );
        }
    };
};
