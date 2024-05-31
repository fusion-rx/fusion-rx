import { Register, Route } from '../di';
import { R } from './bootstrap';
import { bootstrapRoute } from './bootstrap-route';

describe('Bootstrap routes', () => {
    @Route({
        template: {
            test: {
                method: 'get',
                handler: 'testHandler',
                params: {
                    date: {
                        type: 'Date',
                        optional: true
                    }
                }
            }
        }
    })
    class TestRoute {
        @Register({
            method: 'get',
            path: 'test'
        })
        public testHandler() {}

        @Register({
            method: 'get',
            path: '/test/:test'
        })
        public testHandler2() {}
    }
    (<R>TestRoute).prototype.instance = new TestRoute();

    beforeAll(() => {
        bootstrapRoute(<R>TestRoute);
    });

    test('Can parse inline template', () => {
        expect((<R>TestRoute).prototype.registered).toBeTruthy();
        expect((<R>TestRoute).prototype.registered['testHandler']).toBeTruthy();
        expect(
            (<R>TestRoute).prototype.registered['testHandler'].method
        ).toEqual('get');
        expect((<R>TestRoute).prototype.registered['testHandler'].path).toEqual(
            'test'
        );
        expect(
            (<R>TestRoute).prototype.registered['testHandler2']
        ).toBeTruthy();
        expect(
            (<R>TestRoute).prototype.registered['testHandler2'].method
        ).toEqual('get');
        expect(
            (<R>TestRoute).prototype.registered['testHandler2'].path
        ).toEqual('test/:test');
    });
});
