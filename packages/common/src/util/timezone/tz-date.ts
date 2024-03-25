import { makeThreeDigits, padTwo } from '../format';
import { DateTimeFormatter } from './format-unit';

export declare type SysTimezone = {
    /** The difference between the timezone and UTC hours. */
    hours: number;
    /** The difference between the timezone and UTC minutes. */
    minutes: number;
};

export const isSysTimeObj = (val: any): val is SysTimezone =>
    val !== undefined &&
    val !== null &&
    typeof val === 'object' &&
    'hours' in val &&
    'minutes' in val;

declare type DateTzOptions = {
    /** If a timezone is parsed from a date string, set the local timezone to it. Defaults to false. */
    acceptParsedTimezone: boolean;
    /** If a date string is provided, treat it as a local string. Defaults to false. */
    parsedDateAsLocal: boolean;
};

export declare type TzUnitDay = 'D' | 'day' | 'days';
export declare type TzUnitDate = 'd' | 'date' | 'dates';
export declare type TzUnitMonth = 'M' | 'month' | 'months';
export declare type TzUnitYear = 'y' | 'year' | 'years';
export declare type TzUnitHour = 'h' | 'hour' | 'hours';
export declare type TzUnitMinute = 'm' | 'minute' | 'minutes';
export declare type TzUnitSecond = 's' | 'second' | 'seconds';
export declare type TzUnitMs = 'ms' | 'millisecond' | 'milliseconds';
export declare type TzUnitWeek = 'w' | 'week' | 'weeks';

export declare type TzUnit =
    | TzUnitDate
    | TzUnitDay
    | TzUnitMonth
    | TzUnitYear
    | TzUnitHour
    | TzUnitMinute
    | TzUnitSecond
    | TzUnitMs
    | TzUnitWeek;

const monthsShort = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

const monthLong = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export function parseDate(dateString: string): {
    date: Date;
    isUTC: boolean;
    timezone: SysTimezone;
} {
    let timezone: SysTimezone = {
        hours: 0,
        minutes: 0
    };

    dateString = dateString.trim();

    let isUTC = false;

    const zIndex = dateString.indexOf('Z');
    const plusIndex = dateString.indexOf('+');

    if (zIndex > -1) {
        isUTC = true;
        dateString = dateString.substring(0, zIndex);
    } else if (plusIndex > -1) {
        const offset = dateString.substring(plusIndex);
        const colonIndex = offset.indexOf(':');

        if (colonIndex > -1) {
            timezone.hours = Number(offset.substring(1, colonIndex));
            timezone.minutes = Number(offset.substring(colonIndex));
        } else {
            timezone.hours = Number(offset.substring(1, 3));
            timezone.minutes = Number(offset.substring(3, 4));
        }

        dateString = dateString.substring(0, plusIndex);
    }

    return {
        date: new Date(dateString),
        isUTC,
        timezone
    };
}

const getSystemTimezone = (): SysTimezone => {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.floor(offset / 60);
    const minutes = Math.floor(offset - hours);

    return {
        hours,
        minutes
    };
};

export const isDateTZ = (val: any): val is DateTz =>
    typeof val === 'object' && '_utcDate' in val;

/**
 * Set with {@link DateTz.setGlobalTimezone}. Defaults
 * to system time.
 */
let globalTimezone = getSystemTimezone();

/**
 * Set to true in {@link DateTz} when the {@link DateTz.setGlobalTimezone}
 * method is called.
 */
let globalTimezoneSet = false;

/**
 * We don't want to inindate the user with warnings, so keep track of
 * when it's been logged so we only log it once.
 */
let loggedTimezoneWarning = false;

export class DateTz extends Date {
    public static setGlobalTimezone(timezone: SysTimezone) {
        globalTimezone = timezone;
        globalTimezoneSet = true;
    }

    /**
     * The timezone local to this date. If null,
     * defaults to {@link globalTimezone}.
     */
    private _timezone?: SysTimezone;

