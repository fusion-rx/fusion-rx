import 'reflect-metadata';

/**
 * Extracts metadata from an object by key.
 * @param key The metadata key.
 * @param target The target object.
 * @returns The metadata associated with the object's key.
 */
export const getMetadata = (key: string, target: object) =>
    Reflect.getMetadata(key, target);
