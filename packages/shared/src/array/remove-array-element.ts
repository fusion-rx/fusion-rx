import { equivalent } from '../object/equivalent';

/**
 * Removes an element from an array and returns the modified array.
 * @param arr The array from which an element will be removed.
 * @param value The value that will be removed from the array.
 * @returns The original array with the value removed. If the value cannot be found,
 * returns the original array.
 *
 * @publicApi
 */
export const removeArrayElement = <T>(arr: T[], value: T) => {
    arr.splice(
        arr.findIndex((val) => {
            return equivalent(val, value);
        }),
        1
    );
    return arr;
};
