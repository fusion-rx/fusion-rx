export const deepCopy = <T = any>(item: T): T =>
    JSON.parse(JSON.stringify(item));
