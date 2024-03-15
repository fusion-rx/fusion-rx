import { isNullable } from '../type';
import { forEach } from './for-each-key';

export const filterNullValues = <T extends object>(val: T) => {
    forEach(val, (v, key) => {
        if (isNullable(v)) {
            delete val[key];
        }
    });

    return val;
};
