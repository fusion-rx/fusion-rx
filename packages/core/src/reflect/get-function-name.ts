import 'reflect-metadata';

/**
 * Parses the name of a function from its prototype.
 * @param reference A class
 * @returns The name of the class
 * @throws Will throw an error if the classname cannot be found
 */
export const getFunctionName = (reference: Function): string => {
    const match = (reference.prototype.constructor.toString() as string).match(
        /class\s(.[^\s]{1,})/
    );

    if (match) return match[0].replace('class ', '');
    else throw Error('Failed to locate class with name');
};
