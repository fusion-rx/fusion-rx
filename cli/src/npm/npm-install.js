import { exit } from 'process';
import { resolve } from 'path';

import { FsnConsole } from '../../cli';
import { execSync } from './exec-sync';

/**
 * Runs the `npm install` command in a workspaces root directory.
 * @throws Will throw an error if the command fails
 */
export const npmInstall = () => {
    execSync([`cd ${resolve()}`, 'npm install']);
};
