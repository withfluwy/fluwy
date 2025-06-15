import { ChangeNotifier } from '@/lib/core/adapters/change-notifier.js';
import type { Rule } from '@/lib/core/rules/rule.js';
import type { InputProps } from '../contracts.js';
import type { FormState } from '@/lib/components/forms/form/types.js';
import type { Context, Operations, InputEvent } from '@/lib/core/contracts.js';
import type { Application } from '@/lib/core/app/index.js';
import { Random } from '@/lib/core/utils/index.js';

export interface InputState {
    value: unknown;
    valid: boolean;
    errors: string[];
    pristine: boolean;
    loading: boolean;
    disabled: boolean;
}

export interface InputConfig extends Partial<InputProps> {
    id?: string;
    field?: string;
    initialValue?: unknown;
    form?: FormState;
    context?: Context;
    app?: Application;
    operations?: Operations;
}

export interface InputTheme {
    inputWidth: string;
    hasIcon: boolean;
    hasTrailingIcon: boolean;
    hasErrors: boolean;
}

export interface InputEventData {
    field: string;
    oldValue?: unknown;
    newValue?: unknown;
    value?: unknown;
    errors?: string[];
    rules?: Rule[];
    event?: Event;
    source?: 'user' | 'program' | 'form';
    timestamp: number;
    result?: unknown;
    error?: unknown;
    eventName?: string;
}

/**
 * Input domain model that encapsulates all input logic, state, and behavior
 * following Domain-Driven Design principles.
 */
export class Input<T = unknown> extends ChangeNotifier {
    private _state: InputState;
    private _rules: Set<Rule> = new Set();
    private _config: InputConfig;
    private _theme: InputTheme;
    private _id: string;
    private _eventListeners: Map<string, Array<(data: InputEventData) => void>> = new Map();

    constructor(config: InputConfig = {}) {
        super();

        this._id = config.id || Random.id();
        this._config = { ...config };

        this._state = {
            value: config.initialValue,
            valid: true,
            errors: [],
            pristine: true,
            loading: config.loading || false,
            disabled: config.disabled || false,
        };

        this._theme = {
            inputWidth: 'auto',
            hasIcon: Boolean(config.icon),
            hasTrailingIcon: Boolean(config.trailing_icon) || Boolean(config.loading),
            hasErrors: false,
        };
    }

    // Getters for state
    get id(): string {
        return this._id;
    }

    get value(): T | undefined {
        return this._state.value as T;
    }

    set value(value: T | undefined) {
        this.setValue(value, { markDirty: true });
    }

    get valid(): boolean {
        return this._state.valid;
    }

    get errors(): string[] {
        return [...this._state.errors];
    }

    get pristine(): boolean {
        return this._state.pristine;
    }

    get loading(): boolean {
        return this._state.loading;
    }

    get disabled(): boolean {
        return this._state.disabled;
    }

    get field(): string {
        return this._config.field || this._id;
    }

    get config(): Readonly<InputConfig> {
        return { ...this._config };
    }

    get theme(): Readonly<InputTheme> {
        return { ...this._theme };
    }

    // Event system
    on(eventName: string, listener: (data: InputEventData) => void): void {
        if (!this._eventListeners.has(eventName)) {
            this._eventListeners.set(eventName, []);
        }
        this._eventListeners.get(eventName)!.push(listener);
    }

