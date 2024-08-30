import { oraPromise } from 'ora';

import { timer } from './timer.js';
import { generateReport } from './report.js';
import { execute } from './execute.js';
import chalk from 'chalk';

export declare type TestResult = {
    id: string;
    success: boolean;
    error?: Error;
    result?: any;
    timing: number;
};

let _beforeAll: (() => any) | undefined;
export const beforeAll = (action: () => any) => (_beforeAll = action);

let _afterAll: (() => any) | undefined;
export const afterAll = (action: () => any) => (_afterAll = action);

let _beforeEach: (() => any) | undefined;
export const beforeEach = (action: () => any) => (_beforeEach = action);

let _afterEach: (() => any) | undefined;
export const afterEach = (action: () => any) => (_afterEach = action);

const allTests: {
    testID: string;
    test: () => any;
}[] = [];

/**
 * Creates a test to run.
 * @param testID The test's identifier
 * @param test The test executor
 */
export const test = (testID: string, test: () => any) => {
    allTests.push({
        testID: testID,
        test
    });
};

/**
 * Wraps tests in `tests` and executes them.
 * @param suiteID The test suite's identifier
 * @param tests Holds all tests in the suite
 */
export const describe = async (suiteID: string, tests: () => void) => {
    tests();

    try {
        if (_beforeAll) await execute(_beforeAll);
    } catch (e) {
        console.error(chalk.red('Test execution failed; beforeAll() errored.'));
        console.error(e);
    }

    const results = await oraPromise(
        Promise.all(
            allTests.map(async (test): Promise<TestResult> => {
                const t = timer();

                try {
                    if (_beforeEach) await execute(_beforeEach);
                    let testResult = await execute(test.test);
                    if (_afterEach) await execute(_afterEach);

                    return {
                        id: test.testID,
                        success: true,
                        result: testResult,
                        timing: t.end() / 1000
                    };
                } catch (error) {
                    try {
                        if (_afterEach) await execute(_afterEach);
                    } catch (e) {
                        console.error(`Failed to execute 'afterEach'`, e);
                    }

                    return {
                        id: test.testID,
                        success: false,
                        error: <any>error,
                        timing: t.end() / 1000
                    };
                }
            })
        ),
        {
            text: `Executing "${suiteID}" test suite.`,
            successText: `Completed execution for "${suiteID}"`,
            failText: `Test execution failed.`
        }
    );

    try {
        if (_afterAll) await execute(_afterAll);
    } catch (e) {
        console.error(`Failed to execute 'afterAll'.`);
        console.error(e);
    }

    generateReport(results);
};
