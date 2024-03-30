import 'reflect-metadata';

/**
 * Returns the functions of an uninstantiated class (function) from its prototype.
 * @param reference A class
 * @returns The functions defined with a class
 */
export const getClassFunctions = (
    reference: Function
): Record<string, string> => {
    const toReturn: { [name: string | symbol]: any } = {};

    Reflect.ownKeys(reference.prototype).forEach((classMember) => {
        toReturn[classMember] = typeof reference.prototype[classMember];
    });

    return toReturn;
};
