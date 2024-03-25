import 'reflect-metadata';
import { getPropertyMetadata } from './get-metadata';

export const getFunctionParameters = (target: any, key: string | symbol) =>
    getPropertyMetadata('design:paramtypes', target, key, []).map(
        (val: any) => {
            return (val.toString() as string)
                .split(' ')[1]
                .replace('()', '')
                .toLowerCase();
        }
    );
