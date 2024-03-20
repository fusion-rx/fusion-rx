const makeTwoDigits = (val: number): string => {
    if (val < 10) return '0' + val;
    return val + '';
};

/**
 * Creates a time string for logging.
 * @returns The current date/time in dd/mm/yyyy, HH:MM A format.
 */
export const logDateTime = (): string => {
    const date = new Date();
    const amPm = date.getHours() > 12 ? ' PM' : ' AM';
    return [
        [
            makeTwoDigits(date.getMonth() + 1),
            makeTwoDigits(date.getDate()),
            date.getFullYear()
        ].join('/'),
        [
            makeTwoDigits(date.getHours() % 12),
            makeTwoDigits(date.getMinutes()),
            makeTwoDigits(date.getSeconds())
        ].join(':') + amPm
    ].join(', ');
};
