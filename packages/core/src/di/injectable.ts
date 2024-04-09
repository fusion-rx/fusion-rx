import { Type, isType } from '../interface';
import { CLASS_NAME, PROVIDED_IN } from '../reflection/metadata-keys';
import { reflectInjectable } from '../reflection/reflect-injectable';

export interface Injectable {
    providedIn: 'root' | 'module' | null;
}

/**
 * Injectable decorator and metadata.
 *
 * @publicApi
 */
export const Injectable = (opts?: Injectable) => (reference: Type<any>) =>
    reflectInjectable(reference, opts);

/**
 * Gets the metadata for injectables.
 * @param val A class reference
 * @returns Injectable metadata if it exists or undefined
 */
export const isInjectableRef = (val: any) => {
    try {
        if (isType(val)) {
            const name: string = Reflect.getMetadata(CLASS_NAME, val);
            const providedIn: 'module' | 'root' =
                Reflect.getMetadata(PROVIDED_IN, val) ?? 'module';
            if (name && providedIn) return true;
        }
    } catch {}

    return false;
};
