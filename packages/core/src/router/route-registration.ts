import chalk from 'chalk';
import { RouteGuard, evaluateGuard } from './route-guard.js';
import {
    RouteHandlerMetadataFacade,
    RouteProviderMetadataFacade,
    RouterMetadataFacade
} from './router-facade-interface.js';
import { HttpMethod, HttpStatusCode, ParamType } from './router-types.js';
import { Type } from '../public-api.js';
import { expressApp } from '../application/server.js';
import { Subscription, catchError, isObservable } from 'rxjs';
import { isNativeError, isPromise } from 'util/types';
import { extractProvidersFromReq } from './request-parser.js';
import { FsnRouterError, formatResponseError } from './router-error.js';

export declare type RegistrationOptions = {
    urlParams?: Record<string, ParamType>;
    queryParams?: Record<string, ParamType>;
    guard?: RouteGuard;
    args?: RouteProviderMetadataFacade[];
};

/**
 * Logs the details for registered routes.
 * @param method An http method type
 * @param path An http method path
 */
export const logRouteRegistration = (method: HttpMethod, path: string) => {
    const getMethodColor = () => {
        switch (method) {
            case 'delete':
                return chalk.bold.red(method.toUpperCase());
            case 'get':
                return chalk.bold.blue(method.toUpperCase() + '   ');
            case 'patch':
                return chalk.bold.yellow(method.toUpperCase() + ' ');
            case 'put':
                return chalk.bold.magenta(method.toUpperCase() + '   ');
            default:
                return chalk.bold.green(method.toUpperCase()) + '  ';
        }
    };
    console.log(chalk.green(`${getMethodColor()} ${chalk.gray('=>')} ${path}`));
};

const prependBasePath = (basePath: string, handlerPath: string) => {
    const path = (() => {
        if (handlerPath.startsWith('/')) return basePath + handlerPath;
        if (handlerPath.length === 0) return basePath + '';
        return basePath + '/' + handlerPath;
    })();

    if (!path.startsWith('/')) return '/' + path;
    return path;
};

/**
 * @param method An incoming request method
 * @param path The route of an incoming request
 * @param handle Provieds logic for incoming requests
 * @param options Options used when handling the incoming request
 */
export const registerRouteHandler = (
    router: Type<RouterMetadataFacade>,
    route: RouteHandlerMetadataFacade,
    handlerName: string
) => {
    route.path = prependBasePath(router.prototype.basePath, route.path);
    logRouteRegistration(route.method, route.path);

    expressApp[route.method](route.path, async (req, res) => {
        if (!router.prototype.instance) {
            throw new Error('Failed to init instance');
        }

        try {
            let subscription: Subscription;

            res.on('close', () => {
                if (subscription) subscription.unsubscribe();
            });

            // If there is a global guard or a guard defined for this
            // handler, execute it.
            evaluateGuard(req, route.guard ?? router.prototype.guard);

            const args = extractProvidersFromReq(req, route.providers);
            const handlerRes = router.prototype.instance[handlerName](...args);

            if (isObservable(handlerRes)) {
                const response: any[] = [];

                subscription = handlerRes
                    .pipe(
                        catchError((err) => {
                            if (isNativeError(err)) {
                                if (err.message === 'no elements in sequence') {
                                    throw new FsnRouterError(
                                        'NoContent',
                                        'Message returned new project.'
                                    );
                                }
                            }

                            throw err;
                        })
                    )
                    .subscribe({
                        next: (val) => {
                            response.push(val);
                            console.log(val);
                        },
                        error: (error) => {
                            console.error(error);
                            const formatted = formatResponseError(error);
                            res.status(formatted.status).json(formatted);
                        },
                        complete: () => {
                            if (response.length === 0) {
                                res.status(HttpStatusCode.NoContent).send({
                                    code: HttpStatusCode.NoContent,
                                    message: 'No response for your query.'
                                });
                            } else if (response.length === 0) {
                                res.json(response[0]);
                            } else {
                                res.json(response);
                            }
                        }
                    });
            } else if (isPromise(handlerRes)) {
                handlerRes
                    .then((response) => {
                        if (response) {
                            res.json(response);
                        } else {
                            res.status(HttpStatusCode.NoContent).json({
                                status: HttpStatusCode.NoContent,
                                message: 'Respoonse returned no content.'
                            });
                        }
                    })
                    .catch((reason) => {
                        const formatted = formatResponseError(reason);
                        res.status(formatted.status).json(formatted);
                    });
            } else {
                if (handlerRes) res.json(handlerRes);
                else {
                    res.status(HttpStatusCode.NoContent).json({
                        status: HttpStatusCode.NoContent,
                        message: 'Respoonse returned no content.'
                    });
                }
            }
        } catch (error) {
            const formatted = formatResponseError(error);
            res.status(formatted.status).send(formatted);
            return;
        }
    });
};
