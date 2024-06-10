import { parseString } from './parse.js';

describe('string utility', () => {
    test('Can stringify number', () => {
        expect(parseString(4)).toEqual('4');
    });

    test('Can stringify buffer', () => {
        const buffer = Buffer.from('Hello world.');
        expect(parseString(buffer)).toEqual('Hello world.');
    });

    test('Can stringify array', () => {
        expect(parseString(['hello', 'world'])).toEqual('hello,world');
    });

    test('Can stringify symbol', () => {
        const symbol = Symbol('Hello world');
        expect(parseString(symbol)).toEqual('Symbol(Hello world)');
    });

    test('Can stringify function', () => {
        const fn = () => 'Hello world';
        expect(parseString(fn)).toEqual("() => 'Hello world'");

        function fn2() {
            return 'Hello world';
        }

        expect(parseString(fn2)).toEqual(
            `function fn2() {
            return 'Hello world';
        }`
        );
    });
});
