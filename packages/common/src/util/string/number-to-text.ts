import { digitToText } from './digit-to-text';
import { evalTens } from './eval-tens';

export function numberToText(num: number): string {
    if (num <= 9) {
        return digitToText(num) + '';
    } else {
        const numbers = (num + '').split('').map((num) => Number.parseInt(num));

        switch (num) {
            case 10:
                return 'ten';
            case 11:
                return 'eleven';
            case 12:
                return 'twelve';
            case 13:
                return 'thirteen';
            case 15:
                return 'fifteen';
        }

        if (numbers.length === 2) {
            const tens = evalTens(numbers[0]);

            if (num > 13 && num < 20) {
                return digitToText(numbers[0]) + 'teen';
            }

            if (num % 10 === 0) {
                return tens + '';
            }

            return tens + '-' + (digitToText(numbers[1]) + '');
        }
    }

    return num + '';
}
