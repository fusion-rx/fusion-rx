const isWrappedWithBraces = (val: string) =>
    val.startsWith('{') && val.endsWith('}');

const isWrappedWithBrackets = (val: string) =>
    val.startsWith('[') && val.endsWith(']');

export const isParsableJSON = (val: any): boolean =>
    val !== undefined &&
    val !== null &&
    typeof val === 'string' &&
    (isWrappedWithBraces(val) || isWrappedWithBrackets(val));
