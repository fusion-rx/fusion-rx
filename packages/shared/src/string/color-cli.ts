const colors = {
    Red: '\u001b[31m',
    Green: '\u001b[32m',
    Yellow: '\u001b[33m',
    Blue: '\u001b[34m',
    Magenta: '\u001b[35m',
    Cyan: '\u001b[36m',
    White: '\u001b[37m'
};

export declare type Color = keyof typeof colors;
export declare type ColorTagSet = {
    open: string;
    close: string;
};

const tagSets: Record<Color, ColorTagSet> = {
    Red: {
        open: '<r>',
        close: '</r>'
    },
    Green: {
        open: '<g>',
        close: '</g>'
    },
    Yellow: {
        open: '<y>',
        close: '</y>'
    },
    Blue: {
        open: '<b>',
        close: '</b>'
    },
    Magenta: {
        open: '<m>',
        close: '</m>'
    },
    Cyan: {
        open: '<c>',
        close: '</c>'
    },
    White: {
        open: '<w>',
        close: '</w>'
    }
};

const colorTextLine = (
    line: string,
    color: Color,
    replaceTagsWithWhitespace: boolean = false
) =>
    line
        .replace(
            new RegExp(tagSets[color].open, 'g'),
            (replaceTagsWithWhitespace ? ' ' : '').repeat(3) + colors[color]
        )
        .replace(
            new RegExp(tagSets[color].close, 'g'),
            colors.White + (replaceTagsWithWhitespace ? ' ' : '').repeat(4)
        );

export const colorTaggedText = (
    text: string,
    replaceTagsWithWhitespace: boolean = false
) => {
    text.split(/\n/g).map((line) => {
        Object.keys(tagSets).forEach((color) => {
            line = colorTextLine(line, <Color>color, replaceTagsWithWhitespace);
        });
    });
};

export const red = (str: string): string =>
    colors['Red'] + str + colors['White'];

export const green = (str: string): string =>
    colors['Green'] + str + colors['White'];

export const yellow = (str: string): string =>
    colors['Yellow'] + str + colors['White'];

export const blue = (str: string): string =>
    colors['Blue'] + str + colors['White'];

export const magenta = (str: string): string =>
    colors['Magenta'] + str + colors['White'];

export const cyan = (str: string): string =>
    colors['Cyan'] + str + colors['White'];

export const white = (str: string): string =>
    colors['White'] + str + colors['White'];
