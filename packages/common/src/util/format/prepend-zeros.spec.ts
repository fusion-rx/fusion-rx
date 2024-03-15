import { prependZeros } from './prepend-zeros';

describe('Prepend zeros', () => {
    test('Can add four zeros', () => {
        const val = prependZeros(25, 4);
        expect(val).toEqual('0025');
    });

    test('Can add one zero', () => {
        const val = prependZeros(5, 2);
        expect(val).toEqual('05');
    });

    test('Can handle large numbers', () => {
        const val = prependZeros(25, 2);
        expect(val).toEqual('25');
    });

    test('Can substring', () => {
        const val = prependZeros(250, 2);
        expect(val).toEqual('250');
    });
});
