import { IMPORTS } from '../di';
import { Class } from '../interface';
import { initializeModule } from './initialize-modules';
import { FsnModuleRef } from './refs';

export const registerImports = (moduleRef: Class<any>) => {
    const imports: Record<string, FsnModuleRef> = {};

    // Register all imported modules so we can build a dependency tree
    Reflect.getMetadata(IMPORTS, moduleRef)?.forEach((imported: Class<any>) => {
        // Register the imported module
        const registered = initializeModule(imported);
        imports[registered.moduleName] = registered;
    });

    return imports;
};
