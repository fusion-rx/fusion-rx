import { Type } from '../interface/type.js';
import { RouterMetadataFacade } from '../router/router-facade-interface.js';
import { FsnError } from '../error/error.js';
import { ErrorCode } from '../error/error-codes.js';
import { registerRouteHandler } from '../router/route-registration.js';

/**
 * Registers a classmember decorated with `@Route`
 * @param router A reflected router
 * @param route Provider options for a classmember decorated with `@Route`
 * @param handlerName The name of the classmember decorated with `@Route`
 */
export const bootstrapRouter = (router: Type<RouterMetadataFacade>) => {
    if (!router.prototype.instance) {
        throw new FsnError(
            ErrorCode.INVALID_ROUTE,
            `Router ${router.prototype.token} was never initialized.`
        );
    }

    if (!router.prototype.handlers) {
        console.warn(`No routes registered in ${router.prototype.token}.`);
        return;
    }

    Object.entries(router.prototype.handlers).forEach((entry) => {
        const key = entry[0];
        const val = entry[1];

        registerRouteHandler(router, val, key);
    });
};
