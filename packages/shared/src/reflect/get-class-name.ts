import 'reflect-metadata';

/**
 * Parses the name of an uninstantiated class (function) from its prototype.
 * @param reference A class
 * @returns The name of the class
 * @throws Will throw an error if the classname cannot be found
 */
export const getClassName = (reference: Function): string => {
    const className = reference?.prototype?.constructor.name;

    if (className) return className;
    else throw Error('Failed to locate class with name');
};

export const getInstantiatedClassName = (reference: any): string => {
    return reference.toString().split('(')[0];
};
