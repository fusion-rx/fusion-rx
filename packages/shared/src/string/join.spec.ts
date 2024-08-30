import { joinURL } from './join.js';

describe('Join URL', () => {
    test('Can join URL', () => {
        const url = joinURL('api', 'test');
        expect(url).toEqual('api/test');
    });

    test('Can join URL with null URL segments', () => {
        const url = joinURL('api', null, 'test');
        expect(url).toEqual('api/test');
    });

    test('Can join URL with array URL segments', () => {
        const url = joinURL('api', ['test', 'asset']);
        expect(url).toEqual('api/test/asset');
    });

    test('Can join URL with query string', () => {
        const url = joinURL('api', 'test', {
            query: 'value'
        });
        expect(url).toEqual('api/test?query=value');
    });

    test('Can join URL with null query string', () => {
        const url = joinURL('api', 'test', {
            query: 'value',
            query2: null,
            query3: undefined
        });
        expect(url).toEqual('api/test?query=value');
    });

    test('Can join params with numbers, booleans, arrays', () => {
        const url = joinURL('api', 'test', {
            query: 'value',
            query2: 23,
            query3: true,
            query4: ['hello', 'world']
        });

        const comma = '%2C';

        expect(url).toEqual(
            `api/test?query=value&query2=23&query3=true&query4=hello${comma}world`
        );
    });
});
