import { Type } from '../interface';
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
