import { DateTz, isDateTZ } from './tz-date';

describe('tz-date', () => {
    let cetDate: DateTz;
    let cstDate: DateTz;

    let cetDateString = '2024-06-15T13:30:00.000';
    let cstDateString = '2024-06-15T06:30:00.000';
    let utcString = '2024-06-15T12:30:00.000';

    beforeEach(() => {
        cetDate = new DateTz(cetDateString, {
            hours: 1,
            minutes: 0
        });
        cstDate = new DateTz(cstDateString, {
            hours: -6,
            minutes: 0
        });
    });

    test('Can init empty Date', () => {
        const date = new DateTz();
        expect(date.isValid()).toEqual(true);
    });

    test('Can init from UTC string.', () => {
        const tzDatePos = new DateTz('2024-02-05T00:00:00.000', {
            hours: -6,
            minutes: 0
        });
        const parsed = tzDatePos.parseUTCString('2024-02-05T00:00:00.000');
        expect(parsed.getHours()).toEqual(18);
        expect(parsed.getUTCHours()).toEqual(0);
        expect(parsed.getDate()).toEqual(4);
        expect(parsed.getUTCDate()).toEqual(5);
    });

    test('Can identify if a date is valid', () => {
        expect(cetDate.isValid()).toEqual(true);
    });

    test('Can identify if an object is a DateTz', () => {
        const date = new DateTz();
        expect(isDateTZ(date)).toEqual(true);
        const jsDate = new Date();
        expect(isDateTZ(jsDate)).toEqual(false);
    });

    test('Can return locale and ISO string', () => {
        expect(cetDate.toLocalString()).toEqual(cetDateString);
        expect(cetDate.toUTCString()).toEqual(utcString);
        expect(cstDate.toLocalString()).toEqual(cstDateString);
        expect(cstDate.toUTCString()).toEqual(utcString);
    });

    test('Can add and subtract seconds', () => {
        // Starting value: 13hr 30min 0sec

        cetDate.add(15, 'seconds');
        expect(cetDate.getMinutes()).toEqual(30);
        expect(cetDate.getSeconds()).toEqual(15);

        cetDate.add(60, 'seconds');
        expect(cetDate.getMinutes()).toEqual(31);
        expect(cetDate.getSeconds()).toEqual(15);

        cetDate.subtract(60, 'seconds');
        expect(cetDate.getMinutes()).toEqual(30);
        expect(cetDate.getSeconds()).toEqual(15);

        cetDate.subtract(15, 'seconds');
        expect(cetDate.getMinutes()).toEqual(30);
        expect(cetDate.getSeconds()).toEqual(0);
    });

    test('Can add and subtract minutes', () => {
        // Starting value: 13hr 30min 0sec

        cetDate.add(15, 'minutes');
        expect(cetDate.getHours()).toEqual(13);
        expect(cetDate.getMinutes()).toEqual(45);

        cetDate.add(60, 'minutes');
        expect(cetDate.getHours()).toEqual(14);
        expect(cetDate.getMinutes()).toEqual(45);

        cetDate.subtract(60, 'minutes');
        expect(cetDate.getHours()).toEqual(13);
        expect(cetDate.getMinutes()).toEqual(45);

        cetDate.subtract(15, 'minutes');
        expect(cetDate.getHours()).toEqual(13);
        expect(cetDate.getMinutes()).toEqual(30);
    });

    test('Can add and subtract hours', () => {
        // Starting value: 15th 13hr

        cetDate.add(6, 'hours');
        expect(cetDate.getDate()).toEqual(15);
        expect(cetDate.getHours()).toEqual(19);

        cetDate.add(24, 'hours');
        expect(cetDate.getDate()).toEqual(16);
        expect(cetDate.getHours()).toEqual(19);

        cetDate.subtract(24, 'hours');
        expect(cetDate.getDate()).toEqual(15);
        expect(cetDate.getHours()).toEqual(19);

        cetDate.subtract(6, 'hours');
        expect(cetDate.getDate()).toEqual(15);
        expect(cetDate.getHours()).toEqual(13);
    });

    test('Can add days', () => {
        // Starting value: 5/15
        // July has 31 days

        cetDate.add(2, 'days');
        expect(cetDate.getMonth()).toEqual(5);
        expect(cetDate.getDate()).toEqual(17);

        cetDate.add(30, 'days');
        expect(cetDate.getMonth()).toEqual(6);
        expect(cetDate.getDate()).toEqual(17);

        cetDate.subtract(30, 'days');
        expect(cetDate.getMonth()).toEqual(5);
        expect(cetDate.getDate()).toEqual(17);

        cetDate.subtract(2, 'days');
        expect(cetDate.getMonth()).toEqual(5);
        expect(cetDate.getDate()).toEqual(15);
    });

    test('Can add months', () => {
        // Starting value: 2024/5/15
        // July has 31 days

        cetDate.add(2, 'months');
        expect(cetDate.getFullYear()).toEqual(2024);
        expect(cetDate.getMonth()).toEqual(7);

        cetDate.add(12, 'months');
        expect(cetDate.getFullYear()).toEqual(2025);
        expect(cetDate.getMonth()).toEqual(7);

        cetDate.subtract(12, 'months');
        expect(cetDate.getFullYear()).toEqual(2024);
        expect(cetDate.getMonth()).toEqual(7);

        cetDate.subtract(2, 'months');
        expect(cetDate.getFullYear()).toEqual(2024);
        expect(cetDate.getMonth()).toEqual(5);
    });

    test('Can evaluate equivalency', () => {
        const before = new DateTz('2024-06-15T13:30:00.000', {
            hours: 1,
            minutes: 0
        });
        const after = new DateTz('2024-06-15T13:45:00.000', {
            hours: 1,
            minutes: 0
        });
        const after2 = new DateTz('2024-06-15T13:30:00.010', {
            hours: 1,
            minutes: 0
        });

        expect(before.isBefore(after)).toEqual(true);
        expect(before.isBefore(after2)).toEqual(true);
        expect(before.isAfter(after)).toEqual(false);
        expect(before.isAfter(after2)).toEqual(false);
        expect(after.isBefore(before)).toEqual(false);
        expect(after2.isBefore(before)).toEqual(false);
        expect(after.isAfter(before)).toEqual(true);
        expect(after2.isAfter(before)).toEqual(true);
        expect(before.isEqual(before)).toEqual(true);
        expect(after.isEqual(after)).toEqual(true);
        expect(after2.isEqual(after2)).toEqual(true);
    });
});
