import { makeThreeDigits } from './make-three-digits';

describe('Make three digits', () => {
    test('Can make single-digit string two digits', () => {
        expect(makeThreeDigits(2)).toEqual('002');
    });

    test('Can make two-digit string three digits', () => {
        expect(makeThreeDigits(25)).toEqual('025');
    });

    test('does not modify three-digit numbers', () => {
        expect(makeThreeDigits(250)).toEqual('250');
    });

    test('does not modify four-digit numbers', () => {
        expect(makeThreeDigits(2500)).toEqual('2500');
    });
});
