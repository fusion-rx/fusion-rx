export const isParsableDate = (str: any): boolean => !isNaN(Date.parse(str));
