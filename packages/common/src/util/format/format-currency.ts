import { round } from '../math';

/**
 * Formats `amount` as currency, not prepending the `$` character and
 * rounding when `amount` has a decimal with over two places.
 * @param amount A string or number representing an amount in dollars
 * @returns Dollars formatted as `00.00`.
 */
export function formatCurrency(amount: string | number) {
    const decimalIndex = String(amount).indexOf('.');

    // Handle whole numbers
    if (decimalIndex === -1) return amount + '.00';

    const asString = String(amount);

    let dollars = asString.substring(0, decimalIndex);
    let cents = asString.substring(decimalIndex + 1, asString.length);

    if (dollars.length === 0) dollars = '0';

    switch (cents.length) {
        case 0:
            cents = '00';
            break;
        case 1:
            cents = cents + '0';
            break;
        case 2:
            break;
        default:
            cents = round(Number('.' + cents), 2) + '';
            cents = cents.slice(cents.indexOf('.') + 1, cents.length);
    }

    return dollars + '.' + cents.slice();
}
