import { toString } from './to-string';

describe('toString utility', () => {
    test('Can stringify number', () => {
        expect(toString(4)).toEqual('4');
    });

    test('Can stringify buffer', () => {
        const buffer = Buffer.from('Hello world.');
        expect(toString(buffer)).toEqual('Hello world.');
    });

    test('Can stringify array', () => {
        expect(toString(['hello', 'world'])).toEqual('hello,world');
    });

    test('Can stringify symbol', () => {
        const symbol = Symbol('Hello world');
        expect(toString(symbol)).toEqual('Symbol(Hello world)');
    });

    test('Can stringify function', () => {
        const fn = () => 'Hello world';
        expect(toString(fn)).toEqual("() => 'Hello world'");

        function fn2() {
            return 'Hello world';
        }

        expect(toString(fn2)).toEqual(
            `function fn2() {
            return 'Hello world';
        }`
        );
    });
});
