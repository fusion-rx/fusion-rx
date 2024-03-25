/**
 * @param yy 13
 * @param yyyy 2013
 */
export declare type Year = 'YY' | 'YYYY';

/**
 * @param M 1..12 (Jan is 1)
 * @param Mo 1st..12th
 * @param MM 01..12 (Jan is 1)
 * @param MMM Jan
 * @param MMMM January
 */
export declare type Month = 'M' | 'Mo' | 'MM' | 'MMM' | 'MMMM';

/**
 * @param Q 1..4
 * @param Qo 1st..4th
 */
export declare type Quarter = 'Q' | 'Qo';

/**
 * @param d 0..6
 * @param dd Su
 * @param ddd Sun
 * @param dddd Sunday
 */
export declare type Weekday = 'd' | 'dd' | 'ddd' | 'dddd';

/**
 * @param D 1..31
 * @param Do 1st..31st
 * @param DD 01..31
 */
export declare type Day = 'D' | 'Do' | 'DD';

/**
 * @param DDD 1..365
 * @param DDDo 1st..365th
 * @param DDDD 001..365
 */
export declare type DayOfYear = 'DDD' | 'DDDo' | 'DDDD';

/**
 * @param w 1..53
 * @param wo 1st..53rd
 * @param ww 01..53
 */
export declare type WeekOfYear = 'w' | 'wo' | 'ww';

export declare type DateFormatter =
    | Weekday
    | Year
    | Month
    | Quarter
    | Day
    | DayOfYear
    | WeekOfYear;

/**
 * @param H 0..23
 * @param HH 00..23
 */
export declare type Hour24 = 'H' | 'HH';

/**
 * @param h 1..12
 * @param hh 01..12
 */
export declare type Hour12 = 'h' | 'hh';

/**
 * @param m 0..59
 * @param mm 00..59
 */
export declare type Minute = 'm' | 'mm';

/**
 * @param s 0..59
 * @param ss 00..59
 */
export declare type Seconds = 's' | 'ss';

/**
 * @param a am
 * @param A AM
 */
export declare type AmPm = 'a' | 'A';

/**
 * @param Z +07:00
 * @param ZZ +0730
 */
export declare type TZ = 'Z' | 'ZZ';

/**
 * @param S 0..9
 * @param SS 00.99
 * @param SSS 000.999
 */
export declare type SecondsFractional = 'S' | 'SS' | 'SSS';

export declare type TimeFormatter =
    | Hour24
    | Hour12
    | Minute
    | Seconds
    | AmPm
    | TZ
    | SecondsFractional;

/**
 * ## Date Formatters
 *
 * ### Weekday
 *
 * @type {'d'} 0..6
 * @param dd Su
 * @param ddd Sun
 * @param dddd Sunday
 *
 * ### Year
 *
 * @param yy 13
 * @param yyyy 2013
 *
 * ### Month
 *
 * @param M 1..12 (Jan is 1)
 * @param Mo 1st..12th
 * @param MM 01..12 (Jan is 1)
 * @param MMM Jan
 * @param MMMM January
 *
 * ### Quarter
 *
 * @param Q 1..4
 * @param Qo 1st..4th
 *
 * ### Day
 *
 * @param D 1..31
 * @param Do 1st..31st
 * @param DD 01..31
 *
 * ### Day of year
 *
 * @param DDD 1..365
 * @param DDDo 1st..365th
 * @param DDDD 001..365
 *
 * ### Week of year
 *
 * @param w 1..53
 * @param wo 1st..53rd
 * @param ww 01..53
 *
 * ## Time Formatters
 *
 * ### 24h hour
 *
 * @param H 0..23
 * @param HH 00..23
 *
 * ### 12h hour
 *
 * @param h 1..12
 * @param hh 01..12
 *
 * ### Minutes
 *
 * @param m 0..59
 * @param mm 00..59
 *
 * ### Seconds
 *
 * @param s 0..59
 * @param ss 00..59
 *
 * ### AM/PM
 *
 * @param a am
 * @param A AM
 *
 * ### Timezone Offset
 *
 * @param Z +07:00
 * @param ZZ +0730
 *
 * ### Fractional Seconds
 *
 * @param S 0..9
 * @param SS 00.99
 * @param SSS 000.999
 */
export declare type DateTimeFormatter = DateFormatter | TimeFormatter;
