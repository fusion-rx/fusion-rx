import { readdirSync } from 'fs';
import { join } from 'path';
import { readCollection } from './read-collection';
import { overloadObject } from './overload-object';
import { Collection } from '../interface/collection';

/**
 * Builds overloaded collections.
 * @param collectionName The name of the collection to build.
 * @param collectionOptions The build options for the collection.
 * @returns The collection's configuration built into a single object.
 */
export const buildOverloadedCollection = (
    collectionName: string,
    collection: Collection,
    baseURL: string,
    project?: string
) => {
    const output: any = {};

    const collectionDir: any = readdirSync(join(baseURL, collectionName));
    const fileOverload: any = collection.replaceCore ?? false;

    let baseConf: any = {};
    let projectConf: any = {};

    if (collectionDir.includes('core')) {
        baseConf =
            readCollection(collectionName, collection, baseURL, 'core') ?? {};
    }

    if (project && collectionDir.includes(project)) {
        projectConf =
            readCollection(collectionName, collection, baseURL, project) ?? {};
    }

    if (!fileOverload) {
        // const projectConfigs = Object.keys(projectConf);

        // projectConfigs.forEach((projectConfKey) => {
        //     output[projectConfKey] = projectConf[projectConfKey];
        // });

        return overloadObject(baseConf, projectConf);
    } else {
        Object.keys(projectConf).forEach((projectKey) => {
            baseConf[projectKey] = projectConf[projectKey];
            output[projectKey] = baseConf[projectKey];
        });
    }

    return output;
};
