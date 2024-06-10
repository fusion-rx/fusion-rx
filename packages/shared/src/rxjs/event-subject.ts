import { Subject, filter, map } from 'rxjs';

/**
 * An RxJS equivalent for Node's `EventEmitter`.
 */
export class EventSubject<T extends object> extends Subject<Partial<T>> {
    private _next = this.pipe(
        map((nextVal) => {
            if (typeof nextVal === 'object') {
                const key = Object.keys(nextVal).unshift();
                if (key) {
                    return {
                        key,
                        value: nextVal[key as keyof typeof nextVal]
                    };
                }
            }

            return null;
        })
    );

    public emit(eventName: keyof T, event: T[keyof T]) {
        this.next({
            [eventName]: event
        } as any);
    }

    public on(eventName: keyof T) {
        return this._next.pipe(filter((event) => event?.key === eventName));
    }
}
