import { isConvertibleToArray } from './type-check.js';
import { parseArr } from './parse.js';

describe('coerceArray operator', () => {
    // Test case: Convertible scenarios
    it('should return true for arrays', () => {
        expect(isConvertibleToArray([])).toBe(true);
        expect(isConvertibleToArray([1, 2, 3])).toBe(true);
    });
    it('should return true for array-like objects', () => {
        expect(
            isConvertibleToArray({ length: 3, 0: 'a', 1: 'b', 2: 'c' })
        ).toBe(true);
        expect(isConvertibleToArray('hello')).toBe(true);
    });
    it('should return true for iterable objects', () => {
        const set = new Set([1, 2, 3]);
        const map = new Map([
            [1, 'one'],
            [2, 'two']
        ]);
        expect(isConvertibleToArray(set)).toBe(true);
        expect(isConvertibleToArray(map)).toBe(true);
    });

    it('should return true for empty iterable objects', () => {
        const set = new Set();
        const map = new Map();
        expect(isConvertibleToArray(set)).toBe(true);
        expect(isConvertibleToArray(map)).toBe(true);
    });

    // Test case: Non-convertible scenarios
    it('should return false for non-convertible types', () => {
        expect(isConvertibleToArray(42)).toBe(false);
        expect(isConvertibleToArray({ key: 'value' })).toBe(false);
        expect(isConvertibleToArray(null)).toBe(false);
    });

    // Test case: Edge cases
    it('should return false for undefined', () => {
        expect(isConvertibleToArray(undefined)).toBe(false);
    });
    it('should return false for objects without length property', () => {
        expect(isConvertibleToArray({})).toBe(false);
    });
    it('should return false for functions', () => {
        expect(isConvertibleToArray(() => {})).toBe(false);
    });
    it('should return false for symbols', () => {
        const mySymbol = Symbol('test');
        expect(isConvertibleToArray(mySymbol)).toBe(false);
    });

    test('Can return array from array', () => {
        const arr = parseArr(['hello', 'world']);
        expect(arr.length).toEqual(2);
        expect(Array.isArray(arr)).toEqual(true);
    });

    test('Can return array from an ArrayLike', () => {
        const arrayLike = new Set();
        arrayLike.add('hello');
        arrayLike.add('world');
        const arr = parseArr(arrayLike);
        expect(arr.length).toEqual(2);
        expect(Array.isArray(arr)).toEqual(true);
    });

    test('Can return array from non-array', () => {
        const arr = parseArr({
            hello: 'world'
        });
        expect(arr.length).toEqual(1);
        expect(Array.isArray(arr)).toEqual(true);
    });
    test('Can return array from string', () => {
        const arr = parseArr('Hello world');
        expect(arr.length).toEqual(1);
        expect(Array.isArray(arr)).toEqual(true);
    });
});