    constructor(
        date: Date | string = new Date(),
        timezoneOrOpts:
            | SysTimezone
            | Partial<DateTzOptions>
            | (SysTimezone & Partial<DateTzOptions>) = {
            acceptParsedTimezone: false,
            parsedDateAsLocal: false
        }
    ) {
        // Initialize this date with the first argument to satisfy extends
        super(date);

        let timezone: SysTimezone | undefined;

        // Initialize the options with the default values
        let acceptParsedTimezone = false;
        let parsedDateAsLocal = false;

        // Init acceptParsedTimezone value if it is in the options
        if ('acceptParsedTimezone' in timezoneOrOpts) {
            acceptParsedTimezone = timezoneOrOpts.acceptParsedTimezone ?? false;
        }

        // Init parsedDateAsLocal value if it is in the options
        if ('parsedDateAsLocal' in timezoneOrOpts) {
            parsedDateAsLocal = timezoneOrOpts.parsedDateAsLocal ?? false;
        }

        // If options includes hours, it also must includes minutes,
        // per the signature
        if ('hours' in timezoneOrOpts) {
            timezone = {
                hours: timezoneOrOpts.hours,
                minutes: timezoneOrOpts.minutes
            };
        }

        // If the first argument is a date, parse it
        if (typeof date === 'string') {
            this._parse(date, acceptParsedTimezone, parsedDateAsLocal);
        }

        // If (1) a timezone wasn't passed as an argument in the constructor,
        // or (2) a timezone wasn't parsed from the date string,
        // warn the user that we're defaulting the global timezone,
        // which is initialized with the system time.
        if (!timezone && !globalTimezoneSet && !loggedTimezoneWarning) {
            console.warn(
                'Warning: No timezone was set in TzDate constructor ' +
                    'and no global timezone is set. ' +
                    'Defaulting to system timezone, which has an offset of ' +
                    `${new Date().getTimezoneOffset()} minutes. ` +
                    'To set a global timezone, call TzDate.setGlobalTimezone()'
            );
            // Mark logged as true so we don't inundate the user with logs
            loggedTimezoneWarning = true;
        } else if (timezone) {
            // Otherwise, initialize this timezone.
            this.setTimezone(timezone);
        }
    }

    public get timezone(): SysTimezone {
        return this._timezone ?? globalTimezone;
    }

    /**
     * Sets the timezone used by this date's UTC date.
     * @param tz A timezone
     */
    public setTimezone(tz: SysTimezone) {
        this._timezone = tz;
        return this;
    }

    /**
     * Evaluates whether this represents a valid date.
     * @returns True if this represents a valid date;
     * otherwise, false
     */
    public isValid(): boolean {
        return !isNaN(this.getHours());
    }

    public isBefore(date: DateTz | Date) {
        if (this.getFullYear() > date.getFullYear()) return false;
        if (this.getFullYear() < date.getFullYear()) return true;
        if (this.getMonth() > date.getMonth()) return false;
        if (this.getMonth() < date.getMonth()) return true;
        if (this.getDate() > date.getDate()) return false;
        if (this.getDate() < date.getDate()) return true;
        if (this.getHours() > date.getHours()) return false;
        if (this.getHours() < date.getHours()) return true;
        if (this.getMinutes() > date.getMinutes()) return false;
        if (this.getMinutes() < date.getMinutes()) return true;
        if (this.getSeconds() > date.getSeconds()) return false;
        if (this.getSeconds() < date.getSeconds()) return true;
        if (this.getMilliseconds() > date.getMilliseconds()) return false;
        if (this.getMilliseconds() < date.getMilliseconds()) return true;

        return false;
    }

    public isAfter(date: DateTz | Date) {
        if (this.getFullYear() > date.getFullYear()) return true;
        if (this.getFullYear() < date.getFullYear()) return false;
        if (this.getMonth() > date.getMonth()) return true;
        if (this.getMonth() < date.getMonth()) return false;
        if (this.getDate() > date.getDate()) return true;
        if (this.getDate() < date.getDate()) return false;
        if (this.getHours() > date.getHours()) return true;
        if (this.getHours() < date.getHours()) return false;
        if (this.getMinutes() > date.getMinutes()) return true;
        if (this.getMinutes() < date.getMinutes()) return false;
        if (this.getSeconds() > date.getSeconds()) return true;
        if (this.getSeconds() < date.getSeconds()) return false;
        if (this.getMilliseconds() > date.getMilliseconds()) return true;

        return false;
    }

