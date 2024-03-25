import { last, of, scan } from 'rxjs';
import { filterNull } from './filter-nulls';

describe('filterNull operator', () => {
    test('Can filter nulls and undefineds', (done) => {
        of(...['hello', null, 'world', undefined])
            .pipe(
                filterNull,
                scan((acc, str) => {
                    acc.push(str);
                    return acc;
                }, [] as string[]),
                last()
            )
            .subscribe((val) => {
                expect(val.length).toEqual(2);
                done();
            });
    });
});
