import 'reflect-metadata';

import { isNonNullable } from '../type';

/**
 * Adds index metadata to each object in an array and returns
 * @param arr The items to index.
 * @returns A copy of the array, indexed with its original sort order.
 */
export function arrayIndex<T extends Object>(arr: T[]) {
    arr.forEach((value, index) => {
        try {
            Reflect.defineMetadata('_index', index, value);
        } catch (error) {
            console.error('Error: Failed to define index metadata.');
        }
    });

    return arr;
}

export function getArrayItemIndex<T extends Object>(arrItem: T) {
    return Reflect.getOwnMetadata('_index', arrItem);
}

export function arrayIsIndexed<T extends object>(arr: T[]) {
    return arr.every((val) => isNonNullable<number>(getArrayItemIndex<T>(val)));
}
