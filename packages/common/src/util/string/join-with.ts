import { toString } from '../type';

/**
 * Delimits an array of values with a custom delimiter.
 * @param delimiter The joining character(s) - i.e. `', '`, `\n`.
 * @param val Strings to be delimited.
 * @returns Stringified array delimited with custom delimiter.
 */
export const joinWith = (
    delimiter: string,
    ...val: (string | number | symbol)[]
) => val.map<string | number>((s) => toString(s)).join(delimiter);