    off(eventName: string, listener: (data: InputEventData) => void): void {
        const listeners = this._eventListeners.get(eventName);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    private dispatch(eventName: string, data: Partial<InputEventData>): void {
        const eventData: InputEventData = {
            field: this.field,
            timestamp: Date.now(),
            ...data,
        };

        // Dispatch to specific event listeners
        const listeners = this._eventListeners.get(eventName);
        if (listeners) {
            listeners.forEach((listener) => listener(eventData));
        }

        // Dispatch to wildcard listeners
        const wildcardListeners = this._eventListeners.get('*');
        if (wildcardListeners) {
            wildcardListeners.forEach((listener) => listener({ ...eventData, eventName } as InputEventData));
        }
    }

    // Enhanced setValue method that handles all input processing
    async setValue(
        value: T | undefined,
        options: {
            event?: Event;
            markDirty?: boolean;
            runOperations?: boolean;
            source?: 'user' | 'program' | 'form';
        } = {},
    ): Promise<void> {
        const {
            event,
            markDirty = true,
            runOperations = Boolean(event),
            source = event ? 'user' : 'program',
        } = options;

        const oldValue = this._state.value;

        // Dispatch input received event for user input
        if (event) {
            this.dispatch('inputReceived', {
                value,
                event,
                source,
                oldValue,
            });
        }

        // Handle operations if enabled and configured
        if (runOperations && this._config.operations && this._config.app && this._config.context) {
            try {
                // Set up context for operations
                this._config.context.set('input', {
                    field: this.field,
                    value: value,
                    event: event,
                    form: this._config.form,
                    valid: this._state.valid,
                } as InputEvent);

                this.dispatch('operationsStarted', { value, source });

                // Execute operations and capture result
                const result = await this._config.app.handleOperations(this._config.operations, this._config.context);

                // Check if operations returned a transformed value or validation result
                if (result && typeof result === 'object') {
                    // If operation returned { valid: false }, don't update value
                    if (result.valid === false) {
                        this.dispatch('operationsRejected', { value, source, result });
                        return;
                    }

                    // If operation returned a transformed value, use it
                    if ('value' in result) {
                        value = result.value as T;
                        this.dispatch('operationsTransformed', {
                            oldValue,
                            newValue: value,
                            source,
                            result,
                        });
                    }
                }

                this.dispatch('operationsCompleted', { value, source, result });
            } catch (error) {
                this.dispatch('operationsError', { value, source, error });
                console.error('Error executing input operations:', error);
                // Don't update value if operations failed
                return;
            }
        }

        // Update the value
        this._state.value = value;

        // Handle dirty tracking
        if (markDirty && oldValue !== value) {
            this._state.pristine = false;
        }

        // Update theme and notify changes
        this.updateTheme();
        this.notifyChanges();

        // Sync to form if available
        if (this._config.form) {
            this.syncToForm(this._config.form);
        }

        // Dispatch value changed event
        this.dispatch('valueChanged', {
            oldValue,
            newValue: value,
            source,
        });
    }

    setLoading(loading: boolean): void {
        this._state.loading = loading;
        this.updateTheme();
        this.notifyChanges();
    }

    setDisabled(disabled: boolean): void {
        this._state.disabled = disabled;
        this.notifyChanges();
    }

    setErrors(errors: string[]): void {
        this._state.errors = [...errors];
        this._state.valid = errors.length === 0;
        this.updateTheme();
        this.notifyChanges();
    }

    updateConfig(config: Partial<InputConfig>): void {
        this._config = { ...this._config, ...config };
        this.updateTheme();
        this.notifyChanges();
    }

    // Validation methods
    addRule(rule: Rule): void {
        this._rules.add(rule);
    }

    removeRule(rule: Rule): void {
        this._rules.delete(rule);
    }

    clearRules(): void {
        this._rules.clear();
    }

    async validate(): Promise<boolean> {
        this.dispatch('validationStarted', { value: this._state.value, rules: Array.from(this._rules) });

        const errors: string[] = [];

        for (const rule of this._rules) {
            const isValid = await rule.check(this._state.value);
            if (!isValid) {
                errors.push(rule.message);
            }
        }

        this._state.errors = errors;
        this._state.valid = errors.length === 0;
        this.updateTheme();
        this.notifyChanges();

        // Dispatch validation events
        if (this._state.valid) {
            this.dispatch('validationPassed', { value: this._state.value, rules: Array.from(this._rules) });
        } else {
            this.dispatch('validationFailed', {
                value: this._state.value,
                errors: [...errors],
                rules: Array.from(this._rules),
            });
        }

        return this._state.valid;
    }

    // Theme and UI state management
    setDynamicWidth(width: string): void {
        this._theme.inputWidth = width;
        this.notifyChanges();
    }

    private updateTheme(): void {
        this._theme.hasIcon = Boolean(this._config.icon);
        this._theme.hasTrailingIcon = Boolean(this._config.trailing_icon) || this._state.loading;
        this._theme.hasErrors = this._state.errors.length > 0;
    }

    // Form integration
    updateFromForm(form: FormState, errorPath?: string): void {
        const fieldPath = errorPath || this.field;
        const formValue = form.data[this.field];
        const formErrors = form.errors[fieldPath] || [];

        // Update value if it changed in the form
        if (formValue !== this._state.value) {
            this.setValue(formValue, { markDirty: false, source: 'form' });
        }

        // Update errors from form
        if (JSON.stringify(formErrors) !== JSON.stringify(this._state.errors)) {
            this.setErrors(formErrors);
        }
    }

    syncToForm(form: FormState): void {
        form.data[this.field] = this._state.value;
        if (!this._state.pristine) {
            form.pristine = false;
        }
    }

    // Simplified input event handling - delegates to setValue
    async handleInput(event: Event): Promise<void> {
        const newValue = (event.target as HTMLInputElement).value;
        await this.setValue(newValue as T, { event, source: 'user' });
    }
}
