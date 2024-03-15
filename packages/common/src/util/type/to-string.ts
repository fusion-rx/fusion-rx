import { quote } from '../string';
import { isNonNullable } from './non-nullable';

export declare interface ToStringOptions {
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
export function toString(
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
export function toString(
    val: any,
    options: ToStringOptions & {
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
export function toString(
    val: any,
    options: ToStringOptions & {
        stringifyNumber?: true;
    }
): string;

export function toString(
    val: any,
    optionsOrDefaultValue?: ToStringOptions | string,
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
