// @ts-check

import EventEmitter from 'events';
import ts from 'typescript';
import { resolve } from 'path';

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
 * @typedef { 'error' | 'suggestion' | 'warning' | 'recompile' | 'success' } TsCompilerEventType
 */

/**
 * Watches the file for compilation changes
 * @param {string} [project]
 */
export const watchCli = (project) => {
    const fsnProject = readFusionConfig(project);
    watch(fsnProject);
};

/**
 * Handles events emitted by the typescript compiler
 * @param {Diagnostic} diagnostic A typescript diagnostic event
 * @returns {{
 *      type: TsCompilerEventType,
 *      message: string
 * }}
 */
const formatEvent = (diagnostic) => {
    /** @type {FormatDiagnosticsHost} **/
    const formatHost = {
        getCanonicalFileName: (path) => path,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine
    };

    // Format the diagnostic message and remove the prefix
    let message = ts.formatDiagnosticsWithColorAndContext(
        [diagnostic],
        formatHost
    );
    message = message.substring(message.indexOf(':') + 6);

    switch (diagnostic.category) {
        case ts.DiagnosticCategory.Error:
            return {
                type: 'error',
                message
            };
        case ts.DiagnosticCategory.Suggestion:
            return {
                type: 'suggestion',
                message
            };
        case ts.DiagnosticCategory.Warning:
            return {
                type: 'warning',
                message
            };
    }

    if (message.includes('error') && !message.includes('Found 0 errors')) {
        return {
            type: 'error',
            message
        };
    }

    if (diagnostic.code === 6031 || diagnostic.code === 6032) {
        // These events (there might be more) indicate that the
        // code has changed, triggering a reload. The logs from
        // the last compilation aren't valid, so clear the console
        return {
            type: 'recompile',
            message
        };
    }

    return {
        type: 'success',
        message
    };
};

/**
 * Initializes a watcher.
 * @param {import('./types/index.js').FusionCompilerOptions} project The name of the tsconfig file
 * that is configured for building/watching.
 */
export const watch = (project) => {
    const tsConfig = readTsConfig();
    tsConfig.watchOptions = {
        watchFile: ts.WatchFileKind.UseFsEventsOnParentDirectory
    };

    /** @type {EventEmitter<{ [key in TsCompilerEventType]: any }>} */
    const tsCompilerEventEmitter = new EventEmitter();
    const host = ts.createWatchCompilerHost(
        resolve(project.projectRoot, project.tsConfigFileName),
        {},
        ts.sys,
        ts.createSemanticDiagnosticsBuilderProgram,
        (diagnostic) => {
            const evt = formatEvent(diagnostic);
            tsCompilerEventEmitter.emit(evt.type, evt.message);
        },
        (diagnostic) => {
            const evt = formatEvent(diagnostic);
            tsCompilerEventEmitter.emit(evt.type, evt.message);
        }
    );

    const origCreateProgram = host.createProgram;

    // @ts-ignore
    host.createProgram = (rootNames, options, host, oldProgram) =>
        origCreateProgram(rootNames, options, host, oldProgram);
    const origPostProgramCreate = host.afterProgramCreate;
    // @ts-ignore
    host.afterProgramCreate = (program) => {
        if (origPostProgramCreate) origPostProgramCreate(program);
    };

    // Create

    return {
        watch: () => ts.createWatchProgram(host),
        tsCompilerEventEmitter
    };
};
