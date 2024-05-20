import 'reflect-metadata';
import { getPropertyMetadata } from './get-metadata.js';

/**
 *
 * @param target An object or class
 * @param propertyKey The string name of a property or classmember of `target`
 * @returns
 */
export const getFunctionParameters = (
    target: object,
    propertyKey: string | symbol
) =>
    getPropertyMetadata('design:paramtypes', target, propertyKey, []).map(
        (val: any) => {
            return (val.toString() as string)
                .split(' ')[1]
                .replace('()', '')
                .toLowerCase();
        }
    );
