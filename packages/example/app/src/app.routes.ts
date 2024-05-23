import { Router } from '@fusion-rx/core';
import { Injectable } from '@fusion-rx/core';

@Injectable()
export class AppRoutes {
    constructor(private _router: Router) {}

    testRoute = this._router.get('hello-world-2').register(() => ({
        response: 'this is also awesome!'
    }));
}
