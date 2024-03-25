/**
 * Builds an object from an array of type `T`.
 * @param arr An array of type `T`.
 * @param objKey A key of `T`.
 * @returns An object whose keys are a `keyof T` and whose
 * values are items in `T` that share a common `T[objKey]`.
 * @example
 * ````typescript
 * const arr = [
 *      { actor: "Harrison Ford", role: "Indiana Jones", "franchise": "Indiana Jones" },
 *      { actor: "Harrison Ford", role: "Han Solo", "franchise": "Star Wars" },
 *      { actor: "Mark Hamill", role: "Luke Skywalker", "franchise": "Star Wars" },
 *      { actor: "Mark Hamill", role: "The Joker", "franchise": "Batman" }
 * ]
 *
 * const actors = groupArrayByKey(arr, 'actor')
 * // actors = {
 * //    "Harrison Ford": [
 * //        { actor: "Harrison Ford", role: "Indiana Jones", "franchise": "Indiana Jones" },
 * //        { actor: "Harrison Ford", role: "Han Solo", "franchise": "Star Wars" }
 * //    ],
 * //    "Mark Hamill": [
 * //        { actor: "Mark Hamill", role: "Luke Skywalker", "franchise": "Star Wars" },
 * //        { actor: "Mark Hamill", role: "The Joker", "franchise": "Batman" }
 * //    ]
 * // }
 *
 * const franchises = groupArrayByKey(arr, 'franchise')
 * // franchises = {
 * //    "Star Wars": [
 * //        { actor: "Harrison Ford", role: "Han Solo", "franchise": "Star Wars" }
 * //        { actor: "Mark Hamill", role: "Luke Skywalker", "franchise": "Star Wars" },
 * //    ],
 * //    "Indiana Jones": [
 * //        { actor: "Harrison Ford", role: "Indiana Jones", "franchise": "Indiana Jones" },
 * //    ]
 * //    "Batman": [
 * //        { actor: "Mark Hamill", role: "The Joker", "franchise": "Batman" }
 * //    ]
 * // }
 * ````
 *
 * @publicApi
 */
export function groupArrayByKey<T extends object>(
    arr: T[],
    objKey: keyof T
): Record<string, T[]> {
    const obj = {} as any;
    arr.forEach((val) => {
        if (obj[val[objKey]] !== undefined) {
            obj[val[objKey]].push(val);
        } else {
            obj[val[objKey]] = [val];
        }
    });
    return obj;
}
