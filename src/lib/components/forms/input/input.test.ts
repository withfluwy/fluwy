import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Input } from './input.js';
import { Required } from '@/lib/core/rules/required.js';
import type { Application } from '@/lib/core/index.js';
import type { Context } from '@/lib/core/contracts.js';

describe('Input component', () => {
    let input!: Input<string>;

    beforeEach(() => {
        input = new Input<string>({ initialValue: 'test' });
    });

    describe('constructor and properties', () => {
        it('should initialize with provided config', () => {
            const config = {
                initialValue: 'test value',
                field: 'testField',
                icon: 'test-icon',
                disabled: true,
            };
            const testInput = new Input(config);

            expect(testInput.value).toBe('test value');
            expect(testInput.field).toBe('testField');
            expect(testInput.disabled).toBe(true);
            expect(testInput.config.icon).toBe('test-icon');
        });

        it('should generate random id when not provided', () => {
            const input1 = new Input();
            const input2 = new Input();

            expect(input1.id).toBeDefined();
            expect(input2.id).toBeDefined();
            expect(input1.id).not.toBe(input2.id);
        });

        it('should use provided id', () => {
            const customId = 'custom-id';
            const testInput = new Input({ id: customId });

            expect(testInput.id).toBe(customId);
        });

        it('should use id as field when field not provided', () => {
            const customId = 'custom-id';
            const testInput = new Input({ id: customId });

            expect(testInput.field).toBe(customId);
        });
    });

    describe('value management', () => {
        it('has a value', () => {
            expect(input.value).toBe('test');
        });

        it('can set value using setValue method', async () => {
            await input.setValue('new value');
            expect(input.value).toBe('new value');
            expect(input.pristine).toBe(false);
        });

        it('can set value without marking dirty', async () => {
            await input.setValue('new value', { markDirty: false });
            expect(input.value).toBe('new value');
            expect(input.pristine).toBe(true);
        });

        it('notifies changes when set value', () => {
            const callback = vi.fn();
            input.onChange(callback);
            input.value = 'test2';
            expect(callback).toHaveBeenCalled();
        });

        it('notifies changes when using setValue', () => {
            const callback = vi.fn();
            input.onChange(callback);
            input.setValue('test2');
            expect(callback).toHaveBeenCalled();
        });
    });

    describe('state management', () => {
        it('should manage loading state', () => {
            expect(input.loading).toBe(false);

            input.setLoading(true);
            expect(input.loading).toBe(true);
        });

        it('should manage disabled state', () => {
            expect(input.disabled).toBe(false);

            input.setDisabled(true);
            expect(input.disabled).toBe(true);
        });

        it('should manage errors state', () => {
            expect(input.errors).toEqual([]);
            expect(input.valid).toBe(true);

            input.setErrors(['Error 1', 'Error 2']);
            expect(input.errors).toEqual(['Error 1', 'Error 2']);
            expect(input.valid).toBe(false);
        });

        it('should notify changes when state changes', () => {
            const callback = vi.fn();
            input.onChange(callback);

            input.setLoading(true);
            expect(callback).toHaveBeenCalled();

            callback.mockClear();
            input.setDisabled(true);
            expect(callback).toHaveBeenCalled();

            callback.mockClear();
            input.setErrors(['error']);
            expect(callback).toHaveBeenCalled();
        });
    });

    describe('validations', () => {
        it('can have rules', async () => {
            const required = new Required('Name is required');
            input.value = '';
            input.addRule(required);
            const isValid = await input.validate();
            expect(isValid).toBe(false);
            expect(input.valid).toBe(false);
            expect(input.errors).toContain(required.message);
        });

        it('validates successfully with valid value', async () => {
            const required = new Required('Name is required');
            input.value = 'valid value';
            input.addRule(required);
            const isValid = await input.validate();
            expect(isValid).toBe(true);
            expect(input.valid).toBe(true);
            expect(input.errors).toHaveLength(0);
        });

        it('handles multiple rules', async () => {
            const required1 = new Required('First rule');
            const required2 = new Required('Second rule');
            input.value = '';
            input.addRule(required1);
            input.addRule(required2);
            const isValid = await input.validate();
            expect(isValid).toBe(false);
            expect(input.valid).toBe(false);
            expect(input.errors).toHaveLength(2);
            expect(input.errors).toContain('First rule');
            expect(input.errors).toContain('Second rule');
        });

        it('can remove rules', async () => {
            const required = new Required('Name is required');
            input.addRule(required);
            input.removeRule(required);
            input.value = '';
            const isValid = await input.validate();
            expect(isValid).toBe(true);
            expect(input.errors).toHaveLength(0);
        });

        it('can clear all rules', async () => {
            const required1 = new Required('First rule');
            const required2 = new Required('Second rule');
            input.addRule(required1);
            input.addRule(required2);
            input.clearRules();
            input.value = '';
            const isValid = await input.validate();
            expect(isValid).toBe(true);
            expect(input.errors).toHaveLength(0);
        });

        it('notifies changes when validation runs', async () => {
            const callback = vi.fn();
            const required = new Required('Name is required');
            input.value = '';
            input.addRule(required);
            input.onChange(callback);

            await input.validate();

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('theme management', () => {
        it('should update theme based on config', () => {
            const testInput = new Input({
                icon: 'test-icon',
                trailing_icon: 'trailing-icon',
            });

            expect(testInput.theme.hasIcon).toBe(true);
            expect(testInput.theme.hasTrailingIcon).toBe(true);
        });

        it('should update theme when loading state changes', () => {
            input.setLoading(true);
            expect(input.theme.hasTrailingIcon).toBe(true);
        });

        it('should show trailing icon when initialized with loading true', () => {
            const loadingInput = new Input({
                loading: true,
            });
            expect(loadingInput.loading).toBe(true);
            expect(loadingInput.theme.hasTrailingIcon).toBe(true);
        });

        it('should update theme when errors change', () => {
            input.setErrors(['error']);
            expect(input.theme.hasErrors).toBe(true);
        });

        it('should allow setting dynamic width', () => {
            input.setDynamicWidth('200px');
            expect(input.theme.inputWidth).toBe('200px');
        });
    });

    describe('form integration', () => {
        it('should sync value to form', () => {
            const form = {
                data: {} as Record<string, unknown>,
                errors: {} as Record<string, string[]>,
                pristine: true,
            };

            input.setValue('test value');
            input.syncToForm(form);

            expect(form.data[input.field]).toBe('test value');
            expect(form.pristine).toBe(false);
        });

        it('should update from form data', () => {
            const form = {
                data: { [input.field]: 'form value' } as Record<string, unknown>,
                errors: { [input.field]: ['form error'] } as Record<string, string[]>,
                pristine: false,
            };

            input.updateFromForm(form);

            expect(input.value).toBe('form value');
            expect(input.errors).toEqual(['form error']);
            expect(input.valid).toBe(false);
        });

        it('should handle form errors with custom error path', () => {
            const form = {
                data: {} as Record<string, unknown>,
                errors: { 'custom.path': ['custom error'] } as Record<string, string[]>,
                pristine: true,
            };

            input.updateFromForm(form, 'custom.path');

            expect(input.errors).toEqual(['custom error']);
            expect(input.valid).toBe(false);
        });

        it('should not mark form dirty when updating value without markDirty flag', async () => {
            const form = {
                data: {} as Record<string, unknown>,
                errors: {} as Record<string, string[]>,
                pristine: true,
            };

            await input.setValue('test', { markDirty: false });
            input.syncToForm(form);

            expect(form.data[input.field]).toBe('test');
            expect(form.pristine).toBe(true);
        });
    });

    describe('config management', () => {
        it('should allow updating config', () => {
            input.updateConfig({
                icon: 'new-icon',
                trailing_icon: 'new-trailing',
            });

            expect(input.config.icon).toBe('new-icon');
            expect(input.config.trailing_icon).toBe('new-trailing');
            expect(input.theme.hasIcon).toBe(true);
            expect(input.theme.hasTrailingIcon).toBe(true);
        });

        it('should provide readonly config access', () => {
            const config = input.config;
            expect(config).toBeDefined();
            expect(typeof config).toBe('object');
        });

        it('should provide readonly theme access', () => {
            const theme = input.theme;
            expect(theme).toBeDefined();
            expect(typeof theme).toBe('object');
            expect(theme.inputWidth).toBeDefined();
        });
    });

    describe('input handling', () => {
        it('should handle input events without operations', async () => {
            const mockEvent = {
                target: { value: 'new input value' },
            } as unknown as Event;

            await input.handleInput(mockEvent);

            expect(input.value).toBe('new input value');
        });

        it('should handle operations when app and context are provided', async () => {
            const mockApp = {
                handleOperations: vi.fn().mockResolvedValue({ value: 'transformed' }),
            };
            const mockContext = {
                set: vi.fn(),
                get: vi.fn(),
            };
            const mockForm = {
                data: {} as Record<string, unknown>,
                errors: {} as Record<string, string[]>,
                pristine: true,
            };

            const testInput = new Input({
                app: mockApp as unknown as Application,
                context: mockContext as unknown as Context,
                form: mockForm,
                operations: { test: 'operation' } as import('@/lib/core/contracts.js').Operations,
            });

            const mockEvent = {
                target: { value: 'original' },
            } as unknown as Event;

            await testInput.handleInput(mockEvent);

            expect(mockContext.set).toHaveBeenCalled();
            expect(mockApp.handleOperations).toHaveBeenCalled();
            expect(testInput.value).toBe('transformed');
        });
    });

    describe('event system', () => {
        it('should dispatch valueChanged events', async () => {
            const eventSpy = vi.fn();
            input.on('valueChanged', eventSpy);

            await input.setValue('new value');

            expect(eventSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    field: input.field,
                    oldValue: 'test',
                    newValue: 'new value',
                    source: 'program',
                    timestamp: expect.any(Number),
                }),
            );
        });

        it('should dispatch validation events', async () => {
            const startSpy = vi.fn();
            const failedSpy = vi.fn();
            const passedSpy = vi.fn();

            input.on('validationStarted', startSpy);
            input.on('validationFailed', failedSpy);
            input.on('validationPassed', passedSpy);

            const required = new Required('Required field');
            input.addRule(required);

            // Test validation failure
            await input.setValue('');
            await input.validate();

            expect(startSpy).toHaveBeenCalled();
            expect(failedSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    field: input.field,
                    value: '',
                    errors: ['Required field'],
                    rules: [required],
                }),
            );

            // Test validation success
            await input.setValue('valid value');
            await input.validate();

            expect(passedSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    field: input.field,
                    value: 'valid value',
                    rules: [required],
                }),
            );
        });

        it('should support wildcard event listeners', async () => {
            const wildcardSpy = vi.fn();
            input.on('*', wildcardSpy);

            await input.setValue('test value');

            expect(wildcardSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    field: input.field,
                    newValue: 'test value',
                    eventName: 'valueChanged',
                }),
            );
        });

        it('should allow removing event listeners', async () => {
            const eventSpy = vi.fn();
            input.on('valueChanged', eventSpy);
            input.off('valueChanged', eventSpy);

            await input.setValue('new value');

            expect(eventSpy).not.toHaveBeenCalled();
        });

        it('should dispatch inputReceived events for user input', async () => {
            const inputSpy = vi.fn();
            input.on('inputReceived', inputSpy);

            const mockEvent = {
                target: { value: 'user input' },
            } as unknown as Event;

            await input.setValue('user input', { event: mockEvent, source: 'user' });

            expect(inputSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    field: input.field,
                    value: 'user input',
                    event: mockEvent,
                    source: 'user',
                }),
            );
        });
    });
});
