import 'reflect-metadata';

import { getMetadata } from './get-metadata';

/**
 * Returns all metadata from an object.
 * @param target The target object.
 * @returns All metadata associated with the object.
 */
export const getAllMetadata = (target: object) => {
    const metadata: Record<string, any> = {};
    Reflect.getMetadataKeys(target).forEach(
        (key) => (metadata[key] = getMetadata(key, target))
    );
    return metadata;
};
