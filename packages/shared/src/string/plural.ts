/**
 * Pluralizes `word`.
 * @param word A word to pluralize
 * @param count The number of elements to which `text` refers
 * @returns The plural form of `word`, such as `car => cars`
 * or `bus => buses`
 *
 * @publicApi
 */
export const plural = (word: string, count: number) => {
    if (count === 1) return word;

    // The word already ends with `es`, such as `buses`,
    // so it's already plural.
    if (word.endsWith('es')) return word;

    // The word does not end with `s`, such as `car`
    if (!word.endsWith('s')) return word + 's';

    // The word ends with `s` such as `bus`, but does not end
    // with `es` so is not plural.
    if (word.endsWith('s')) return word + 'es';

    // @todo - are we missing any cases
    return word;
};
