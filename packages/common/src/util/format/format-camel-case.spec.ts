import { formatCamelCase } from './format-camel-case';

describe('Format camel case', () => {
    const camelCase = 'loremIpsumDolorSitAmet';

    test('Can convert from sentence case to camel case', () => {
        const sentenceCase = formatCamelCase('Lorem ipsum dolor sit amet');
        expect(sentenceCase).toEqual(camelCase);
    });

    test('Can convert from snake case to camel case', () => {
        const snakeCase = formatCamelCase('lorem_ipsum_dolor_sit_amet');
        expect(snakeCase).toEqual(camelCase);
    });

    test('Can convert from kebab case to camel case', () => {
        const kebabCase = formatCamelCase('lorem-ipsum-dolor-sit-amet');
        expect(kebabCase).toEqual(camelCase);
    });

    test('Can convert from random case to camel case', () => {
        const randomCase = formatCamelCase('lorem ipsum-dolor_sit--amet');
        expect(randomCase).toEqual(camelCase);
    });
});
