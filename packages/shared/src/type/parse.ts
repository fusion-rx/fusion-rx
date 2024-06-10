import { isArrayLike, isNonNullable } from './type-check.js';
import { quote } from '../string/public-api.js';

/** Extracts the type `T` from an `Array<T>`. */
type Unarray<T> = T extends Array<infer U> ? U : T;

/**
 *
 * @param val A value of type {@link Array}, {@link ArrayLike}, or `any`.
 * @returns One of the following:
 * - If `val` is an {@link Array}, returns it
 * - If `val` is an {@link ArrayLike}, returns `Array.from(val)`
 * - If `val` is not an array, returns `[val]`
 * - If `val` is {@link Nullable}, returns an empty {@link Array}
 */
export function parseArr<T, R = Unarray<T>>(val: T): R[] {
    return val !== undefined && val !== null
        ? Array.isArray(val)
            ? (val as R[])
            : isArrayLike<R>(val)
              ? Array.from<R>(val)
              : ([val] as R[])
        : ([] as R[]);
}

/**
 * - If `val` is a boolean, returns it.
 * - If `val` is a string, returns `val === 'true'`
 * - If `val` is a number, returns `val > 0`
 * - If `val` is Nullable, returns `defaultVal`.
 * @param val A value whose type is `boolean` or `unknown`.
 * @param defaultVal (optional) A default value to return if `val` is Nullable
 * or cannot be parsed. Defaults to `false`.
 */
export function parseBool(val: any, defaultVal = false): boolean {
    if (isNonNullable(val)) {
        switch (typeof val) {
            case 'boolean':
                return val;
            case 'string':
                return val === 'true';
            case 'number':
                return val > 0;
        }
    }

    return defaultVal;
}

/**
 * - If `val` is a number, returns it.
 * - If `val` is a boolean, returns `1` for `true` and `0` for false.
 * - If `val` is a string, parses the string, returning the parsed value if it is a number.
 * - If `val` is Nullable, returns `defaultVal`.
 * @param val A value whose type is `boolean` or `unknown`.
 * @param defaultVal (optional) A default value to return if `val` is Nullable
 * or cannot be parsed. Defaults to `0`.
 */
export function parseNum<T>(val: T, defaultVal = 0): any {
    if (isNonNullable(val)) {
        switch (typeof val) {
            case 'number':
                return val;
            case 'boolean':
                return val === true ? 1 : 0;
            case 'string':
                const number = Number.parseInt(val);
                if (!Number.isNaN(number)) return number;
        }
    }

    return defaultVal;
}

export declare interface StringOptions {
    defaultValue?: string;
    stringifyNumber?: boolean;
    quoteObjString?: boolean;
    logError?: boolean;
}

/**
 * @param val A value
 * @param defaultVal (optional) The default value to return. Defaults to an empty string.
 * @param logError (optional) Whether parse errors should be logged. Defaults to `false`.
 * @returns based on the type of val, returns...
 * | Type     | Returns                 | Output
 * | -------- | ----------------------- | ------
 * | string   | `val`                   | `val`
 * | Array    | `val.toString()`        | `val1,val2,val3,...val_n`
 * | symbol   | `va.toString()`         | `Symbol(<description>)`
 * | Buffer   | `val.toString('utf-8')` | `val`
 * | bigint   | `val.toString()`        | `val`
 * | number   | `val.toString()`        | `val`
 * | function | `JSON.stringify(val)`   | `(..args) => {} || function fnName {}`
 * | object   | `JSON.stringify(val)`   | `{key:val}`
 * | Nullable |                         | `defaultVal`
 */
export function parseString(
    val: any,
    defaultValue?: string,
    logError?: boolean
): string;

/**
 * @param val A value
 * @param options
 * @returns based on the type of val, returns...
 * | Type     | Returns                 | Output
 * | -------- | ----------------------- | ------
 * | string   | `val`                   | `val`
 * | Array    | `val.toString()`        | `val1,val2,val3,...val_n`
 * | symbol   | `va.toString()`         | `Symbol(<description>)`
 * | Buffer   | `val.toString('utf-8')` | `val`
 * | bigint   | `val.toString()`        | `val`
 * | number   | `val.toString()`        | `val`
 * | function | `JSON.stringify(val)`   | `(..args) => {} || function fnName {}`
 * | object   | `JSON.stringify(val)`   | `{key:val}`
 * | Nullable |                         | `defaultVal`
 */
export function parseString(
    val: any,
    options: StringOptions & {
        stringifyNumber: false;
    }
): string | number;

/**
 * @param val A value
 * @param options
 * @returns based on the type of val, returns...
 * | Type     | Returns                 | Output
 * | -------- | ----------------------- | ------
 * | string   | `val`                   | `val`
 * | Array    | `val.toString()`        | `val1,val2,val3,...val_n`
 * | symbol   | `va.toString()`         | `Symbol(<description>)`
 * | Buffer   | `val.toString('utf-8')` | `val`
 * | bigint   | `val.toString()`        | `val`
 * | number   | `val.toString()`        | `val`
 * | function | `JSON.stringify(val)`   | `(..args) => {} || function fnName {}`
 * | object   | `JSON.stringify(val)`   | `{key:val}`
 * | Nullable |                         | `defaultVal`
 */
export function parseString(
    val: any,
    options: StringOptions & {
        stringifyNumber?: true;
    }
): string;

export function parseString(
    val: any,
    optionsOrDefaultValue?: StringOptions | string,
    logErrorOrNull?: boolean
): string | number {
    let defaultVal = '';
    let stringifyNumber = true;
    let quoteObjString = false;
    let logError = false;

    if (isNonNullable(optionsOrDefaultValue)) {
        if (typeof optionsOrDefaultValue === 'string') {
            defaultVal = optionsOrDefaultValue;
            logError =
                logErrorOrNull !== null && logErrorOrNull !== void 0
                    ? logErrorOrNull
                    : false;
        } else {
            defaultVal = optionsOrDefaultValue.defaultValue ?? defaultVal;
            stringifyNumber = optionsOrDefaultValue.stringifyNumber ?? true;
            quoteObjString = optionsOrDefaultValue.quoteObjString ?? false;
            logError = optionsOrDefaultValue.logError ?? false;
        }
    }

    const stringify = (val: Function | Object) => {
        try {
            return JSON.stringify(val);
        } catch (e) {
            if (logError) console.error(e);
            return defaultVal;
        }
    };

    if (isNonNullable(val)) {
        switch (typeof val) {
            case 'string':
                return val;
            case 'number':
                return stringifyNumber ? val.toString() : val;
            case 'function':
                return val.toString();
            case 'object':
                let objString;
                if (Array.isArray(val)) objString = val.toString();
                if (Buffer.isBuffer(val)) {
                    try {
                        objString = val.toString('utf-8');
                    } catch (err) {
                        if (logErrorOrNull) console.error(err);
                        objString = defaultVal;
                    }
                }
                objString = stringify(val);
                return quoteObjString ? quote(objString) : objString;
            default:
                try {
                    return val.toString();
                } catch (e) {
                    if (logError) console.error(e);
                }
        }
    }

    return defaultVal;
}
