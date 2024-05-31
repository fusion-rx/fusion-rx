import { Route, Router } from '@fusion-rx/core';

@Router({
    basePath: 'app'
})
export class AppRoutes {
    constructor() {}

    @Route({
        method: 'get'
    })
    testRoute(): string {
        return 'this is also awesome!';
    }
}
