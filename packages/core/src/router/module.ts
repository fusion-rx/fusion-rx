import {
    FsnModule,
    Injectable,
    ModuleWithProviders
} from '../di/public-api.js';
import { RouteGuard, Router } from './router.js';
import { afterAppInit, listen } from '../public-api.js';
import { take } from 'rxjs';
import { I } from '../application/bootstrap.js';

@FsnModule({})
export class RouterModule {
    static forRoot(options: {
        basePath?: string;
        guard?: RouteGuard;
    }): ModuleWithProviders<RouterModule> {
        @Injectable()
        class iRouter {}

        (<I>iRouter).prototype.instance = new Router(
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

afterAppInit.pipe(take(1)).subscribe(() => {
    listen(process.env['hostname'], process.env['port']);
});
