export const buildObject = <T = any>(
    arr: (keyof T)[],
    callbackfn: (value: keyof T, index: number, array: (keyof T)[]) => any
): T => {
    const toBuild: T = {} as T;
    arr.forEach(
        (val, index, array) => (toBuild[val] = callbackfn(val, index, array))
    );
    return toBuild;
};
