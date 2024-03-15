import { isDate } from '../type';

/**
 * Get the first day-of-the-week in `date`.
 * @param date Either a date or an object that holds the year
 * and the month index
 * @returns The index of the first day of the month, where Sunday is 0
 * @deprecated Create a TzDate instead
 */
export const firstDayOfWeek = (
    date:
        | Date
        | {
              year: number;
              monthIndex: number;
          }
) => {
    if (isDate(date))
        return new Date(date.getFullYear(), date.getMonth()).getDate();
    return new Date(date.year, date.monthIndex + 1, 0);
};
