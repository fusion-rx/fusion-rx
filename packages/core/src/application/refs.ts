import { FactoryProvider } from '../di';
import { Class } from '../interface';

export declare type FsnModuleRef = {
    moduleName: string;
    exports: Record<string, any>;
    imports: Record<string, FsnModuleRef>;
    providers: Record<string, FsnProvidereRef>;
};

export declare type FsnProvidereRef = {
    providerName: string;
    providedIn: 'root' | 'module';
    injected: string[];
    /** Providers injected using @Inject decorator */
    dynamicInjections: any[];
    reference: Class<any> | FactoryProvider;
    instance?: any;
};

export declare type FsnRouteRef = {
    routeName: string;
    injected: string[];
    reference: Class<any>;
    baseRoute?: string;
    instance?: any;
};
