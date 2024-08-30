import { beforeAll, describe, test } from './describe.js';
import { expect } from './expect.js';

describe('Simple Unit Tests', () => {
    let a: any;
    let b: any;

    beforeAll(() => {
        a = {
            speed: 4,
            power: 54,
            height: undefined,
            level: 1
        };

        b = {
            speed: 4,
            power: 22,
            level: undefined,
            weight: 10
        };
    });

    test('Runs before all hook', () => {
        expect(a).toBeTruthy();
        expect(b).toBeTruthy();
    });

    test('Can handle promises', () => {
        return new Promise((resolve) => {
            expect('car').toBeAny(String);
            resolve(true);
        });
    });

    test(`Can handle failures`, () => {
        expect(true).toBeAny(Number);
    });

    test(`Can handle object comparison failures`, () => {
        expect(a).toEqual(b);
    });

    test(`Can handle object comparison success`, () => {
        expect(a).toEqual(a);
    });
});
