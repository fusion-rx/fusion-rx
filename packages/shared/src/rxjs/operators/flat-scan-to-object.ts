import { OperatorFunction, scan } from 'rxjs';

export function flatScanToObject<T, R = { [key: string]: T }>(
    key: keyof T,
    valKey: keyof T
): OperatorFunction<T, R> {
    const scanner = (accumulator: R, next: T) => {
        try {
            accumulator[`${next[key]}` as keyof typeof accumulator] = next[
                valKey
            ] as any;
        } catch (err) {
            console.error(err);
        } finally {
            return accumulator;
        }
    };

    return scan<T, R>(
        (accumulator, next) => scanner(accumulator, next),
        {} as R
    );
}
