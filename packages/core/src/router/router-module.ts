import {
    FsnModule,
    Injectable,
    ModuleWithProviders
} from '../di/public-api.js';
import { FsnRouter } from './fsn-router.js';
import { I } from '../application/bootstrap.js';
import { RouteGuard } from './route-guard.js';

@FsnModule({})
export class RouterModule {
    static forRoot(options: {
        basePath?: string;
        guard?: RouteGuard;
    }): ModuleWithProviders<RouterModule> {
        @Injectable()
        class iRouter {}

        (<I>iRouter).prototype.instance = new FsnRouter(
            options.basePath,
            options.guard
        );
        (<I>iRouter).prototype.token = 'Router';
        (<I>iRouter).prototype.providedIn = 'module';

        return {
            fsnModule: RouterModule,
            providers: [iRouter],
            exports: [iRouter]
        };
    }
}
