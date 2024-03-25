import { ROUTES, CLASS_NAME, INJECTED_DEPS } from '../di';
import { BASE_ROUTE } from '../di/route';
import { Class } from '../interface';
import { getMetadata } from '../reflect';
import { FsnRouteRef } from './refs';

export const intitRoutes = (moduleRef: Class<any>) => {
    getMetadata<Class<any>[]>(ROUTES, moduleRef, []).forEach((ref) => {
        const routeName = Reflect.getMetadata(CLASS_NAME, ref);
        const injected = getMetadata<string[]>(INJECTED_DEPS, ref, []);
        const baseRoute = Reflect.getMetadata(BASE_ROUTE, ref);

        const route: FsnRouteRef = {
            routeName,
            injected,
            reference: ref,
            baseRoute
        };

        if (injected.length === 0) {
            route.instance = new ref();
        } else {
        }
    });
};
