import 'reflect-metadata';

import { getClassName } from './get-class-name';

/**
 * Extracts injected dependencies from a class (function).
 * @param reference A class with 0 or more injected dependencies.
 * @returns An array of `reference`'s injected dependencies, or an empty array.
 */
export const getInjectedDependencies = (reference: Function): string[] =>
    (
        Reflect.getOwnMetadata(
            'design:paramtypes',
            reference.prototype.constructor
        ) ?? []
    )
        .map((item: any) => getClassName(item))
        .filter((args: string) => args.length > 0);
