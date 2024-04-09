// @ts-check

import { readFusionConfig } from './fusion/read-fusion-config.js';
import { join } from 'path';
import { Observable, merge } from 'rxjs';
import { watch } from './watch.js';
import { execSync } from 'child_process';

/**
 *
 * @param {string} projectName
 */
export const serveCli = (projectName) => {
    const fsnConfig = readFusionConfig(projectName);
    const out = join(fsnConfig.outDir, fsnConfig.main.replace('.ts', '.js'));

    const watcher = new Observable(() => {
        watch(fsnConfig);
    });
    const runner = new Observable(() => {
        execSync('node ' + out);
    });

    merge(watcher, runner).subscribe({
        next: (val) => {
            console.log(val);
        }
    });
};
