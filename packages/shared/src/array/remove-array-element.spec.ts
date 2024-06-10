import { Character, data } from '@fusion-rx/test';
import { removeArrayElement } from './remove-array-element.js';

describe('Array remove', () => {
    const arr = JSON.parse(JSON.stringify(data.characters));
    const removed = arr[0];

    test('Can remove item from array', () => {
        const arrayRemoved = removeArrayElement(arr, removed);
        expect(
            arrayRemoved.findIndex((val) => {
                return val.name === removed.name;
            })
        ).toEqual(-1);
    });

    test('Can handle empty array', () => {
        const arrayRemoved = removeArrayElement(<Character[]>[], removed);
        expect(arrayRemoved.length).toEqual(0);
    });
});
