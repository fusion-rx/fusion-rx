/**
 * Replaces `key as keyof typeof obj`.
 * @param key A key of T.
 * @returns `key` typed to `keyof T`.
 */
export const keyOf = <T>(object: T, key: string): keyof T =>
    key as keyof typeof object;
