import { isNullable } from '../type';
import { tryCatch } from '../operators/try';

export function equivalent<T>(
    a: T,
    b: unknown
    // opts?: {
    //     strict: boolean;
    //     compareVals: boolean;
    // }
): boolean {
    if (isNullable(a) || isNullable(b) || typeof a !== typeof b) return false;
    if (typeof a === 'object' && typeof b === 'object')
        return tryCatch(
            () => JSON.stringify(a) === JSON.stringify(b),
            () => a === b
        );
    else return a === b;
    // if (typeof a !== typeof b) return false;
    // if (typeof a === 'function' && a.toString() !== b.toString()) return false;
    // if (Array.isArray(a) && Array.isArray(b)) {
    //     if (a.length !== b.length) {
    //         return false;
    //     }
    //     for (let i = 0; i < a.length; i++) {
    //         if (!compare(a[i], b[i], opts)) {
    //             return false;
    //         }
    //     }
    // }
    // if (typeof a === 'object' && typeof b === 'object') {
    //     Object.keys(a).forEach((key) => {
    //         if (b.hasOwnProperty(key)) {
    //             if (
    //                 !compare(
    //                     a[key as keyof typeof a],
    //                     b[key as keyof typeof b],
    //                     opts
    //                 )
    //             ) {
    //                 return false;
    //             }
    //         } else {
    //             return false;
    //         }
    //     });
    // }

    // opts = opts ?? {
    //     strict: opts?.strict ?? true,
    //     compareVals: opts?.compareVals ?? true,
    // };

    // if (opts.compareVals) {
    //     if (opts.strict && (a as any) !== (b as any)) return false;
    //     else if ((a as any) != (b as any)) return false;
    // }
    // return true;
}

/**
 * original 
 * 
 * /**
     * Determines if the objects are _traditionally_ equal to each other.
     * One thing to note is that it uses coercive comparison (==) on properties which both objects have, not strict comparison (===)
     * @param a The base object which you would like to compare another object to
     * @param b The object to compare to base
     * @returns boolean indicating whether or not the objects have all the same properties and those properties are ==
private compareObjects<T>(a: T, b: T): boolean {
    // loop through all properties in base object
    for (let baseProperty in a) {
        // determine if comparrison object has that property, if not: return false
        if (b.hasOwnProperty(baseProperty)) {
            switch (typeof a[baseProperty]) {
                // if one is object and other is not: return false
                // if they are both objects, recursively call this comparison function
                case 'object':
                    if (
                        typeof b[baseProperty] !== 'object' ||
                        !this.compareObjects(
                            a[baseProperty],
                            b[baseProperty]
                        )
                    ) {
                        return false;
                    }
                    break;
                // if one is function and other is not: return false
                // if both are functions, compare function.toString() results
                case 'function':
                    if (
                        typeof b[baseProperty] !== 'function' ||
                        a[baseProperty].toString() !==
                            b[baseProperty].toString()
                    ) {
                        return false;
                    }
                    break;
                // otherwise, see if they are equal using coercive comparison
                default:
                    if (a[baseProperty] != b[baseProperty]) {
                        return false;
                    }
            }
        } else {
            return false;
        }
    }

    // returns true only after false HAS NOT BEEN returned through all loops
    return true;
}
 */
