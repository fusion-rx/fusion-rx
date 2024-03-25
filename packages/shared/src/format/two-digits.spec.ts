import { twoDigits } from './two-digits';

describe('Make two digits', () => {
    test('Can make single-digit string two digits', () => {
        expect(twoDigits(2)).toEqual('02');
    });

    test('does not modify two-digit numbers', () => {
        expect(twoDigits(25)).toEqual('25');
    });

    test('does not modify three-digit numbers', () => {
        expect(twoDigits(250)).toEqual('250');
    });
});
