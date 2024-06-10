/**
 * Calls `trier`. If `trier` throws an error, calls `catcher`.
 * @param trier A function that may throw an exception
 * @param catcher A function that handles caught exceptions
 * @returns T returned from `trier` or T returned from `catcher
 *
 * @publicApi
 */
export function tryCatch<T = any>(
    trier: () => T,
    catcher: (error: any) => T
): T;

/**
 * Calls `trier`. If `trier` throws an error, calls `catcher`.
 * @param trier A function that may throw an exception
 * @param catcher (optional) A function that handles caught exceptions
 * @returns T or void returned from `trier` or T or void returned from `catcher
 *
 * @publicApi
 */
export function tryCatch<T = any>(
    trier: () => T | void,
    catcher?: (error: any) => T | void
): T | void;

/**
 * Calls `trier`. If `trier` throws an error, calls `catcher`.
 * @param trier A function that may throw an exception
 * @param catcher A function that handles caught exceptions
 * @returns void
 *
 * @publicApi
 */
export function tryCatch(
    trier: () => void,
    catcher?: (error: any) => void
): void;

export function tryCatch<T = any>(
    trier: () => T | void,
    catcher?: (error: any) => T | void
): T | void {
    try {
        return trier();
    } catch (e) {
        if (catcher) return catcher(e);
    }
}
