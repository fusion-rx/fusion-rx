import { makeTwoDigits } from './make-two-digits';

describe('Make two digits', () => {
    test('Can make single-digit string two digits', () => {
        expect(makeTwoDigits(2)).toEqual('02');
    });

    test('does not modify two-digit numbers', () => {
        expect(makeTwoDigits(25)).toEqual('25');
    });

    test('does not modify three-digit numbers', () => {
        expect(makeTwoDigits(250)).toEqual('250');
    });
});