    public isEqual(date: DateTz | Date) {
        if (this.getFullYear() !== date.getFullYear()) return false;
        if (this.getMonth() !== date.getMonth()) return false;
        if (this.getDate() !== date.getDate()) return false;
        if (this.getHours() !== date.getHours()) return false;
        if (this.getMinutes() !== date.getMinutes()) return false;
        if (this.getSeconds() !== date.getSeconds()) return false;

        return true;
    }

    /**
     * Creates a copy of this date.
     * @returns A date whose properties match this date.
     */
    public clone() {
        return new DateTz(
            new Date(
                this.getFullYear(),
                this.getMonth(),
                this.getDate(),
                this.getHours(),
                this.getMinutes(),
                this.getSeconds(),
                this.getMilliseconds()
            ),
            this._timezone
        );
    }

    /**
     * Get the first day of the month of the current week.
     * @returns The first day of the month of the current week
     */
    public getFirstDateOfWeek() {
        const curr = new Date(this);
        return new Date(curr.setDate(curr.getDate() - curr.getDay())).getDate();
    }

    /**
     * Get the first day of the week, where Sunday is 0.
     * @returns The first day of the week
     */
    public getFirstDayOfWeek() {
        return new Date(this.getFullYear(), this.getMonth() + 1, 0);
    }

    /**
     * Get the last day of the month of the current month.
     * @returns The last day of the month of the current month
     */
    public getLastDayOfMonth() {
        return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
    }

    /**
     * Returns the current date with its time set to midnight.
     * @returns This date cloned, with its time set to midnight.
     */
    public getMidnight() {
        const midnight = this.clone().setHours(0, 0, 0, 0);
        return midnight;
    }

    public setFullDate(
        year = this.getFullYear(),
        month = this.getMonth(),
        date = this.getDate(),
        hours = this.getHours(),
        min = this.getMinutes(),
        sec = this.getSeconds(),
        ms = this.getMilliseconds()
    ): this {
        this.setFullYear(year, month, date);
        this.setHours(hours, min, sec, ms);
        return this;
    }

    /**
     * Formats this date as a local string
     * @returns A date string representing this date's local time in
     * `YYYY-MM-DDTHH:mm:ss.SSS` format.
     */
    public toLocalString(includeMS = true) {
        const ms = includeMS
            ? `.${makeThreeDigits(this.getUTCMilliseconds())}`
            : '';

        return (
            `${this.getFullYear()}-${padTwo(this.getMonth() + 1)}-${padTwo(this.getDate())}T` +
            `${padTwo(this.getHours())}:${padTwo(this.getMinutes())}:${padTwo(this.getSeconds())}${ms}`
        );
    }

    /**
     * Formats this date as a UTC string
     * @returns A date string representing this date's UTC time in
     * `YYYY-MM-DDTHH:mm:ss.SSS` format.
     */
    override toUTCString(includeMS = true) {
        const ms = includeMS
            ? `.${makeThreeDigits(this.getUTCMilliseconds())}`
            : '';

        return (
            `${this.getUTCFullYear()}-${padTwo(this.getUTCMonth() + 1)}-${padTwo(this.getUTCDate())}T` +
            `${padTwo(this.getUTCHours())}:${padTwo(this.getUTCMinutes())}:${padTwo(this.getUTCSeconds())}${ms}`
        );
    }

    /**
     * Formats this date as a UTC string
     * @returns An ISO string representation of this Date in
     * `YYYY-MM-DDTHH:mm:ss.SSSZ` format.
     */
    override toISOString(includeMS = true) {
        return this.toUTCString(includeMS) + 'Z';
    }

    /**
     * Parses a string representation of a date and updates this date
     * with the date parsed from `dateString`.
     * @param dateString A string representation of a date
     * @param updateTimezone Whether this timezone should be updated with
     * any timezone information within `dateString`
     * @note This function treates the string parsed from `dateString` as
     * a timestamp that has already been adjusted by the global timezone or
     * the timezone local to this date.
     */
    public parseLocalString(dateString: string, updateTimezone?: boolean) {
        return this._parse(dateString, updateTimezone ?? false, false);
    }

    /**
     * Parses a string representation of a date and updates this date
     * with the date parsed from `dateString`.
     * @param dateString A string representation of a date
     * @param updateTimezone Whether this timezone should be updated with
     * any timezone information within `dateString`
     * @note This function treates the string parsed from `dateString` as
     * a UTC timestamp, regardless of its timezone data. The values used to
     * update this date are adjusted based on the global timezone or the
     * timezone local to this date.
     */
    public parseUTCString(dateString: string, updateTimezone?: boolean) {
        return this._parse(dateString, updateTimezone ?? false, true);
    }

