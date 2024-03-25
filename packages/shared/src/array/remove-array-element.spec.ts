import {
    CosmoKramer,
    SeinfeldCharacter,
    SeinfeldCharacters
} from '@fusion-rx/test';
import { removeArrayElement } from './remove-array-element';

describe('Array remove', () => {
    test('Can remove item from array', () => {
        const arrayRemoved = removeArrayElement(
            SeinfeldCharacters,
            CosmoKramer
        );
        expect(
            arrayRemoved.findIndex((val) => val.name === CosmoKramer.name)
        ).toEqual(-1);
    });

    test('Can handle empty array', () => {
        const arrayRemoved = removeArrayElement(
            [] as SeinfeldCharacter[],
            CosmoKramer
        );
        expect(arrayRemoved.length).toEqual(0);
    });
});
