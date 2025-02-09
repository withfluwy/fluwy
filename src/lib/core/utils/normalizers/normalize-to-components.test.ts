import { describe, expect, it } from 'vitest';
import { normalizeToComponents, type ComponentSchema } from '@/lib/core/utils/normalizers/normalize-to-components.js';
import type { Template } from '@/lib/core/contracts.js';

describe('normalizeToComponents', () => {
    const testCases: TestCases = {
        'parse plain object': {
            input: {
                text: 'this is a simple text',
            },
            output: [
                {
                    name: 'text',
                    template: 'this is a simple text',
                },
            ],
        },
        'parse object with many keys': {
            input: {
                text: 'this is a simple text',
                component1: 'value of component 1',
                component2: 'value of component 2',
            },
            output: [
                {
                    name: 'text',
                    template: 'this is a simple text',
                },
                {
                    name: 'component1',
                    template: 'value of component 1',
                },
                {
                    name: 'component2',
                    template: 'value of component 2',
                },
            ],
        },
        'parse plain string': {
            input: 'this is a simple text',
            output: [
                {
                    name: 'text',
                    template: 'this is a simple text',
                },
            ],
        },
        'parse empty string': {
            input: '',
            output: [
                {
                    name: 'text',
                    template: '',
                },
            ],
        },
        'parse plain boolean': {
            input: true,
            output: [
                {
                    name: 'text',
                    template: true,
                },
            ],
        },
        'parse plain number': {
            input: 1023,
            output: [
                {
                    name: 'text',
                    template: 1023,
                },
            ],
        },
        'parse plain [null]': {
            input: [null],
            output: [
                {
                    name: 'text',
                    template: null,
                },
            ],
        },
        'parse plain null': {
            input: null,
            output: [],
        },
        'parse [undefined]': {
            input: [undefined],
            output: [
                {
                    name: 'text',
                    template: undefined,
                },
            ],
        },
        'parse plain undefined': {
            input: undefined,
            output: [],
        },
        'parse text component': {
            input: [{ text: 'this is a simple text' }],
            output: [
                {
                    name: 'text',
                    template: 'this is a simple text',
                },
            ],
        },
        'parse arrays of plain values': {
            input: ['this is a simple text', 1023, true, false],
            output: [
                {
                    name: 'text',
                    template: 'this is a simple text',
                },
                {
                    name: 'text',
                    template: 1023,
                },
                {
                    name: 'text',
                    template: true,
                },
                {
                    name: 'text',
                    template: false,
                },
            ],
        },
        'parse array of components': {
            input: [
                { text: 'this is a simple text' },
                {
                    object: {
                        prop1: 'value1',
                        prop2: 'value2',
                    },
                },
                {
                    array: [1, 2, 3],
                },
            ],
            output: [
                {
                    name: 'text',
                    template: 'this is a simple text',
                },
                {
                    name: 'object',
                    template: {
                        prop1: 'value1',
                        prop2: 'value2',
                    },
                },
                {
                    name: 'array',
                    template: [1, 2, 3],
                },
            ],
        },
        'parse arrays of components and plain values': {
            input: [
                { text: 'this is a simple text' },
                'another text',
                1023,
                true,
                false,
                {
                    component1: {
                        prop1: 'value1',
                        prop2: 'value2',
                    },
                },
            ],
            output: [
                {
                    name: 'text',
                    template: 'this is a simple text',
                },
                {
                    name: 'text',
                    template: 'another text',
                },
                {
                    name: 'text',
                    template: 1023,
                },
                {
                    name: 'text',
                    template: true,
                },
                {
                    name: 'text',
                    template: false,
                },
                {
                    name: 'component1',
                    template: {
                        prop1: 'value1',
                        prop2: 'value2',
                    },
                },
            ],
        },
        'groups if else statements in objects': {
            input: {
                text: 'Something here',
                'if something is true': ["it's true"],
                'else if something is not true': ["it's not true"],
                else: ["it's false"],
                component1: 'value of component 1',
                'if another is true': ["it's also true"],
                component2: 'value of component 2',
                'if even is not odd': ["it's even"],
            },
            output: [
                {
                    name: 'text',
                    template: 'Something here',
                },
                {
                    name: 'condition',
                    template: {
                        'if something is true': ["it's true"],
                        'else if something is not true': ["it's not true"],
                        else: ["it's false"],
                    },
                },
                {
                    name: 'component1',
                    template: 'value of component 1',
                },
                {
                    name: 'condition',
                    template: {
                        'if another is true': ["it's also true"],
                    },
                },
                {
                    name: 'component2',
                    template: 'value of component 2',
                },
                {
                    name: 'condition',
                    template: {
                        'if even is not odd': ["it's even"],
                    },
                },
            ],
        },
        'groups if else statements in arrays': {
            input: [
                'this is a simple text',
                {
                    'if something is true': ["it's true"],
                    'else if something is not true': ["it's not true"],
                    else: ["it's false"],
                },
                'something in between',
                {
                    'if another is true': ["it's also true"],
                },
                {
                    'if even is not odd': ["it's even"],
                },
            ],
            output: [
                {
                    name: 'text',
                    template: 'this is a simple text',
                },
                {
                    name: 'condition',
                    template: {
                        'if something is true': ["it's true"],
                        'else if something is not true': ["it's not true"],
                        else: ["it's false"],
                    },
                },
                {
                    name: 'text',
                    template: 'something in between',
                },
                {
                    name: 'condition',
                    template: {
                        'if another is true': ["it's also true"],
                    },
                },
                {
                    name: 'condition',
                    template: {
                        'if even is not odd': ["it's even"],
                    },
                },
            ],
        },
        'doesnt group sequential if statements': {
            input: {
                'if something is true': ["it's true"],
                'if something is not true': ["it's not true"],
                'if something is odd': ["it's odd"],
            },
            output: [
                {
                    name: 'condition',
                    template: {
                        'if something is true': ["it's true"],
                    },
                },
                {
                    name: 'condition',
                    template: {
                        'if something is not true': ["it's not true"],
                    },
                },
                {
                    name: 'condition',
                    template: {
                        'if something is odd': ["it's odd"],
                    },
                },
            ],
        },
        // 'handles component properties': {
        //     input: {
        //         component: {
        //             class: 'some css classes',
        //             id: 'some id',
        //             something: true,
        //             content: 'this is the content',
        //         },
        //     },
        //     output: [
        //         {
        //             name: 'component',
        //             props: {
        //                 something: true,
        //                 content: 'this is the content',
        //             },
        //             attrs: {
        //                 id: 'some id',
        //                 class: 'some css classes',
        //             },
        //         },
        //     ],
        // },
        'ignores reserved names': {
            input: {
                id: 'some id',
                class: 'some css classes',
                content: 'this is the content',
            },
            output: [],
        },
        'filters off reserved names': {
            input: {
                class: 'some css classes',
                column: ['some content'],
                row: ['some content'],
            },
            output: [
                {
                    name: 'column',
                    template: ['some content'],
                },
                {
                    name: 'row',
                    template: ['some content'],
                },
            ],
        },
        'handles slots': {
            input: {
                id: 'someid',
                slot: 'someslot',
            },
            output: [
                {
                    name: 'slot',
                    template: 'someslot',
                },
            ],
        },
    };

    Object.entries(testCases).forEach(([testName, testCase]) => {
        it(testName, () => {
            const result = normalizeToComponents(testCase.input);
            expect(result).toEqual(testCase.output);
        });
    });

    // it('throws an exception if trying to normalize component props as components', () => {
    //     const reservedNames = ['slot', 'content', 'component', 'class', 'vars'];

    //     for (const name of reservedNames) {
    //         expect(() => normalizeToComponents({ [name]: 'some value' })).toThrowError(
    //             `Failed to normalize component: ${JSON.stringify({ [name]: 'some value' })}`
    //         );
    //     }
    // });
});

type TestCases = {
    [testName: string]: {
        input: Template;
        output: ComponentSchema[];
    };
};
