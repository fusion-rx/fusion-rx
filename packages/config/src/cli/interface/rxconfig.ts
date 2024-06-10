import { AssetCollection } from './asset-collection';
import { Collection } from './collection';
import { CompilerOptions } from './compiler-options';

export declare interface FsnConfig {
    name: string;
    version: string;
    compilerOptions: CompilerOptions;
    include: {
        [collectionName: string]: Collection;
    };
    assets: AssetCollection[];
}
