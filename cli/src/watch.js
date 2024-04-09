// @ts-check

import EventEmitter from 'events';
import ts from 'typescript';
import { resolve } from 'path';

import { logError, logSuccess, logWarning, logInfo } from './util/index.js';
import { readTsConfig } from './typescript/index.js';
import { readFusionConfig } from './fusion/read-fusion-config.js';

/**
 * @typedef {import('typescript').Diagnostic} Diagnostic
 * @typedef {import('typescript').FormatDiagnosticsHost} FormatDiagnosticsHost
 * @typedef {{
 *      code: number,
 *      message: string,
 *      raw: Diagnostic
 * }} WatchErrorEvent
 * @typedef {{ status: Diagnostic[] }} WatchEvent
 * @typedef {(...event: Diagnostic[]) => void } Callback
 */

/** @type { EventEmitter<WatchEvent>} */
const watchEvent = new EventEmitter();

/**
 * Watches the file for compilation changes
 * @param {string} [project]
 */
export const watchCli = (project) => {
    const fsnProject = readFusionConfig(project);
    watch(fsnProject);
};

/**
 * Logs a formatted diagnostic message to the console.
 * @param {Diagnostic} statusEvent
 */
const logEvent = (statusEvent) => {
    /** @type {FormatDiagnosticsHost} **/
    const formatHost = {
        getCanonicalFileName: (path) => path,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine
    };

    // Format the diagnostic message and remove the prefix
    let formattedMsg = ts.formatDiagnosticsWithColorAndContext(
        [statusEvent],
        formatHost
    );
    formattedMsg = formattedMsg.substring(formattedMsg.indexOf(':') + 6);

    switch (statusEvent.category) {
        case ts.DiagnosticCategory.Error:
            logError(formattedMsg);
            break;
        case ts.DiagnosticCategory.Suggestion:
            logInfo(formattedMsg);
            break;
        case ts.DiagnosticCategory.Warning:
            logWarning(formattedMsg);
            break;
        default:
            if (formattedMsg.includes('error')) {
                console.log(formattedMsg);
            } else if (statusEvent.code === 6031 || statusEvent.code === 6032) {
                // These events (there might be more) indicate that the
                // code has changed, triggering a reload. The logs from
                // the last compilation aren't valid, so clear the console
                console.clear();
                console.log(formattedMsg);
            } else {
                logSuccess(
                    ts.formatDiagnosticsWithColorAndContext(
                        [statusEvent],
                        formatHost
                    )
                );
            }
    }
};

/**
 * Initializes a watcher.
 * @param {import('./types/index.js').FusionCompilerOptions} project The name of the tsconfig file
 * that is configured for building/watching.
 */
export const watch = (project) => {
    watchEvent.on('status', logEvent);

    const tsConfig = readTsConfig();

    tsConfig.watchOptions = {
        watchFile: ts.WatchFileKind.UseFsEventsOnParentDirectory
    };

    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

    const host = ts.createWatchCompilerHost(
        resolve(project.projectRoot, project.tsConfigFileName),
        {},
        ts.sys,
        createProgram,
        (diagnostic) => watchEvent.emit('status', diagnostic),
        (diagnostic) => watchEvent.emit('status', diagnostic)
    );

    const origCreateProgram = host.createProgram;

    // @ts-ignore
    host.createProgram = (rootNames, options, host, oldProgram) =>
        origCreateProgram(rootNames, options, host, oldProgram);
    const origPostProgramCreate = host.afterProgramCreate;
    host.afterProgramCreate = (program) => {
        if (origPostProgramCreate) origPostProgramCreate(program);
    };

    // Create an initial program, watch files, and update
    // the program over time.
    ts.createWatchProgram(host);
};
