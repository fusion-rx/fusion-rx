import { FactoryProvider } from '../../di';
import { Type } from '../../interface';

export declare type FsnModuleRef = {
    moduleName: string;
    exports: Record<string, any>;
    imports: Record<string, FsnModuleRef>;
    providers: Record<string, FsnInjectableRef>;
};

export declare type FsnInjectableRef = {
    providerName: string;
    providedIn: 'root' | 'module';
    injected: string[];
    /** Providers injected using @Inject decorator */
    dynamicInjections: any[];
    reference: Type<any> | FactoryProvider;
    instance?: any;
};

export declare type FsnRouteRef = FsnInjectableRef & {
    baseUrl: string;
    templateUrl?: string;
    template?: string;
};
