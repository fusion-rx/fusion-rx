import { Subscription, isObservable } from 'rxjs';
import { BASE_ROUTE, TEMPLATE, TEMPLATE_URL } from '../di/route';
import { FsnInjectableRef, FsnRouteRef } from './refs';

export const routeSubscriptions = new Subscription();

export const initRoute = (injectable: FsnInjectableRef) => {
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

    Object.values(injectable.instance).forEach((value) => {
        if (isObservable(value)) {
            routeSubscriptions.add(value.subscribe());
        }
    });

    return route;
};
