/**
 * Returns the last day in the previous month.
 * @param fullYear A four-digit year
 * @param monthIndex A month index, where January is 0
 * @returns The last day of the previous month (ex. `2024/1 = 31`)
 * @deprecated Create a TzDate instead
 */
export const lastDayOfPreviousMonth = (fullYear: number, monthIndex: number) =>
    new Date(fullYear, monthIndex, 0).getDate();