    /**
     * Internal method used to parse both UTC and local strings.
     * @param dateString A date representation of a string
     * @param updateTimezone Whether any timezone data parsed from `dateString`
     * should be used to update {@link _timezone}
     * @param parsedDateAsLocal If the inputted date string should be treated as a UTC date.
     */
    private _parse(
        dateString: string,
        updateTimezone: boolean,
        parsedDateAsLocal: boolean
    ) {
        const parsed = parseDate(dateString);

        if (updateTimezone && parsed.timezone) {
            this.setTimezone(parsed.timezone);
        }

        this.setFullYear(
            parsed.date.getFullYear(),
            parsed.date.getMonth(),
            parsed.date.getDate()
        );

        this.setHours(
            parsedDateAsLocal
                ? parsed.date.getHours()
                : parsed.date.getHours() + this.timezone.hours,
            parsedDateAsLocal
                ? parsed.date.getMinutes()
                : parsed.date.getMinutes() + this.timezone.minutes,
            parsed.date.getSeconds(),
            parsed.date.getMilliseconds()
        );

        return this;
    }

    /**
     * Formats this date's local date/time.
     * @param formatString A string representation of the
     * output format — see {@link DateTimeFormatter}
     * @returns A string representation of this date matching
     * the format of `formatString`
     */
    public format(formatString: string): string {
        return this._format(formatString, this);
    }

    /**
     * Formats this date's UTC date/time.
     * @param formatString A string representation of the
     * output format — see {@link DateTimeFormatter}
     * @returns A string representation of this date matching
     * the format of `formatString`
     */
    public formatUTC(formatString: string): string {
        return this._format(formatString, this._utcDate);
    }

    /**
     * The internal format method, used for formatting both
     * local and UTC dates.
     * @param formatString A string representation of the
     * output format — see {@link DateTimeFormatter}
     * @param date A JavaScript date to format
     * @returns A string representation of this date matching
     * the format of `formatString`
     */
    private _format(formatString: string, date: Date) {
        const replace = (formatter: DateTimeFormatter, replaceWith: any) => {
            formatString = formatString.replace(formatter, replaceWith);
        };

        const includes = (formatter: DateTimeFormatter) => {
            return formatString.includes(formatter);
        };

        // replace('DDD', date.getDay());
        // replace('DDDo', '');
        // replace('DDDD', '');
        // replace('DDDD', '');
        // replace('Q', '');
        // replace('Qo', '');
        // replace('w', '');
        // replace('wo', '');
        // replace('ww', padTwo());

        if (includes('A')) replace('A', this._amPm(date.getHours()));
        else if (includes('a'))
            replace('a', this._amPm(date.getHours()).toUpperCase());

        if (includes('hh')) replace('hh', padTwo(this._12h(date.getHours())));
        else if (includes('h')) replace('h', this._12h(date.getHours()));

        if (includes('mm')) replace('mm', padTwo(date.getMinutes()));
        else if (includes('m')) replace('m', date.getMinutes());

        if (includes('ss')) replace('ss', padTwo(date.getSeconds()));
        else if (includes('s')) replace('s', date.getSeconds());

        if (includes('DD')) replace('DD', padTwo(date.getDate()));
        else if (includes('Do')) replace('Do', this._stNd(date.getDate()));
        else if (includes('D')) replace('D', date.getDate());

        if (includes('HH')) replace('HH', padTwo(date.getHours()));
        else if (includes('H')) replace('H', date.getHours());

        if (includes('MMMM')) replace('MMMM', monthLong[date.getMonth()]);
        else if (includes('MMM')) replace('MMM', monthsShort[date.getMonth()]);
        else if (includes('MM')) replace('MM', padTwo(date.getMonth() + 1));
        else if (includes('M')) replace('M', date.getMonth() + 1);

        if (includes('YYYY')) replace('YYYY', this.getFullYear());
        else if (includes('YY'))
            replace('YY', `${this.getFullYear()}`.substring(2));

        if (includes('ZZ'))
            replace(
                'ZZ',
                `+${padTwo(this.timezone.hours)}:` +
                    `${padTwo(this.timezone.minutes)}`
            );
        else if (includes('Z'))
            replace(
                'Z',
                `+${padTwo(this.timezone.hours)}` +
                    `${padTwo(this.timezone.minutes)}`
            );

        return formatString;
    }

