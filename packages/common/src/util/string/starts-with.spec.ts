import { startsWith } from './starts-with';

describe('Starts with', () => {
    test('Evaluates regular expressions; true.', () => {
        expect(startsWith('Hello world', /Hello/g)).toEqual(true);
    });

    test('Evaluates regular expressions; false.', () => {
        expect(startsWith('Hello world', /world/g)).toEqual(false);
    });

    test('Evaluates regular expressions; multiple.', () => {
        expect(startsWith('Hello world', /Hello|world/g)).toEqual(true);
    });

    test('Evaluates regular expressions; multiple 2.', () => {
        expect(startsWith('Hello world', /world|Hello/g)).toEqual(true);
    });

    test('Evaluates arrays; true.', () => {
        expect(startsWith('Hello world', ['Hello'])).toEqual(true);
    });

    test('Evaluates arrays; false.', () => {
        expect(startsWith('Hello world', ['world'])).toEqual(false);
    });

    test('Evaluates arrays; multiple.', () => {
        expect(startsWith('Hello world', ['Hello', 'world'])).toEqual(true);
    });

    test('Evaluates strings; true.', () => {
        expect(startsWith('Hello world', 'Hello')).toEqual(true);
    });

    test('Evaluates strings; false.', () => {
        expect(startsWith('Hello world', 'world')).toEqual(false);
    });

    test('Evaluates strings; case insenstivie; true.', () => {
        expect(
            startsWith('Hello world', 'hello', {
                caseSensitive: false
            })
        ).toEqual(true);
    });

    test('Evaluates arrays; case insenstivie; true.', () => {
        expect(
            startsWith('Hello world', ['hello', 'world'], {
                caseSensitive: false
            })
        ).toEqual(true);
    });
});
