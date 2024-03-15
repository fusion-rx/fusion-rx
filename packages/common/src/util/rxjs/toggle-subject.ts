import { BehaviorSubject } from 'rxjs';

/**
 * An extension of BehaviorSubject that toggles between `true` and `false`.
 *
 * @example
 * *Typescript*
 * ````
 * public $foo = new ToggleSubject<string>(true);
 * ...
 * $foo.next()      // emits false
 * $foo.next()      // emits true
 * $foo.next(true)  // emits true
 * $foo.next(false) // emits false
 * ````
 * *HTML*
 * ````
 * <div>{{ foo | async }}</div>
 * ````
 */
export class ToggleSubject extends BehaviorSubject<boolean> {
    constructor(toggleState?: boolean) {
        super(toggleState ?? false);
    }

    override next(value?: boolean | null | undefined) {
        super.next(value ?? !this.value);
    }

    public false() {
        this.next(false);
    }

    public true() {
        this.next(true);
    }
}
