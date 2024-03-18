import 'reflect-metadata';

/**
 * Extracts metadata from an object by key.
 * @param key The metadata key.
 * @param target The target object.
 * @returns The metadata associated with the object's key or
 * undefined if the metadata is not defined..
 */
export function getMetadata<T = any>(
    key: string,
    target: object
): T | undefined;

/**
 * Extracts metadata from an object by key.
 * @param key A metadata key
 * @param target A target object
 * @param defaultVal A default value to return if the metadata is undefined
 * @returns The metadata associated with the object's key or
 * `defaultVal` if the metadata is not defined..
 */
export function getMetadata<T = any>(
    key: string,
    target: object,
    defaultVal: T
): T;

export function getMetadata<T = any>(
    key: string,
    target: object,
    defaultVal: any = undefined
): T | undefined {
    const metadata = Reflect.getMetadata(key, target);
    return metadata ? (metadata as T) : (defaultVal as T);
}
