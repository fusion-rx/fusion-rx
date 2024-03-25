/**
 * Get the day-of-the-month of the Sunday of the current week.
 * @returns The day-of-the-month of the Sunday of the current week
 * @deprecated Create a TzDate instead
 */
export const firstDateOfWeek = () => {
    const curr = new Date();
    new Date(curr.setDate(curr.getDate() - curr.getDay())).getDate();
};
