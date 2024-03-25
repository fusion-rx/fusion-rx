import { Route } from '@fusion-rx/core';
import { ExpressService } from '@fusion-rx/common';

@Route({
    template: `{
        "hello-world": {}
    }`
})
export class AppRoutes {
    constructor(private _expressService: ExpressService) {}

    registerHelloWorld = this._expressService.get('/hello-world-2', () => ({
        response: 'This is also awesome'
    }));
}
