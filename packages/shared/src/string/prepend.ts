/**
 * Prepends `prepend` to `val` if `val` does not already start with `prepend`.
 * @param val A string
 * @param prepend The string to prepend
 * @returns A new string with `prepend` added to the beginning of `val`.
 *
 * @publicApi
 */
export const prepend = (val: string, prepend: string) => {
    return val.startsWith(prepend) ? val : prepend + val;
};
