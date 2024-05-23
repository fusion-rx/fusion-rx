import { characters, quotes, relationships } from './data.js';

export declare type T_Relationships = {
    pk_relationship_index: number;
    'fk_name_a => characters.pk_name': string;
    'fk_name_b => characters.pk_name': string;
    relationship: string;
};

export declare type T_Quotes = {
    pk_quote_index: number;
    'fk_name => characters.pk_name': string;
    quote: string;
};

export declare type T_Characters = {
    pk_name: string;
    age: number;
    address: string | null;
    catchphrase: string;
};

/**
 * Loads a markdown-formatted database.
 * @param data A formatted md table
 */
export const load_db = <T extends T_Relationships | T_Quotes | T_Characters>(
    data: string
): T[] => {
    const rows = data
        .trim()
        .split(/\n/g)
        .map((row) =>
            row
                .trim()
                .split(/\|/g)
                .map((cell) => cell.trim())
        );

    const headers = rows.shift();

    if (!headers) return [];

    return rows.map((row) => {
        const formatted: any = {};

        headers.forEach((header, index) => {
            if (header.length > 0) {
                if (row[index] === 'null') return (formatted[header] = null);

                if (/^([0-9]{1,})$/.test(row[index]))
                    return (formatted[header] = Number.parseInt(row[index]));

                formatted[header] = row[index];
            }

            return;
        });

        return formatted;
    });
};

export const t_characters = load_db<T_Characters>(characters);
export const t_quotes = load_db<T_Quotes>(quotes);
export const t_relationships = load_db<T_Relationships>(relationships);
