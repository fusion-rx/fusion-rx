import { arrayRemove } from './array-remove';
import {
    CosmoKramer,
    SeinfeldCharacter,
    SeinfeldCharacters
} from './sample-array.spec';

describe('Array remove', () => {
    test('Can remove item from array', () => {
        const arrayRemoved = arrayRemove(SeinfeldCharacters, CosmoKramer);
        expect(
            arrayRemoved.findIndex((val) => val.name === CosmoKramer.name)
        ).toEqual(-1);
    });

    test('Can handle empty array', () => {
        const arrayRemoved = arrayRemove(
            [] as SeinfeldCharacter[],
            CosmoKramer
        );
        expect(arrayRemoved.length).toEqual(0);
    });
});
