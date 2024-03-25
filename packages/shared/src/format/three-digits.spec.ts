import { threeDigits } from './three-digits';

describe('Make three digits', () => {
    test('Can make single-digit string two digits', () => {
        expect(threeDigits(2)).toEqual('002');
    });

    test('Can make two-digit string three digits', () => {
        expect(threeDigits(25)).toEqual('025');
    });

    test('does not modify three-digit numbers', () => {
        expect(threeDigits(250)).toEqual('250');
    });

    test('does not modify four-digit numbers', () => {
        expect(threeDigits(2500)).toEqual('2500');
    });
});
