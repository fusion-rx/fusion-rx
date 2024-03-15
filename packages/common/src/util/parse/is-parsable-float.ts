export const isParsableFloat = (val: any): boolean =>
    new RegExp('(^[1-9]{1,}).([1-9]{1,}$)', 'g').test(val);
