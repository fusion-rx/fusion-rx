/**
 * Returns the word form of a number, such as `2 => two`,
 * `7 => seven`.
 * @param num A number to convert to its word form
 * @returns The tens word form of `num`
 *
 * @publicApi
 */
export function digitToWord(digit: number) {
    switch (digit) {
        case 0:
            return 'zero';
        case 1:
            return 'one';
        case 2:
            return 'two';
        case 3:
            return 'three';
        case 4:
            return 'four';
        case 5:
            return 'five';
        case 6:
            return 'six';
        case 7:
            return 'seven';
        case 8:
            return 'eight';
        case 9:
            return 'nine';
    }

    return digit;
}
