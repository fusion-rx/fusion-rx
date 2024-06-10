import { BehaviorSubject, Observable, filter } from 'rxjs';
import { Falsy, isTruthy } from '../public-api.js';

/**
 * An extension of BehaviorSubject for reactive design patterns.
 * Differs from a typical BehaviorSubject in that it...
 * - Can be instantiated without an initial value
 * - Is piped into the class member `onNext$`, which filters out null values
 * emitted by `next`.
 *
 * @example
 * *Typescript*
 * ````
 * public $foo = new ReactiveSubject<string>();
 * ...
 * public baz(qix: string) {
 *     foo.next(qix);
 * }
 * ````
 * *HTML*
 * ````
 * <div>{{ foo.onNext$ | async }}</div>
 * ````
 * @example
 * *Typescript*
 * ````
 * public $foo = new ReactiveSubject<boolean>();
 * public foo$ = this.$foo.onNext$.pipe(
 *      map((qix) => {
 *          if (qix) {
 *              return 'Hello World';
 *          } else {
 *              return 'Goodbye World';
 *          }
 *      })
 * )
 * ````
 * *HTML*
 * ````
 * <div>{{ foo$ | async }}</div>
 * ````
 */
export class ReactiveSubject<T> extends BehaviorSubject<T | Falsy> {
    /**
     * Used in combination with the Angular async pipe to emit
     * new values to the template.
     */
    public next$!: Observable<T>;

    constructor(value?: T) {
        super(value ?? null);
        this.next$ = this.pipe(filter(isTruthy));
    }

    /**
     * The last emitted value from {@link next}.
     */
    public get currentValue() {
        return this['_value'] as T;
    }

    /**
     * Re-emits the current value.
     */
    public replay() {
        this.next(this.currentValue);
    }
}
