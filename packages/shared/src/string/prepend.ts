/**
 * @param val A string.
 * @param prepend The string to prepend.
 * @returns A new string with `prepend` added to the beginning of `val`.
 */
export const prepend = (val: string, prepend: string) => {
    return val.startsWith(prepend) ? val : val + prepend;
};
