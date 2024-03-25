/**
 * Executes `callback` on each element in an arry or an array-like.
 * @param arr An array or arry-like.
 * @param callback Executed on each element in the array.
 */
export const forEachIn = <T>(
    arr: ArrayLike<T> | Iterable<T>,
    callback: (val: T, index: number) => void
) => {
    (Array.isArray(arr) ? arr : Array.from(arr)).forEach(
        (val: T, index: number) => callback(val, index)
    );
};
