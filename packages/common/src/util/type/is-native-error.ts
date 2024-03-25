export const isNativeError = (e: any): e is Error =>
    e !== undefined &&
    e !== null &&
    typeof e === 'object' &&
    'message' in e &&
    'name' in e;
