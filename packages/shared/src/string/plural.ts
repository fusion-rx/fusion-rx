export function plural(text: string, count: number) {
    if (count > 1 && !text.endsWith('s')) {
        return text + 's';
    } else {
        return text;
    }
}
