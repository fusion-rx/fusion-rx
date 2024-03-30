import { FsnModule, Injectable } from '../di';

describe('Can initialize module', () => {
    @Injectable()
    class TestInjectable {}

    @FsnModule({})
    class TestModule {}

    test('Can initialize module', () => {});
});
