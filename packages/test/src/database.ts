import { isRegExp } from 'util/types';
import { Observable, of } from 'rxjs';

declare type ElementOf<T> = T extends Array<infer U> ? U : never;

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

declare type Where = {
    comparator?: Comparator;
    value: any;
    column: string;
    and?: Where;
    or?: Where;
};

declare type SelectFn<T extends object[]> = {
    where: (column: keyof ElementOf<T>) => WhereFn<T>;
    end: () => Observable<ElementOf<T>>;
};

declare type AndOrFn<T extends object[]> = {
    and: {
        where: (column: keyof ElementOf<T>) => WhereFn<T>;
    };
    or: {
        where: (column: keyof ElementOf<T>) => WhereFn<T>;
    };
    end: () => Observable<ElementOf<T>>;
};

declare type WhereFn<T extends object[]> = {
    equals: (val: any) => AndOrFn<T>;
    not_equals: (val: any) => AndOrFn<T>;
    is_null: () => AndOrFn<T>;
    is_not_null: (val: any) => AndOrFn<T>;
    greater_than: (val: any) => AndOrFn<T>;
    less_than: (val: any) => AndOrFn<T>;
    in: (val: any) => AndOrFn<T>;
    not_in: (val: any) => AndOrFn<T>;
    like: (val: RegExp) => AndOrFn<T>;
    not_like: (val: RegExp) => AndOrFn<T>;
};

/**
 * @param val
 * @returns
 */
const select = <T extends object[]>(
    this_table: T,
    columns: (keyof ElementOf<T>)[]
): SelectFn<T> => {
    let this_where: Where;

    const compare$ = (where?: Where) => {
        const results: boolean[] = [];

        const compare = (where: Where) => {
            this_table.forEach((row: any, index) => {
                if (!where) {
                    results[index] = true;
                    return;
                }

                const comparator = where?.comparator;
                const column = <any>where?.column;
                const val = where?.value;

                const result = (() => {
                    if (isRegExp(val)) {
                        const test = val.test(row[column]);
                        return comparator === 'like' ? test : !test;
                    }
                    if (comparator === 'in') {
                        const v: any[] = Array.isArray(val) ? val : [val];
                        return v.includes(row[column]);
                    }
                    if (comparator === '!in') {
                        const v: any[] = Array.isArray(val) ? val : [val];
                        return !v.includes(row[column]);
                    }
                    if (comparator === '=') return row[column] === val;
                    if (comparator === '>') return row[column] > val;
                    if (comparator === '<') return row[column] < val;
                    if (comparator === '!=') return row[column] !== val;
                    if (comparator === 'null') return row[column] === null;
                    if (comparator === '!null') return row[column] !== null;

                    return false;
                })();

                if (results.length > 0 && results[index] !== undefined) {
                    if (where.and) {
                        results[index] = result && results[index];
                    } else {
                        results[index] = result || results[index];
                    }
                } else {
                    results[index] = result;
                }
            });

            if (where.and) {
                compare(where.and);
            } else if (where.or) {
                compare(where.or);
            }
        };

        if (where) {
            compare(where);
        }

        // @ts-ignore
        let filtered: T = this_table.filter((row, index) => results[index]);

        if (columns.length > 0) {
            filtered = filtered.map((row) => {
                const toReturn = <ElementOf<T>>{};
                columns.forEach((column) => {
                    toReturn[<keyof typeof toReturn>column] =
                        row[<keyof typeof row>column];
                });
                return toReturn;
            }) as unknown as T;
        }

        return of(...filtered);
    };

    const andOr$ = (lastWhere: Where): AndOrFn<T> => {
        return {
            and: {
                where: (column: keyof ElementOf<T>) =>
                    where$(column, {
                        ao: 'and',
                        where: lastWhere
                    })
            },
            or: {
                where: (column: keyof ElementOf<T>) =>
                    where$(column, {
                        ao: 'and',
                        where: lastWhere
                    })
            },
            end: () => compare$(this_where)
        };
    };

    function where$(
        column: any,
        lastWhere?: {
            where: Where;
            ao: 'and' | 'or';
        }
    ): WhereFn<T> {
        const $where = (
            column: any,
            comparator: Comparator,
            value?: any
        ): Where => ({
            column,
            comparator,
            value
        });

        const chain$ = (comparator: Comparator, value?: any) => {
            const where = $where(column, comparator, value);
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
        where: (column: keyof ElementOf<T>) => where$(column),
        end: () => compare$()
    };
};

export const from = <T extends object[]>(table: T) => {
    return {
        select: (...columns: (keyof ElementOf<T>)[]) => {
            return select<T>(table, columns);
        }
    };
};
