/**
 * Returns the last day in a given month.
 * @param fullYear A four-digit year
 * @param monthIndex A month index, where January is 0
 * @returns The last day of the given month (ex. `2024/0 = 31`)
 * @deprecated Create a TzDate instead
 */
export const lastDayOfMonth = (fullYear: number, monthIndex: number) =>
    new Date(fullYear, monthIndex + 1, 0).getDate();
