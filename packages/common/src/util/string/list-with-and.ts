import { toNumber } from '../type';

/**
 * Concatenates a list of strings or numbers using 'and' as the delimiter.
 * @param val The values to concatenate.
 * @returns
 * - if `val` contains one item, returns the item as a string.
 * - If `val` contains two items, concatenates items with `and`.
 * - If `val` contains three or more items, concatenates items with commas, inserting `and` before the final item.
 * @example
 * listWithAnd('apples', 'pears', 'bananas') => 'apples, pears, and bananas'
 * listWithAnd('apples', 'pears') => 'apples and pears'
 * listWithAnd('apples') => 'apples'
 * listWithAnd(23, 24, 25) => '23, 24, and 25'
 * listWithAnd(23, 24) => '23 and 24'
 * listWithAnd(23) = '23'
 */
export function listWithAnd(...val: (string | number)[]): string {
    switch (val.length) {
        case 1:
            return toNumber(val[0]) + '';
        case 2:
            return val[0] + ' and ' + val[1];
        default:
            const finalWord = val.pop();
            return [...val, 'and ' + finalWord].join(', ');
    }
}
