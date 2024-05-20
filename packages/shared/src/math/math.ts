import { parseString } from '../type/parse.js';

export namespace FsnMath {
    /**
     * Rounds a number to a precision.
     * @param value A number
     * @param precision The number of decimals to which we should round
     * @returns `value`, rounded by `precision`
     *
     * @publicApi
     */
    export function round(value: number, precision = 0) {
        if (precision === 0) return Math.round(value);

        const str = parseString(value).split('.');

        if (str.length === 1) return value;
        if (str[1].length <= precision) return value;

        const parts = str[1].split('').map((split) => Number(split));
        if (parts[precision] > 4)
            parts[precision - 1] = parts[precision - 1] + 1;

        return Number([str[0], parts.slice(0, precision).join('')].join('.'));
    }
}
