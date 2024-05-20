import { twoDigits } from './two-digits.js';

/**
 * Prepends zeros to `num` to make it three digits long.
 * @param num A number
 * @returns `num` as-is for three-digit numbers, prepended with
 * two zeros for three-digit numbers and two zeros for single-digit numbers.
 *
 * @publicApi
 */
export function threeDigits(num: number) {
    return num < 100 ? '0' + twoDigits(num) : `${num}`;
}
