/**
 * Evaluates whether `val` starts with `token`
 * @param val A string to search
 * @param token A regular express used to evaluate whether `val`
 * starts with a value
 *
 * @publicApi
 */
export function startsWith(val: string, token: RegExp): boolean;

/**
 * Evaluates whether `val` starts with `token`
 * @param val A string to search
 * @param token A token or array of tokens that might be at the start of `val`
 *
 * @publicApi
 */
export function startsWith(
    val: string,
    token: string[] | string,
    options?: {
        caseSensitive: boolean;
    }
): boolean;

export function startsWith(
    val: string,
    token: RegExp | string[] | string,
    options?: {
        caseSensitive: boolean;
    }
) {
    if (options?.caseSensitive === false) {
        val = val.toLowerCase();

        if (typeof token === 'string') {
            token = token.toLowerCase();
        }

        if (Array.isArray(token)) {
            token = token.map((token) => token.toLowerCase());
        }
    }

    if (typeof token === 'string') return val.startsWith(token);
    if (Array.isArray(token))
        return token.some((token) => val.startsWith(token));

    const match = val.match(token);
    if (match && match.length > 0)
        return match.some((match) => val.indexOf(match) === 0);

    return false;
}
