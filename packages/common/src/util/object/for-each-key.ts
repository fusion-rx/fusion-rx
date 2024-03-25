export const forEach = <T extends object>(
    obj: T,
    callback: (val: T[keyof T], key: keyof T) => void
) => {
    Object.keys(obj).forEach((key) => {
        const k = key as keyof T;
        callback(obj[k], k);
    });
};
