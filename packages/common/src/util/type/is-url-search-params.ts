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
