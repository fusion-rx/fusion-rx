import { Subscriber } from 'rxjs';
import { isSubscription } from './is-subscription';
import { isObserver } from './is-observer';

/**
 * Determines if the passed value is a subscriber.
 * @param value The value to type check.
 * @returns True if value is a subscriber; else, false.
 */
export function isSubscriber<T>(value: any): value is Subscriber<T> {
    return (
        (value && value instanceof Subscriber) ||
        (isObserver(value) && isSubscription(value))
    );
}
