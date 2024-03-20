import { formatCurrency } from './currency';

describe('Currency formatter', () => {
    test('Can format values less than one', () => {
        expect(formatCurrency(0.2)).toEqual('0.20');
    });

    test('Can format whole numbers', () => {
        expect(formatCurrency(1)).toEqual('1.00');
    });

    test('Can format decimal number with no tenths place', () => {
        expect(formatCurrency(1.2)).toEqual('1.20');
    });

    test('Can round decimal numbers in hundreds', () => {
        expect(formatCurrency(1.254)).toEqual('1.25');
    });
});
