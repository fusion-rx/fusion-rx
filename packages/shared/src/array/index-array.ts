import { isNonNullable } from '../type/type-check';

/**
 * Returns the index metadata of `ele`.
 * @param ele An element in an array
 * @returns The index metadata of `ele` or undefined if `ele`
 * the array has not been indexed. See {@link indexArray}.
 *
 * @publicApi
 */
export function getArrayElementIndex<T extends object>(ele: T) {
    return Reflect.getMetadata('_index', ele);
}

/**
 * Adds index metadata to each object in an array and returns
 * @param arr The items to index.
 * @returns A copy of the array, indexed with its original sort order.
 *
 * @publicApi
 */
export function indexArray<T extends object>(arr: T[]) {
    arr.forEach((value, index) => {
        try {
            Reflect.defineMetadata('_index', index, value);
        } catch (error) {
            console.error('Error: Failed to define index metadata.');
        }
    });

    return arr;
}

/**
 * Checks if an array has been indexed by {@link indexArray}
 * @param arr An array
 * @returns True if the array has been indexed by {@link indexArray};
 * otherwise, false
 *
 * @publicApi
 */
export function isArrayIndexed<T extends object>(arr: T[]) {
    return arr.every((val) =>
        isNonNullable<number>(getArrayElementIndex<T>(val))
    );
}
