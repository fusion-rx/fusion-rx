import { FsnModuleRef, boostrap } from '../application';
import { MainModule, TestDependencyTree } from './test-app.spec';

describe('FsnModule', () => {
    let app: FsnModuleRef;
    let tree: TestDependencyTree;

    beforeAll(() => {
        app = boostrap(MainModule);
        tree = app as unknown as TestDependencyTree;
    });

    test('Can bootstrap', () => {
        expect(tree).toBeTruthy();
    });

    test('Creates only one instance of provider', () => {
        tree.providers.ModuleProvider.instance[''];
        expect(
            tree.providers.ModuleProvider.instance['externalModuleProvider'][
                'count'
            ]
        ).toEqual(2);
        expect(
            tree.providers.RootProvider.instance['externalModuleProvider'][
                'count'
            ]
        ).toEqual(2);
        expect(
            tree.imports.ExternalModule.exports.ExternalModuleProvider['count']
        ).toEqual(2);
        expect(
            tree.imports.ExternalModule.providers.ExternalModuleProvider
                .instance['count']
        ).toEqual(2);
    });
});
