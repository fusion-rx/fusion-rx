/**
 * A typed interface for Object.keys(obj).forEach(key => void).
 * @param obj An object
 * @param callback A closure called on each element in an object
 *
 * @publicApi
 */
export const forEachKey = <T extends object>(
    obj: T,
    callback: (val: T[keyof T], key: keyof T) => void
) => {
    Object.keys(obj).forEach((key) => {
        const k = key as keyof T;
        callback(obj[k], k);
    });
};
