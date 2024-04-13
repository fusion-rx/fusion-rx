import { Register, Route } from '../di';
import { R } from './bootstrap';
import { bootstrapRoute } from './bootstrap-routes';

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
        @Register()
        public testHandler(provider: { date: Date }) {}
    }
    (<R>TestRoute).prototype.instance = new TestRoute();

    beforeAll(() => {
        bootstrapRoute(<R>TestRoute);
    });

    test('Can parse inline template', () => {
        expect((<R>TestRoute).prototype.template).toBeTruthy();
        console.log((<R>TestRoute).prototype.template);
        console.log((<R>TestRoute).prototype.registeredRoutes);
    });
});
