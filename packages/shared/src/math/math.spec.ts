import { FsnMath } from './math.js';

describe('Rounding', () => {
    test('Can round to preicision of 3', () => {
        const rounded = FsnMath.round(250.025, 3);
        expect(rounded).toEqual(250.025);
    });

    test('Can round up to preicision of 2', () => {
        const rounded = FsnMath.round(250.025, 2);
        expect(rounded).toEqual(250.03);
    });

    test('Can round down to preicision of 2', () => {
        const rounded = FsnMath.round(250.024, 2);
        expect(rounded).toEqual(250.02);
    });

    test('Can round to precision of zero', () => {
        const rounded = FsnMath.round(250.459, 0);
        expect(rounded).toEqual(250);
    });
});
