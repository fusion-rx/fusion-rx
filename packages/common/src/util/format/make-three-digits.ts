import { makeTwoDigits } from './make-two-digits';

/**
 * Prepends zeros to `num` to make it three digits long.
 * @param num A number
 * @returns `num` as-is for three-digit numbers, prepended with
 * two zeros for three-digit numbers and two zeros for single-digit numbers.
 */
export function makeThreeDigits(num: number) {
    return num < 100 ? '0' + makeTwoDigits(num) : `${num}`;
}
