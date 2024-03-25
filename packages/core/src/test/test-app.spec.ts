import { FsnProvidereRef, FsnModuleRef } from '../application';
import { FsnModule, Injectable } from '../di';

@Injectable({
    providedIn: 'module'
})
export class ExternalModuleProvider {
    count = 0;

    constructor() {}

    increaseCount() {
        this.count = this.count + 1;
    }
}

@FsnModule({
    providers: [ExternalModuleProvider],
    exports: [ExternalModuleProvider]
})
export class ExternalModule {}

@Injectable({
    providedIn: 'module'
})
export class ModuleProvider {
    constructor(public externalModuleProvider: ExternalModuleProvider) {
        this.externalModuleProvider.increaseCount();
    }
}

@Injectable({
    providedIn: 'root'
})
export class RootProvider {
    constructor(
        public myTestInjectable: ModuleProvider,
        public externalModuleProvider: ExternalModuleProvider
    ) {
        this.externalModuleProvider.increaseCount();
    }
}

@FsnModule({
    providers: [RootProvider, ModuleProvider],
    imports: [ExternalModule]
})
export class MainModule {}

interface RootProviderRef extends FsnProvidereRef {
    providerName: 'RootProvider';
    providedIn: 'root';
    injected: [];
    instance: any;
}
interface ModuleProviderRef extends FsnProvidereRef {
    providerName: 'ModuleProvider';
    providedIn: 'module';
    injected: [];
    instance: any;
}

interface ExternalModuleProviderRef extends FsnProvidereRef {
    providerName: 'ExternalModuleProvider';
    providedIn: 'module';
    injected: [];
    instance: any;
}

interface ExternalModuleRef extends FsnModuleRef {
    moduleName: 'ExternalModule';
    exports: {
        ExternalModuleProvider: any;
    };
    providers: {
        ExternalModuleProvider: ExternalModuleProviderRef;
    };
}

export interface TestDependencyTree extends FsnModuleRef {
    moduleName: 'MainModule';
    exports: {};
    imports: {
        ExternalModule: ExternalModuleRef;
    };
    providers: {
        RootProvider: RootProviderRef;
        ModuleProvider: ModuleProviderRef;
    };
}
