import { Subscription } from 'rxjs';
import { isFunction } from './is-function';

/**
 * Determines if the passed value is a subscription.
 * @param value The value to type check.
 * @returns True if value is a subscription; else, false.
 */
export function isSubscription(value: any): value is Subscription {
    return (
        value instanceof Subscription ||
        (value &&
            'closed' in value &&
            isFunction(value.remove) &&
            isFunction(value.add) &&
            isFunction(value.unsubscribe))
    );
}
