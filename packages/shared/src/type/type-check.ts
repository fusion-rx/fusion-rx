import {
    Observer,
    Subject,
    Subscriber,
    Subscription,
    UnaryFunction
} from 'rxjs';

export declare type Nullable = null | undefined;

/**
 * Returns the parse type of `val`.
 * @param val A value
 * @returns Gets the parsed type of `val`
 */
export const getParseType = (
    val: any
): 'string' | 'integer' | 'float' | 'object' | 'date' | 'boolean' => {
    if (typeof val === 'string') {
        if (isParsableDate(val)) return 'date';
        if (isParsableInteger(val)) return 'integer';
        if (isParsableFloat(val)) return 'float';
        if (isParsableJSON(val)) return 'object';
        if (isParsableBoolean(val)) return 'boolean';
        return 'string';
    }

    throw new Error(
        'Parsed type of val could not be determined because it is not a string.'
    );
};

/**
 * Safely assert whether the given value is an ArrayBuffer.
 *
 * In some execution environments ArrayBuffer is not defined.
 */
export const isArrayBuffer = (value: any): value is ArrayBuffer =>
    typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer;

/**
 * Safely assert whether the given value is ArrayLike.
 */
export const isArrayLike = <T>(val: any): val is ArrayLike<T> =>
    isNonNullable(val) && isConvertibleToArray(val);

/**
 * Safely assert whether the given value is a Blob.
 *
 * In some execution environments Blob is not defined.
 */
export const isBlob = (value: any): value is Blob =>
    typeof Blob !== 'undefined' && value instanceof Blob;

/**
 * Safely assert whether the given value can be converted to an array.
 */
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

/**
 * Safely assert whether the given value is a Date.
 */
export const isDate = (val: any): val is Date =>
    isNonNullable<Date>(val) && typeof val.getDate === 'function';

/**
 * Safely assert whether the given value is a FormData instance.
 *
 * In some execution environments FormData is not defined.
 */
export const isFormData = (value: any): value is FormData =>
    typeof FormData !== 'undefined' && value instanceof FormData;

/**
 * Safely assert whether the given value is a function.
 */
export function isFunction(value: unknown): value is (...args: any[]) => any {
    return isNonNullable<any>(value) && typeof value === 'function';
}

/**
 * Safely assert whether the given value is a native
 * JavaScript error.
 */
export const isNativeError = (e: any): e is Error =>
    isNonNullable(e) && typeof e === 'object' && 'message' in e && 'name' in e;

/**
 * Safely assert whether the given valus is an object that is
 * not null or undefined.
 */
export function isNonNullObject<T>(val: T | Nullable): val is NonNullable<T> {
    return isNonNullable<T>(val) && typeof val === 'object';
}

/**
 * Safely assert whether the given value is an Observer.
 */
export function isObserver<T>(value: any): value is Observer<T> {
    return (
        value &&
        isFunction(value.next) &&
        isFunction(value.error) &&
        isFunction(value.complete)
    );
}

/**
 * Safely assert that `val` is a `keyof T`.
 */
export function isObjectKey<T>(val: unknown): val is keyof T {
    return (
        (isNonNullable<any> && typeof val === 'string') ||
        typeof val === 'symbol' ||
        typeof val === 'number'
    );
}

/**
 * Safely assert whether the given value is a Subject.
 */
export function isSubject<T>(value: any): value is Subject<T> {
    return (
        value &&
        isFunction(value.lift) &&
        isFunction(value.next) &&
        isFunction(value.error)
    );
}

/**
 * Safely assert whether the given value is a subscriber.
 */
export function isSubscriber<T>(value: any): value is Subscriber<T> {
    return (
        (value && value instanceof Subscriber) ||
        (isObserver(value) && isSubscription(value))
    );
}

/**
 * Safely assert whether the given value is a subscription.
 */
export function isSubscription(value: any): value is Subscription {
    return (
        value instanceof Subscription ||
        (value &&
            'closed' in value &&
            isFunction(value.remove) &&
            isFunction(value.add) &&
            isFunction(value.unsubscribe))
    );
}

/**
 * Safely assert whether the given value is a unary function.
 */
export function isUnaryFunction<T = any, A = any>(
    val: unknown
): val is UnaryFunction<T, A> {
    return val !== undefined && val !== null && typeof val === 'function';
}

/**
 * Safely assert whether the given value is a URLSearchParams instance.
 *
 * In some execution environments URLSearchParams is not defined.
 */
export function isUrlSearchParams(value: any): value is URLSearchParams {
    return (
        typeof URLSearchParams !== 'undefined' &&
        value instanceof URLSearchParams
    );
}

/**
 * Safely assert whether the given value is not null or undefined.
 */
export const isNonNullable = <T = any>(
    value: T | Nullable
): value is NonNullable<T> => {
    return value !== null && value !== undefined;
};

/**
 * Safely assert whether the given value is null or undefined.
 */
export function isNullable(value: unknown): value is Nullable {
    return value === null || value === undefined;
}

/**
 * Safely assert whether the given value is a parsable boolean.
 */
export const isParsableBoolean = (val: any): boolean =>
    val !== undefined && val !== null && (val === 'true' || val === 'false');

/**
 * Safely assert whether the given value is a parsable date.
 */
export const isParsableDate = (str: any): boolean => !isNaN(Date.parse(str));

/**
 * Safely assert whether the given value is a parsable float.
 */
export const isParsableFloat = (val: any): boolean =>
    new RegExp('(^[1-9]{1,}).([1-9]{1,}$)', 'g').test(val);

/**
 * Safely assert whether the given value is a parsable integer.
 */
export const isParsableInteger = (val: any): boolean =>
    new RegExp('^[1-9]{1,}$', 'g').test(val);

const wrappedWithBraces = (val: string) =>
    val.startsWith('{') && val.endsWith('}');

const wrappedWithBrackets = (val: string) =>
    val.startsWith('[') && val.endsWith(']');

/**
 * Safely assert whether the given value is a parsable JSON object.
 */
export const isParsableJSON = (val: any): boolean =>
    val !== undefined &&
    val !== null &&
    typeof val === 'string' &&
    (wrappedWithBraces(val) || wrappedWithBrackets(val));
