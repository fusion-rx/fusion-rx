import { BASE_ROUTE, TEMPLATE, TEMPLATE_URL } from '../di/route';
import { FsnInjectableRef, FsnRouteRef } from './refs';

export const processRoute = (injectable: FsnInjectableRef) => {
    const baseUrl = Reflect.getMetadata(BASE_ROUTE, injectable.reference);
    const templateUrl = Reflect.getMetadata(TEMPLATE_URL, injectable.reference);
    const template = Reflect.getMetadata(TEMPLATE, injectable.reference);

    const route: FsnRouteRef = {
        injected: injectable.injected,
        baseUrl,
        providedIn: 'module',
        providerName: injectable.providerName,
        reference: injectable.reference,
        instance: injectable.instance,
        template,
        templateUrl,
        dynamicInjections: injectable.dynamicInjections
    };

    console.log(route.template, route.templateUrl);

    return route;
};
