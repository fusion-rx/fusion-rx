export const isParsableInteger = (val: any): boolean =>
    new RegExp('^[1-9]{1,}$', 'g').test(val);
