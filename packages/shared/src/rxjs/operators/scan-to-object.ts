import { OperatorFunction, scan } from 'rxjs';

export function scanToObject<T, R = { [key: string]: T }>(
    key: keyof T,
    ...keys: (keyof T)[]
): OperatorFunction<T, R> {
    const scanner =
        keys.length > 0
            ? (accumulator: R, next: T) => {
                  try {
                      const toAccumulate = {} as T;
                      keys.forEach((key) => {
                          toAccumulate[key] = next[key];
                      });
                      accumulator[`${next[key]}` as keyof R] =
                          toAccumulate as any;
                  } catch (err) {
                      console.error(err);
                  } finally {
                      return accumulator;
                  }
              }
            : (accumulator: R, next: T) => {
                  accumulator[`${next[key]}` as keyof R] = next as any;
                  return accumulator;
              };

    return scan<T, R>(
        (accumulator, next) => scanner(accumulator, next),
        {} as R
    );
}
