import { FsnModule, ModuleWithProviders } from '@fusion-rx/core';

import { ExpressService } from './express.service';

@FsnModule({})
export class ExpressModule {
    static forRoot(options?: {
        port?: number;
        host?: string;
    }): ModuleWithProviders<ExpressModule> {
        return {
            fsnModule: ExpressModule,
            providers: [
                {
                    provide: 'EXPRESS_PORT',
                    useValue: options?.port ?? 3005
                },
                {
                    provide: 'EXPRESS_HOST',
                    useValue: options?.host ?? '0.0.0.0'
                },
                ExpressService
            ]
        };
    }
}