    /**
     * Appends `st`, `rd`, or `th`, depending on the value of `num`.
     * @param num A whole number
     * @returns `num` with `st`, `rd`, or `th` appended
     */
    private _stNd(num: Number): string {
        if (`${num}`.endsWith(`1`)) return num + 'st';
        if (`${num}`.endsWith(`2`) && num !== 12) return num + 'nd';
        if (`${num}`.endsWith(`3`) && num !== 13) return num + 'rd';
        return num + 'th';
    }

    /**
     * Evaluates if a 24-hour hour is in the AM or PM.
     * @param hour A number representing a 24-hour hour
     * @returns 'am' or 'pm'
     */
    private _amPm(hour: number): 'am' | 'pm' {
        return hour < 12 ? 'am' : 'pm';
    }

    /**
     * Modifies a 24-hour hour to be in 12-hour format.
     * @param hour A number representing a 24-hour hour
     * @returns `1` - `12`
     */
    private _12h(hour: number): number {
        hour = hour % 12;
        return hour ? hour : 12;
    }

    /**
     * Adds `amount` to `unit` in place. This method mutates this date
     * and returns a reference to this date.
     * @param amount A whole numeric value
     * @param unit A unit of time — See {@link TzUnit}
     */
    public add(amount: number, unit: TzUnit) {
        // Since most of these have a unique first character,
        // we can determine the unit to add by looking at it
        const u = unit.charAt(0);

        if (u === 's') return this.addSeconds(amount);
        if (u === 'h') return this.addHours(amount);
        if (u === 'y') return this.addYear(amount);
        if (u === 'd' || u === 'D') return this.addDate(amount);
        if (u === 'w') return this.addDate(amount * 7);
        if (u === 'q') return this.addMonth(amount * 3);
        // leave most "expensive" for last
        if (unit === 'minute' || unit === 'minutes' || unit === 'm')
            return this.addMinutes(amount);
        if (unit === 'M' || unit === 'month' || unit === 'months')
            return this.addMonth(amount);
        if (u === 'm') return this.addMilliseconds(amount);

        console.warn(`Formatting unit ${unit} not recognized/implemented.`);
        return this;
    }

    /**
     * Adds `amount` to year in place, mutating this date
     * and returning a reference to this date.
     * @param amount A numer representing the amount to be added
     * @returns A reference to this date
     */
    public addYear(amount: number) {
        this.setFullYear(this.getFullYear() + amount);
        return this;
    }

    /**
     * Adds `amount` to month in place, mutating this date
     * and returning a reference to this date.
     * @param amount A numer representing the amount to be added
     * @returns A reference to this date
     */
    public addMonth(amount: number) {
        this.setMonth(this.getMonth() + amount);
        return this;
    }

    /**
     * Adds `amount` to date in place, mutating this date
     * and returning a reference to this date.
     * @param amount A numer representing the amount to be added
     * @returns A reference to this date
     */
    public addDate(amount: number) {
        this.setDate(this.getDate() + amount);
        return this;
    }

    /**
     * Adds `amount` to hours in place, mutating this date
     * and returning a reference to this date.
     * @param amount A numer representing the amount to be added
     * @returns A reference to this date
     */
    public addHours(amount: number) {
        this.setHours(this.getHours() + amount);
        return this;
    }

    /**
     * Adds `amount` to minutes in place, mutating this date
     * and returning a reference to this date.
     * @param amount A numer representing the amount to be added
     * @returns A reference to this date
     */
    public addMinutes(amount: number) {
        this.setMinutes(this.getMinutes() + amount);
        return this;
    }

    /**
     * Adds `amount` to seconds in place, mutating this date
     * and returning a reference to this date.
     * @param amount A numer representing the amount to be added
     * @returns A reference to this date
     */
    public addSeconds(amount: number) {
        this.setSeconds(this.getSeconds() + amount);
        return this;
    }

    /**
     * Adds `amount` to milliseconds in place, mutating this date
     * and returning a reference to this date.
     * @param amount A numer representing the amount to be added
     * @returns A reference to this date
     */
    public addMilliseconds(amount: number) {
        this.setMilliseconds(this.getMilliseconds() + amount);
        return this;
    }

