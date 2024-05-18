import { FsnModule, ModuleWithProviders } from '@fusion-rx/core';
import { RouteGuard, Router } from './router.js';

@FsnModule({})
export class RouterModule {
    static forRoot(options: {
        basePath?: string;
        guard?: RouteGuard;
    }): ModuleWithProviders<RouterModule> {
        const providers = [];
        if (options.basePath) {
            providers.push({
                provide: 'BASE_PATH',
                useValue: options.basePath
            });
        }
        if (options.guard) {
            providers.push({
                provide: 'ROUTE_GUARD',
                useValue: options.guard
            });
        }
        return {
            fsnModule: RouterModule,
            providers: [Router, ...providers],
            exports: [Router]
        };
    }
}
