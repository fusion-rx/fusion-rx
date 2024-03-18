import { FsnProvidereRef } from './refs';
import { CLASS_NAME, EXPORTS, PROVIDED_IN } from '../di';
import { Class } from '../interface';
import { getMetadata } from '../reflect';

export const registerExports = (
    moduleRef: Class<any>,
    moduleName: string,
    localProviders: Record<string, FsnProvidereRef>
) => {
    // Add the instance of exported modules to the `exports` of the
    // registered module.
    const exports: Record<string, any> = {};

    const registerExport = (exported: Class<any>, index: number) => {
        // The exports array holds references to classes, so we have to
        // get the class name so we can export the registered provider's
        // instance
        const exportName = Reflect.getMetadata(CLASS_NAME, exported);

        console.log(exportName);

        // TODO - we need to handle dynamic providers
        if (exportName === undefined)
            throw new Error(
                `Failed to resolve provider ? ` +
                    `exported from ${exportName} at position ${index}. ` +
                    'Is it a valid class decorated with @Injectable()?'
            );

        // If we've somehow gotten this far without initializing
        // the exported provider, then we have to throw an error.
        if (localProviders[exportName]?.instance === undefined) {
            throw new Error(
                `Failed to resolve exported provider ${exportName} ` +
                    `from module ${moduleName} at position ${index}. ` +
                    'Is it a valid class decorated with @Injectable()?'
            );
        }

        // If it has been initialized, we add the provider's instance
        // to the exports array so it can be accessed by
        // modules that import this module.
        exports[exportName] = localProviders[exportName].instance;
    };

    getMetadata<Class<any>[]>(EXPORTS, moduleRef, []).forEach(
        (exported, index) => {
            // If this provider is injected in the root context, there's
            // no need to register it as an export.
            if (Reflect.getMetadata(PROVIDED_IN, exported) !== 'root') {
                registerExport(exported, index);
            }
        }
    );

    return exports;
};