    /**
     * Adds `amount` to `unit` in place. This method mutates this date
     * and returns a reference to this date.
     * @param amount A whole numeric value
     * @param unit A unit of time — See {@link TzUnit}
     */
    public subtract(amount: number, unit: TzUnit) {
        // Since most of these have a unique first character,
        // we can determine the unit to add by looking at it
        const u = unit.charAt(0);

        if (u === 's') return this.subtractSeconds(amount);
        if (u === 'h') return this.subtractHours(amount);
        if (u === 'y') return this.subtractYear(amount);
        if (u === 'D' || u === 'd') return this.subtractDate(amount);
        if (u === 'w') return this.subtractDate(amount * 7);
        if (u === 'q') return this.subtractMonth(amount * 3);
        // leave most "expensive" for last
        if (unit === 'minute' || unit === 'minutes' || unit === 'm')
            return this.subtractMinutes(amount);
        if (unit === 'M' || unit === 'month' || unit === 'months')
            return this.subtractMonth(amount);
        if (u === 'm') return this.subtractMilliseconds(amount);

        console.warn(`Formatting unit ${unit} not recognized/implemented.`);
        return this;
    }

    /**
     * Subtracts `amount` from year in place, mutating this date
     * and returning a reference to this date.
     * @param amount A numer representing the amount to be subtracted
     * @returns A reference to this date
     */
    public subtractYear(amount: number) {
        this.setFullYear(this.getFullYear() - amount);
        return this;
    }

    /**
     * Subtracts `amount` from month in place, mutating this date
     * and returning a reference to this date.
     * @param amount A numer representing the amount to be subtracted
     * @returns A reference to this date
     */
    public subtractMonth(amount: number) {
        this.setMonth(this.getMonth() - amount);
        return this;
    }

    /**
     * Subtracts `amount` from date in place, mutating this date
     * and returning a reference to this date.
     * @param amount A numer representing the amount to be subtracted
     * @returns A reference to this date
     */
    public subtractDate(amount: number) {
        this.setDate(this.getDate() - amount);
        return this;
    }

    /**
     * Subtracts `amount` from hours in place, mutating this date
     * and returning a reference to this date.
     * @param amount A numer representing the amount to be subtracted
     * @returns A reference to this date
     */
    public subtractHours(amount: number) {
        this.setHours(this.getHours() - amount);
        return this;
    }

    /**
     * Subtracts `amount` from minutes in place, mutating this date
     * and returning a reference to this date.
     * @param amount A numer representing the amount to be subtracted
     * @returns A reference to this date
     */
    public subtractMinutes(amount: number) {
        this.setMinutes(this.getMinutes() - amount);
        return this;
    }

    /**
     * Subtracts `amount` from seconds in place, mutating this date
     * and returning a reference to this date.
     * @param amount A numer representing the amount to be subtracted
     * @returns A reference to this date
     */
    public subtractSeconds(amount: number) {
        this.setSeconds(this.getSeconds() - amount);
        return this;
    }

    /**
     * Subtracts `amount` from milliseconds in place, mutating this date
     * and returning a reference to this date.
     * @param amount A numer representing the amount to be subtracted
     * @returns A reference to this date
     */
    public subtractMilliseconds(amount: number) {
        this.setMilliseconds(this.getMilliseconds() - amount);
        return this;
    }

    // UTC handling

    /**
     * Offsets this date by {@link timezone}.
     */
    private get _utcDate() {
        return new Date(
            this.getFullYear(),
            this.getMonth(),
            this.getDate(),
            this.getHours() - this.timezone.hours,
            this.getMinutes() - this.timezone.minutes,
            this.getSeconds(),
            this.getMilliseconds()
        );
    }

    override getUTCDay = () => this._utcDate.getDay();
    override getUTCDate = () => this._utcDate.getDate();
    override getUTCMonth = () => this._utcDate.getMonth();
    override getUTCFullYear = () => this._utcDate.getFullYear();
    override getUTCHours = () => this._utcDate.getHours();
    override getUTCMinutes = () => this._utcDate.getMinutes();
    override getUTCSeconds = () => this._utcDate.getSeconds();
    override getUTCMilliseconds = () => this._utcDate.getMilliseconds();
}
