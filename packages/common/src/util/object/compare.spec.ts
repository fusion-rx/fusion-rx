import { CosmoKramer, SeinfeldCharacters } from '../array/sample-array.spec';
import { equivalent } from './compare';

describe('Compare', () => {
    test('Can compare array of objects; true', () => {
        expect(equivalent(SeinfeldCharacters, SeinfeldCharacters)).toEqual(
            true
        );
    });

    test('Can compare array of objects; false', () => {
        expect(equivalent([CosmoKramer], SeinfeldCharacters)).toEqual(false);
    });

    const nestedObject = {
        jerry: {
            favoriteFood: 'cereal',
            favoriteSuperhero: 'Superman',
            job: ['comedian']
        }
    };

    const nestedObject2 = {
        george: {
            favoriteFood: 'everything',
            favoriteSuperhero: null,
            job: [
                'Realestate Agent',
                'Assistant to the Traveling Secretary',
                'Playground Equipment Salesman'
            ]
        }
    };

    const nestedObject3 = {
        ...nestedObject,
        ...nestedObject2
    };

    test('Can compare nested objects; true', () => {
        expect(equivalent(nestedObject, nestedObject)).toEqual(true);
    });

    test('Can compare nested objects; false', () => {
        expect(equivalent(nestedObject, nestedObject2)).toEqual(false);
    });

    test('Can compare nested objects; false ', () => {
        expect(equivalent(nestedObject, nestedObject3)).toEqual(false);
    });
});
