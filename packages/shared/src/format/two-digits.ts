/**
 * Prepends zeros to `num` to make it two digits long.
 * @param num A number
 * @returns `num` as-is for two-digit numbers and prepended with
 * one zero for one-digit numbers.
 *
 * @publicApi
 */
export function twoDigits(num: number) {
    return num < 10 ? '0' + num : `${num}`;
}

/**
 * Alias for {@link twoDigits}.
 */
export const padTwo = twoDigits;
