import { FsnModule, ModuleWithProviders } from '@fusion-rx/core';
import { RouteGuard, Router } from './router.js';

@FsnModule({})
export class RouterModule {
    static forRoot(options: {
        basePath?: string;
        guard?: RouteGuard;
    }): ModuleWithProviders<RouterModule> {
        const providers = [];
        providers.push({
            provide: 'BASE_PATH',
            useValue: options.basePath ?? undefined
        });
        providers.push({
            provide: 'ROUTE_GUARD',
            useValue: options.guard ?? undefined
        });
        return {
            fsnModule: RouterModule,
            providers: [...providers, Router],
            exports: [Router]
        };
    }
}
