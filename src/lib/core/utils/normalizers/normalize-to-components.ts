import type { Any, Template } from '@/lib/core/contracts.js';
import { loop_expression } from '@/lib/core/controls/loop/index.js';
import { if_expression } from '@/lib/core/controls/condition/index.js';

export interface ComponentSchema {
    name: string;
    template: Template | false;
}

/**
 * List of names that are reserved for component props and shouldn't be treated as component definitions
 */
export const RESERVED_PROP_NAMES = ['content', 'class', 'vars', 'id'] as const;

/**
 * Checks if an object appears to be component props
 * Component props are objects with simple key-value pairs that shouldn't be normalized
 */
function isComponentProps(obj: Record<string, unknown>): boolean {
    // Handle slots specially
    if ('slot' in obj) {
        return false;
    }
    // If the object has only reserved props, treat it as props
    const hasOnlyReservedProps = Object.keys(obj).every((key) => RESERVED_PROP_NAMES.includes(key as Any));
    return hasOnlyReservedProps;
}

/**
 * Normalize a template into an array of component schemas.
 * Handles primitive values, arrays, and objects, with special handling for conditional statements.
 */
export function normalizeToComponents(input: Template): ComponentSchema[] {
    // Handle primitive values
    if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return [createComponent('text', input)];
    }

    // Handle arrays
    if (Array.isArray(input)) {
        return input
            .map((item): ComponentSchema[] => {
                if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                    // Process objects within arrays (potentially containing conditions)
                    return processConditions(Object.entries(item));
                }
                // Handle primitive values in arrays
                return [createComponent('text', item)];
            })
            .flat();
    }

    // Handle objects
    if (typeof input === 'object' && input !== null) {
        // Handle slots specially
        if ('slot' in input) {
            return [createComponent('slot', input.slot)];
        }
        // Check if this is component props that shouldn't be normalized
        if (isComponentProps(input as Record<string, unknown>)) {
            return [];
        }
        // Filter out reserved props before processing
        const entries = Object.entries(input).filter(([key]) => !RESERVED_PROP_NAMES.includes(key as Any));
        return processConditions(entries);
    }

    return [];
}

type ObjectEntry = [string, unknown];

/**
 * Checks if a key continues the current condition chain
 */
function continuesConditionChain(key: string): boolean {
    return key.startsWith('else if ') || key === 'else';
}

/**
 * Creates a component schema with the given name and props
 */
function createComponent(name: string, props: Template | false): ComponentSchema {
    return { name, template: props };
}

/**
 * Process a list of object entries and group consecutive conditional statements
 * into single condition components
 */
function processConditions(entries: ObjectEntry[]): ComponentSchema[] {
    const result: ComponentSchema[] = [];
    let currentCondition: Record<string, unknown> | null = null;

    for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i];

        if (if_expression.check(key)) {
            // Start or continue a condition group
            currentCondition ??= {};
            currentCondition[key] = value;

            // Check if this is the last entry or if the next entry doesn't continue the condition
            const nextEntry = entries[i + 1];
            const shouldEndCondition = !nextEntry || !continuesConditionChain(nextEntry[0]);

            if (shouldEndCondition) {
                result.push(createComponent('condition', currentCondition));
                currentCondition = null;
            }
            continue;
        }

        // Handle loop expressions
        if (loop_expression.check(key)) {
            result.push(createComponent('loop', { [key]: value }));
            continue;
        }

        // Handle non-conditional entries
        result.push(createComponent(key, value));
    }

    return result;
}
