export const isParsableBoolean = (val: any): boolean =>
    val !== undefined && val !== null && (val === 'true' || val === 'false');
