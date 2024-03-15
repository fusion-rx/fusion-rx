import { isDate } from '../type';

/**
 * Get the number of days in `month`.
 * @param date Either a date or an object that holds the year
 * and the month index
 * @returns The number of days in `date`
 * @deprecated Create a TzDate instead
 */
export function daysInMonth(
    date:
        | Date
        | {
              year: number;
              monthIndex: number;
          }
) {
    if (isDate(date))
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return new Date(date.year, date.monthIndex + 1, 0).getDate();
}
