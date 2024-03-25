#! /usr/bin/env node

import { join, resolve } from 'path';
import { FsnLogger } from './util/log';
import { cpSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { readAndParse } from './util/read-and-parse';
import { PackageJSON } from './type/package-json';
import { exit } from 'process';
import { ProjectMeta } from './type/project-meta';
import { fsnExecSync } from './util/exec';

/** The name of workspace setup files. Subject to change. */
const workspaceSetupFile = 'package.json';

/** The name of the pre-install component for logging. */
const component = 'Preinstall';

/** Logs to stdout. */
const logger = new FsnLogger(component);

/** The path to the pre-install configuration file. */
const configPath = resolve(workspaceSetupFile);

if (!existsSync(configPath)) {
    logger.error(
        `This command must be run in a directory that contains a ${workspaceSetupFile} file. Exiting.`
    );
}

/** The package.json for the workspace. */
let workspaceProjectJSON: PackageJSON;

try {
    workspaceProjectJSON = readAndParse(
        configPath,
        `Failed to read ${workspaceSetupFile}. Exiting.`,
        `Failed to parse ${workspaceSetupFile}. Exiting.`
    );
} catch (err) {
    logger.error((err as Error).message, err as Error, false);
    exit();
}

if (!workspaceProjectJSON.workspacesConf) {
    logger.error(
        'You must define a "workspacesConf" section of your package.json. Exiting.'
    );
    exit();
}

/** The configuration specific to init workspaces. */
const config = workspaceProjectJSON.workspacesConf;

/** The workspaces in {@link workspaceProjectJSON}. */
const projects = config.projects.map((project): ProjectMeta => {
    const root = resolve(config.srcRoot, project.source);

    const pkgJSONPath = resolve(root, 'package.json');
    const pkgJSON = JSON.parse(readFileSync(pkgJSONPath, 'utf-8'));

    const outPath = resolve(config.outDir, project.source);
    const buildFrom = project.buildFrom;

    return {
        name: pkgJSON.name,
        root,
        pkgJSONPath,
        pkgJSON,
        outPath,
        outFile: join(outPath, 'package.json'),
        buildCommand: project.buildCommand,
        buildFrom
    };
});

/**
 * Creates the workspace directory and copies over the package.json file.
 * Logs an error if copy fails.
 * @param {meta} project
 */
const makeProjectWorkspace = (project: ProjectMeta) => {
    if (existsSync(project.outFile)) {
        logger.log(
            `${project.name}'s workspace directory already has a package.json. Skipping.`
        );
        return;
    }

    if (!existsSync(project.outPath)) {
        logger.log(`Creating workspace directory at ${project.outPath}...`);

        try {
            mkdirSync(project.outPath, {
                recursive: true
            });
        } catch (err) {
            logger.error(
                `Failed to create workspace directory for ${project}.`,
                err as Error,
                false
            );
            return;
        }

        logger.log(
            `Created workspace directory for ${project.name}. Copying package.json...`
        );
    } else {
        logger.log(
            `${project.name} workspace directory already exists. Copying package.json...`
        );
    }

    try {
        cpSync(project.pkgJSONPath, project.outFile, {
            recursive: true
        });
        logger.log(`Copied package.json for ${project.name}.`);
    } catch (err) {
        logger.error(
            `Failed to copy package.json for ${project.name}. Skipping.`,
            err as Error,
            false
        );
    }
};

/**
 * Runs the `npm install` command in the workspaces root directory.
 */
const npmInstall = () => {
    try {
        fsnExecSync([`cd ${resolve()}`, 'npm install']);
    } catch (err) {
        logger.error('Failed to npm install. Exiting.', err as Error);
        process.exit();
    }
};

/**
 * Runs the build command for `workspaces` if one is provided in `config`.
 * @param {meta} project
 */
const buildProject = (project: ProjectMeta) => {
    if (project.buildCommand) {
        logger.log(
            `Building ${project.name} at ${project.root} with ${project.buildCommand}.`
        );

        try {
            fsnExecSync([
                `cd ${
                    project.buildFrom === 'project'
                        ? resolve(project.root)
                        : resolve()
                }`,
                project.buildCommand
            ]);

            logger.log(`Completed ${project.name} build.`);
        } catch (err) {
            logger.error(
                `Failed to run build command for ${project.name}.`,
                err as Error
            );
        }
    } else {
        logger.log(`No build command included for ${project.name}. Skipping.`);
    }
};

const preInstall = () => {
    // Create the output director for all workspaces in the config.
    if (!existsSync(resolve(config.outDir))) {
        mkdirSync(resolve(config.outDir));
    }

    // Make each workspace.
    projects.forEach((project) => {
        makeProjectWorkspace(project);
    });

    logger.log('Running npm install for workspace...', component);
    npmInstall();

    logger.log('Install complete. Building projects...', component);
    projects.forEach((workspace) => buildProject(workspace));

    logger.log('Workspace build complete. Exiting.');
};

preInstall();
