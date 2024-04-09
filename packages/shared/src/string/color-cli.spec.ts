import { applyColorFromTags } from './color-cli';

describe('Can color cli tags', () => {
    test('Can render tags, removing them', () => {
        const textToRender = applyColorFromTags(
            `This next word is <r>colored</r> red.`,
            'Red'
        );

        expect(textToRender).toEqual(
            `This next word is \u001b[31mcolored\u001b[37m red.`
        );
    });

    test('Can render tags, spacing them', () => {
        const textToRender = applyColorFromTags(
            `This next word is <r>colored</r> red.`,
            'Red',
            true
        );

        expect(textToRender).toEqual(
            `This next word is    \u001b[31mcolored\u001b[37m     red.`
        );
    });
});
