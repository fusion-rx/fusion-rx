import { getParseType } from './get-parse-type';

export function parse<T>(val: string): T;

export function parse(val: string): any {
    switch (getParseType(val)) {
        case 'boolean':
            return val === 'true';
        case 'float':
            return Number.parseFloat(val);
        case 'integer':
            return Number.parseInt(val);
        case 'date':
            return new Date(val);
        case 'object':
            return JSON.parse(val);
        case 'string':
            return val;
    }
}
