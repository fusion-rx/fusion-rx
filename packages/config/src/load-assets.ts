import { isDirectory, resolveRoot, red, makeLogPrefix } from '@fusion-rx/node';
import { newLine } from '@fusion-rx/common';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

export const rxAssets: {
    [collection: string]: {
        [assetName: string]: string;
    };
} = {};

const _findAssetsDir = () => {
    try {
        const home = resolveRoot();

        if (existsSync(join(home.path, 'assets'))) {
            return join(home.path, 'assets');
        } else if (existsSync(join(home.path, '..', 'assets'))) {
            return join(home.path, '..', 'assets');
        } else {
            throw new Error('Assets does not exist.');
        }
    } catch (err) {
        console.error(
            makeLogPrefix('WARN') +
                red(
                    newLine(
                        'Failed to resolve assets.',
                        'Did you compile your configuration with the RxConfig cli? See the @fusion-rx/common Readme for information and troubleshooting.',
                        (err as Error).stack ?? ''
                    )
                ).join('')
        );
    }

    return null;
};

try {
    const assetsPath = _findAssetsDir();

    if (assetsPath) {
        readdirSync(assetsPath).forEach((collection) => {
            const collectionPath = join(assetsPath, collection);
            rxAssets[collection] = {};

            if (isDirectory(collectionPath)) {
                readdirSync(collectionPath).forEach(
                    (asset) =>
                        (rxAssets[collection][asset] = join(
                            assetsPath,
                            collection,
                            asset
                        ))
                );
            }
        });
    }
} catch (err) {
    console.error(
        red(
            newLine(
                'Error: Failed to load RxConfig.',
                (err as Error).stack ??
                    (err as Error).name + ': ' + (err as Error).message
            )
        ).join('')
    );
}
