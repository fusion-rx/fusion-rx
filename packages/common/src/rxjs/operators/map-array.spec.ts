import { of } from 'rxjs';
import { mapArray } from './map-array';

describe('coerceArray operator', () => {
    test('Can return array from array', (done) => {
        of(['hello', 'world'])
            .pipe(mapArray)
            .subscribe({
                next: (val) => {
                    expect(Array.isArray(val)).toEqual(true);
                    expect(val.length).toEqual(2);
                    done();
                }
            });
    });

    test('Can return array from an ArrayLike', (done) => {
        const arrayLike = new Set();
        arrayLike.add('hello');
        arrayLike.add('world');

        of(arrayLike)
            .pipe(mapArray)
            .subscribe({
                next: (val) => {
                    expect(Array.isArray(val)).toEqual(true);
                    expect(val.length).toEqual(2);
                    done();
                }
            });
    });

    test('Can return array from an object', (done) => {
        of({
            hello: 'world'
        })
            .pipe(mapArray)
            .subscribe({
                next: (val) => {
                    expect(Array.isArray(val)).toEqual(true);
                    expect(val.length).toEqual(1);
                    done();
                }
            });
    });

    test('Can return array from a string', (done) => {
        of('Hello world')
            .pipe(mapArray)
            .subscribe({
                next: (val) => {
                    expect(Array.isArray(val)).toEqual(true);
                    expect(val.length).toEqual(1);
                    expect(typeof val[0]).toEqual('string');
                    done();
                }
            });
    });
});
