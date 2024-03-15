import { Injectable } from '@fusion-rx/core';
import { ExpressService } from '@fusion-rx/common';

@Injectable()
export class AppRoutes {
    constructor(private _expressService: ExpressService) {}

    registerHelloWorld = this._expressService.get('/hello-world-2').subscribe({
        next: (handlers) => {
            handlers.res.status(200).send({
                response: 'This is also so awesome!'
            });
        }
    });
}
