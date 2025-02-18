import type { Application } from '@/lib/core/app/index.js';
import type { Any } from '@/lib/core/contracts.js';
import { createApp, createContext } from '@/lib/index.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('App operations at the app level', () => {
    let app: Application;
    let consoleLog: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        app = createApp();
        consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLog.mockRestore();
    });

    describe('conditions inside operations', () => {
        const context = createContext({
            response: {
                call_api_1: true,
            },
        });

        describe('object format', () => {
            const testCases: OperationTestCase = {
                'supports if condition': {
                    operations: {
                        'if response.call_api_1': {
                            log: 'if satisfied',
                        },
                        else: {
                            log: 'else satisfied',
                        },
                    },
                    expectedLog: 'if satisfied',
                },
                'supports else if condition': {
                    operations: {
                        'if not response.call_api_1': {
                            log: 'if satisfied',
                        },
                        'else if response.call_api_1': {
                            log: 'else if satisfied',
                        },
                    },
                    expectedLog: 'else if satisfied',
                },
                'supports else condition': {
                    operations: {
                        'if not response.call_api_1': {
                            log: 'if satisfied',
                        },
                        'else if response.call_api_2': {
                            log: 'else if satisfied',
                        },
                        else: {
                            log: 'else satisfied',
                        },
                    },
                    expectedLog: 'else satisfied',
                },
            };

            Object.entries(testCases).forEach(([testDescription, testCase]) => {
                it(testDescription, async () => {
                    await app.handleOperations(testCase.operations, context);

                    expect(consoleLog).toHaveBeenCalledWith(testCase.expectedLog);
                });
            });
        });

        describe('array format', () => {
            const testCases: OperationTestCase = {
                'supports if condition': {
                    operations: [
                        {
                            'if response.call_api_1': {
                                log: 'if satisfied',
                            },
                            else: {
                                log: 'else satisfied',
                            },
                        },
                    ],
                    expectedLog: 'if satisfied',
                },
                'supports else if condition': {
                    operations: [
                        {
                            'if not response.call_api_1': {
                                log: 'if satisfied',
                            },
                            'else if response.call_api_1': {
                                log: 'else if satisfied',
                            },
                        },
                    ],
                    expectedLog: 'else if satisfied',
                },
                'supports else condition': {
                    operations: [
                        {
                            'if not response.call_api_1': {
                                log: 'if satisfied',
                            },
                            'else if response.call_api_2': {
                                log: 'else if satisfied',
                            },
                            else: {
                                log: 'else satisfied',
                            },
                        },
                    ],
                    expectedLog: 'else satisfied',
                },
                'supports mixed operations': {
                    operations: [
                        {
                            log: 'first',
                        },
                        {
                            'if response.call_api_1': {
                                log: 'second',
                            },
                            else: {
                                log: 'third',
                            },
                        },
                        {
                            log: 'fourth',
                        },
                    ],
                    expectedLogs: ['first', 'second', 'fourth'],
                },
            };

            Object.entries(testCases).forEach(([testDescription, testCase]) => {
                it(testDescription, async () => {
                    await app.handleOperations(testCase.operations, context);

                    if ('expectedLogs' in testCase) {
                        testCase.expectedLogs!.forEach((log) => {
                            expect(consoleLog).toHaveBeenCalledWith(log);
                        });
                    } else {
                        expect(consoleLog).toHaveBeenCalledWith(testCase.expectedLog);
                    }
                });
            });
        });
    });
});

type OperationTestCase = {
    [testCase: string]: {
        operations: Any;
        expectedLog?: string;
        expectedLogs?: string[];
    };
};
