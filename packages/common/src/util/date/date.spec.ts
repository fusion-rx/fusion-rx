import { firstDayOfWeek } from './first-day-of-week';
import { lastDayOfMonth } from './last-day-of-month';
import { lastDayOfPreviousMonth } from './last-day-of-previous-month';

describe('date', () => {
    test('Can get last day of a month.', () => {
        expect(lastDayOfMonth(2024, 0)).toEqual(31);
    });

    test('Can get last day of previous month.', () => {
        expect(lastDayOfPreviousMonth(2024, 1)).toEqual(31);
    });

    test('Can get the first day of the week.', () => {
        expect(firstDayOfWeek(2024, 0)).toEqual(1);
    });
});
