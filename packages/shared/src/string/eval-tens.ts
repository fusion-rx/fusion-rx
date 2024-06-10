/**
 * Returns the word form of a number, such as `2 => twenty`,
 * `7 => seventy`.
 * @param num A number to convert to its word form
 * @returns The tens word form of `num`
 *
 * @publicApi
 */
export function evalTens(num: number) {
    switch (num) {
        case 2:
            return 'twenty';
        case 3:
            return 'thirty';
        case 4:
            return 'forty';
        case 5:
            return 'fifty';
        case 6:
            return 'sixty';
        case 7:
            return 'seventy';
        case 8:
            return 'eighty';
        case 9:
            return 'ninety';
    }

    return num;
}
