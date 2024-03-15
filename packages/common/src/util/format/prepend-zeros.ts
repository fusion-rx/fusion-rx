/**
 * Prepends zeros to num if its length is less than `returnLength`.
 * @param num A number or string
 * @param returnLength The number-of-digits of the return strng
 * @returns `num` as-is if its length is equal then or greater to
 * `returnLength`, or with `n` digits prepended to `num`
 * so its length equals `returnLength`
 */
export const prependZeros = (num: any, returnLength: number) =>
    `${num}`.length >= returnLength
        ? `${num}`
        : '0'.repeat(returnLength - `${num}`.length) + num;
