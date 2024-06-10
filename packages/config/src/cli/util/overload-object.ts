import { isTruthy } from '@fusion-rx/shared';

const isObject = (val: any): val is NonNullable<object> =>
    isTruthy<any>(val) && typeof val === 'object' && !Array.isArray(val);

export function overloadObject(
    base: any,
    overload: any,
    depth?: number,
    currentDepth = 0
): any {
    const output: any = {};
    const hasDepth = depth !== undefined && depth !== null;

    if (hasDepth && depth === currentDepth) {
        if (isTruthy<any>(overload)) {
            return overload;
        }

        return base;
    }

    if (isObject(base) && isObject(overload)) {
        Object.keys(base).forEach((baseKey) => {
            output[baseKey] = base[<keyof typeof baseKey>baseKey];
        });

        Object.keys(overload).forEach((overloadKey) => {
            output[overloadKey] = hasDepth
                ? overloadObject(
                      base[overloadKey as keyof typeof base],
                      overload[overloadKey as keyof typeof overload],
                      depth,
                      (currentDepth += 1)
                  )
                : overloadObject(
                      base[overloadKey as keyof typeof base],
                      overload[overloadKey as keyof typeof overload]
                  );
        });

        return output;
    } else if (isTruthy<any>(overload)) {
        return overload;
    } else {
        return base;
    }
}
