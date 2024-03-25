export const possessive = (val: string) =>
    val + val.endsWith('s') ? `'` : `'s`;
