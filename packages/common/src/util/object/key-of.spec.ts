import { keyOf } from './key-of';

declare type Cat = {
    name: string;
    colors: string[];
};

describe('Keyof helper', () => {
    test('Keyof satisfies compiler.', () => {
        const cats: Cat = {
            name: 'Peeta',
            colors: ['white', 'gray']
        };

        const catVals: any[] = [];

        Object.keys(cats).forEach((key) => {
            catVals.push(cats[keyOf<Cat>(key)]);
        });

        expect(catVals.length).toEqual(2);
    });
});
