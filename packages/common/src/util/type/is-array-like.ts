import { isNonNullable } from './non-nullable';
import { isNullable } from './nullable';

export const isConvertibleToArray = (val: any) => {
    // Strings are convertable to arrays, but that's not generally
    // desired behavior.
    if (isNullable(val) || typeof val === 'string') return false;

    if (typeof val === 'object' && ('length' in val || 'size' in val)) {
        return true;
    }

    try {
        let arr = Array.from(val);
        if ((val + '').length > 0 && arr.length > 0) return true;
    } catch {}

    return false;
};

export const isArrayLike = <T>(val: any): val is ArrayLike<T> => {
    return isNonNullable(val) && isConvertibleToArray(val);
};
