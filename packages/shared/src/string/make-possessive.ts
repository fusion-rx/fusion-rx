export function makePossessive(text: string) {
    return text + (text.endsWith('s') ? `'` : `'s`);
}
