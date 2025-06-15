<script lang="ts">
  import { createApp, type Any } from '../../src/lib/index.js';
  import { setContext } from 'svelte';
  import type { YamlComponentSchema } from './yaml-loader.js';
  import { YamlValidator, type ValidationResult } from './YamlValidator.js';

  export let schema: YamlComponentSchema;
  export let theme: Record<string, any> = {};
  export let context: Record<string, any> = {};
  export let showValidation: boolean = false;

  // Create the Fluwy app instance
  const app = createApp();

  // Set up theme context
  setContext('theme', theme);

  // Validate the schema
  $: validationResult = YamlValidator.validateComponent(schema, 'component');
  $: hasErrors = validationResult.some(v => v.severity === 'error');
  $: hasWarnings = validationResult.some(v => v.severity === 'warning');

  // Prepare component props
  $: componentProps = {
    ...schema.props,
    ...(schema.content && { content: schema.content }),
  };

  // Get the component from the app registry
  $: Component = app.hasComponent(schema.name) ? app.getComponent(schema.name) : null;

  // Fallback for unknown components
  $: isUnknownComponent = !Component;
</script>

<div class="yaml-renderer-container">
  <!-- Validation feedback (if enabled) -->
  {#if showValidation && (hasErrors || hasWarnings)}
    <div class="mb-4 p-3 rounded-lg border {hasErrors ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}">
      <div class="flex items-center mb-2">
        <span class="text-sm font-medium {hasErrors ? 'text-red-800' : 'text-yellow-800'}">
          {hasErrors ? '❌ Validation Errors' : '⚠️ Validation Warnings'}
        </span>
      </div>
      <ul class="text-xs {hasErrors ? 'text-red-700' : 'text-yellow-700'} space-y-1">
        {#each validationResult as validation}
          <li>• {validation.message}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <!-- Component rendering -->
  {#if Component}
    <Component {...componentProps} />
  {:else if isUnknownComponent}
    <div class="border border-red-500 bg-red-50 p-4 rounded-lg">
      <h3 class="text-red-800 font-bold">Component Not Found</h3>
      <p class="text-red-700">Component "{schema.name}" is not registered in the Fluwy app.</p>

      <!-- Validation info for unknown components -->
      {#if validationResult.length > 0}
        <div class="mt-3 p-2 bg-red-100 rounded">
          <p class="text-xs text-red-600 font-medium mb-1">Validation Issues:</p>
          <ul class="text-xs text-red-600 space-y-1">
            {#each validationResult as validation}
              <li>• {validation.message}</li>
            {/each}
          </ul>
        </div>
      {/if}

      <details class="mt-3">
        <summary class="cursor-pointer text-red-600 text-sm">Show Component Details</summary>
        <div class="mt-2 space-y-2">
          <div>
            <p class="text-xs font-medium text-red-700">Schema:</p>
            <pre class="text-xs bg-red-100 p-2 rounded overflow-auto">{JSON.stringify(schema, null, 2)}</pre>
          </div>
          <div>
            <p class="text-xs font-medium text-red-700">Processed Props:</p>
            <pre class="text-xs bg-red-100 p-2 rounded overflow-auto">{JSON.stringify(componentProps, null, 2)}</pre>
          </div>
        </div>
      </details>
    </div>
  {/if}
</div>

<style>
  /* Ensure proper styling inheritance */
  :global(.storybook-yaml-renderer) {
    font-family: inherit;
  }
</style>
