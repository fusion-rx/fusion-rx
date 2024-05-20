// @ts-check
import { isRegExp } from 'util/types';
import { characters, quotes, relationships } from './data.js';

/**
 * Loads a markdown-formatted database.
 * @param data A formatted md table
 */
export const load_db = (data: string): any[] => {
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

const tables = {
    characters: load_db(characters),
    quotes: load_db(quotes),
    relationships: load_db(relationships)
};

declare type TableName = keyof typeof tables;
declare type Table<T extends TableName> = (typeof tables)[T];
declare type Comparator =
    | '='
    | '!='
    | '>'
    | '<'
    | '!in'
    | 'in'
    | 'null'
    | '!null'
    | 'like'
    | '!like';
declare type Unpacked<T> = T extends (infer U)[] ? U : T;

declare type Where = {
    comparator: Comparator;
    value: any;
    column: string;
    and?: Where;
    or?: Where;
};

/**
 * @param val
 * @returns
 */
export const select = <
    T_nm extends keyof typeof tables,
    T extends (typeof tables)[T_nm],
    K extends Unpacked<T>
>() => {
    // @ts-ignore
    let this_table: T[];
    let this_where: Where;

    // To-do handle ors
    const compare$ = () => {
        const column = this_where.column;
        const comparator = this_where.comparator;
        let val = this_where.value;

        if (isRegExp(val)) {
            return this_table.filter((row: any) => {
                const test = val.test(row[column]);
                return comparator === 'like' ? test : !test;
            });
        }

        return this_table.filter((row: any) => {
            switch (comparator) {
                case '=':
                    return row[column] === val;
                case '>':
                    return row[column] > val;
                case '<':
                    return row[column] < val;
                case '!=':
                    return row[column] !== val;
                case 'null':
                    return row[column] === null;
                case '!null':
                    return row[column] !== null;
                case 'in':
                    val = Array.isArray(val) ? val : [val];
                    return val.includes(row[column]);
                case '!in':
                    val = Array.isArray(val) ? val : [val];
                    return !val.includes(row[column]);
                default:
                    return false;
            }
        });
    };

    const andOr$ = (lastWhere: Where) => {
        const _where = (col: K, andOr: 'and' | 'or') =>
            where$(col, {
                ao: andOr,
                where: lastWhere
            });

        return {
            and: () => ({
                where: (column: K) => _where(column, 'and')
            }),
            or: () => ({
                where: (column: K) => _where(column, 'or')
            }),
            end: () => compare$()
        };
    };

    function where$(
        column: K,
        lastWhere?: {
            where: Where;
            ao: 'and' | 'or';
        }
    ) {
        const where$ = (
            column: K,
            comparator: Comparator,
            value?: any
        ): Where => ({
            column,
            comparator,
            value
        });

        const chain$ = (comparator: Comparator, value?: any) => {
            const where = where$(column, comparator, value);
            this_where ??= where;
            if (lastWhere) lastWhere.where[lastWhere.ao] = where;
            return andOr$(where);
        };

        return {
            equals: (val: any) => chain$('=', val),
            not_equals: (val: any) => chain$('!=', val),
            is_null: () => chain$('null'),
            is_not_null: () => chain$('!null'),
            greater_than: (val: any) => chain$('>', val),
            less_than: (val: any) => chain$('<', val),
            in: (val: any) => chain$('in', val),
            not_in: (val: any) => chain$('!in', val),
            like: (val: RegExp) => chain$('like', val),
            not_like: (val: RegExp) => chain$('!like', val)
        };
    }

    return {
        from: (table: T_nm) => {
            this_table = tables[table];

            return {
                where: (column: K) => where$(column),
                end: () => compare$()
            };
        }
    };
};

console.log(
    select()
        .from('characters')
        .where('pk_name')
        .equals('Jerry Seinfeld')
        .or()
        .where('pk_name')
        .equals('George Costanza')
        .end()
);
