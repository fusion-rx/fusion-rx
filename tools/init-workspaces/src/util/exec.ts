import { execSync } from 'child_process';

/**
 * Executes a bash script using {@link execSync}.
 * @param commands
 * @param printOutput (optional) Whether output should be printed or returned.
 * Defaults to true.
 */
export const fsnExecSync = (
    commands: string | Array<string> | Array<Array<string>>,
    printOutput = true
) => {
    let command: string;

    if (Array.isArray(commands)) {
        command = commands
            .map((command: Array<string> | string) => {
                if (Array.isArray(command)) {
                    return command.join(' ');
                } else {
                    return command;
                }
            })
            .join(';');
    } else {
        command = commands;
    }

    try {
        const output = printOutput
            ? execSync(command, { stdio: [0, 1, 2] })
            : execSync(command);

        if (Buffer.isBuffer(output)) {
            return output.toString('utf-8');
        } else {
            return output;
        }
    } catch (e) {
        if (Buffer.isBuffer(e)) {
            throw e.toString('utf-8');
        } else {
            throw e;
        }
    }
};
