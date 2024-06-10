import { rxAssets } from './load-assets';

export declare type AssetProvider = {
    /** The name of the configuration collection. */
    collection: string;
    /** Return the path to a single asset. */
    name?: string;
    /** Return the path to each file in an asset directory. */
    dirBased?: boolean;
};

export function Asset(
    providers:
        | (AssetProvider & {
              name: string;
              dirBased?: false;
          })
        | (AssetProvider & {
              dirBased: true;
          })
) {
    return function (target: Object, propertyKey: string | symbol) {
        Object.defineProperty(target, propertyKey, {
            get: () => {
                if (rxAssets[providers.collection]) {
                    if (providers.dirBased)
                        return rxAssets[providers.collection];

                    return (
                        rxAssets[providers.collection][providers.name] ??
                        undefined
                    );
                }

                return undefined;
            }
        });
    };
}
