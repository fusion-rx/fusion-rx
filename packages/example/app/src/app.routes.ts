import { Route, Router } from '@fusion-rx/core';

@Router({
    basePath: 'app'
})
export class AppRoutes {
    constructor() {}

    @Route({
        method: 'get',
        path: 'info'
    })
    testRoute() {
        return {
            name: '@fusion-rx/example',
            version: '0.1.0',
            private: true,
            description: 'An example Fusion application.',
            author: 'Alexander Porrello',
            license: 'MIT',
            type: 'module'
        };
    }
}
