import chalk from 'chalk';
import { Table } from 'console-table-printer';
import { isExpectError } from './expect.js';
import { TestResult } from './describe.js';

export const generateReport = (testResults: TestResult[]) => {
    const report = new Table({
        columns: [
            { name: 'Passed', alignment: 'center' },
            { name: 'Description', alignment: 'left' },
            { name: 'Timing', alignment: 'left' }
        ],
        charLength: {
            '✖': 1,
            '✔': 1
        }
    });

    testResults.forEach((result) => {
        report.addRow(
            {
                Passed: result.success ? '✔' : '✖',
                Description: result.id,
                Timing: result.timing + 's'
            },
            {
                color: result.success ? 'green' : 'red'
            }
        );
    });

    console.log();
    console.log(chalk.blue('Summary:\n'));
    report.printTable();

    const errors = testResults.filter((result) => result.error);
    if (errors.length > 0) {
        console.log(chalk.red('\nError(s):'));
        errors.forEach((result) => {
            console.log();
            console.log(chalk.bgRed(result.id));
            console.log();

            if (isExpectError(result.error)) {
                console.log(chalk.red('Details:') + '\n');
                console.error(result.error.formatDetails() + '\n');
                console.log(chalk.red('Stack:') + '\n');
                console.error(result.error.stack);
            } else {
                console.log(chalk.red('Stack:') + '\n');
                console.log(result.error);
            }
        });
    }
};
