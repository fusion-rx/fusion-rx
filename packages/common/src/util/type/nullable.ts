export declare type Nullable = null | undefined;

export function isNullable(value: unknown): value is Nullable {
    return value === null || value === undefined;
}
