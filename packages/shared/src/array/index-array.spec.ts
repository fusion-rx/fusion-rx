import { SeinfeldCharacters } from '@fusion-rx/test';
import { indexArray } from './index-array.js';

describe('Array Index', () => {
    test('It should apply index to each element in array', () => {
        const indexedArray = indexArray(SeinfeldCharacters);

        indexedArray.forEach((value, index) => {
            expect(Reflect.getMetadata('_index', value)).toEqual(index);
        });
    });
});
