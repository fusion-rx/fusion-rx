import { isParsableBoolean } from './is-parsable-boolean';
import { isParsableDate } from './is-parsable-date';
import { isParsableFloat } from './is-parsable-float';
import { isParsableInteger } from './is-parsable-integer';
import { isParsableJSON } from './is-parsable-json';

export const getParseType = (
    val: any
): 'string' | 'integer' | 'float' | 'object' | 'date' | 'boolean' => {
    if (typeof val === 'string') {
        if (isParsableDate(val)) return 'date';
        if (isParsableInteger(val)) return 'integer';
        if (isParsableFloat(val)) return 'float';
        if (isParsableJSON(val)) return 'object';
        if (isParsableBoolean(val)) return 'boolean';
        return 'string';
    }

    throw new Error(
        'Parsed type of val could not be determined because it is not a string.'
    );
};
