<script lang="ts">
  import { onMount } from 'svelte';
  import YamlRenderer from './YamlRenderer.svelte';
  import type { YamlComponentSchema } from './yaml-loader.js';

  export let schema: YamlComponentSchema;
  export let theme: Record<string, any> = {};
  export let context: Record<string, any> = {};
  export let showMetrics: boolean = true;

  let renderTime = 0;
  let componentCount = 0;
  let memoryUsage = 0;
  let startTime = 0;
  let isRendering = false;

  // Count components in schema
  function countComponents(obj: any): number {
    let count = 0;
    
    if (obj && typeof obj === 'object') {
      if (obj.name) {
        count = 1;
      }
      
      if (obj.content) {
        if (Array.isArray(obj.content)) {
          obj.content.forEach((item: any) => {
            count += countComponents(item);
          });
        } else if (typeof obj.content === 'object') {
          count += countComponents(obj.content);
        }
      }
      
      if (obj.props?.content) {
        count += countComponents(obj.props.content);
      }
      
      // Handle direct component definitions
      Object.values(obj).forEach((value: any) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          count += countComponents(value);
        }
      });
    }
    
    return count;
  }

  // Measure memory usage (if available)
  function measureMemory(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  // Start performance measurement
  function startMeasurement() {
    isRendering = true;
    startTime = performance.now();
    componentCount = countComponents(schema);
  }

  // End performance measurement
  function endMeasurement() {
    if (isRendering) {
      renderTime = performance.now() - startTime;
      memoryUsage = measureMemory();
      isRendering = false;
    }
  }

  // Reactive measurement when schema changes
  $: if (schema) {
    startMeasurement();
  }

  onMount(() => {
    // Measure after initial render
    setTimeout(endMeasurement, 0);
  });

  // Format numbers for display
  function formatTime(ms: number): string {
    if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }

  function formatMemory(mb: number): string {
    if (mb === 0) return 'N/A';
    if (mb < 1) return `${(mb * 1024).toFixed(0)}KB`;
    return `${mb.toFixed(2)}MB`;
  }

  // Performance rating
  $: performanceRating = (() => {
    if (renderTime < 10) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (renderTime < 50) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (renderTime < 100) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Slow', color: 'text-red-600', bg: 'bg-red-50' };
  })();
</script>

<div class="performance-monitor">
  <!-- Performance metrics display -->
  {#if showMetrics && renderTime > 0}
    <div class="mb-4 p-4 bg-gray-50 rounded-lg border">
      <h4 class="text-sm font-semibold text-gray-700 mb-3">Performance Metrics</h4>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="text-center">
          <div class="text-xs text-gray-500 mb-1">Render Time</div>
          <div class="font-mono font-semibold {performanceRating.color}">
            {formatTime(renderTime)}
          </div>
        </div>
        
        <div class="text-center">
          <div class="text-xs text-gray-500 mb-1">Components</div>
          <div class="font-mono font-semibold text-gray-700">
            {componentCount}
          </div>
        </div>
        
        <div class="text-center">
          <div class="text-xs text-gray-500 mb-1">Memory</div>
          <div class="font-mono font-semibold text-gray-700">
            {formatMemory(memoryUsage)}
          </div>
        </div>
        
        <div class="text-center">
          <div class="text-xs text-gray-500 mb-1">Rating</div>
          <div class="inline-block px-2 py-1 rounded text-xs font-semibold {performanceRating.color} {performanceRating.bg}">
            {performanceRating.label}
          </div>
        </div>
      </div>
      
      <!-- Performance tips -->
      {#if renderTime > 50}
        <div class="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Performance Tip:</strong> 
          {#if componentCount > 100}
            Consider reducing the number of components or implementing virtualization for large lists.
          {:else if renderTime > 100}
            This component structure is complex. Consider simplifying the nesting or splitting into smaller components.
          {:else}
            Render time is acceptable but could be optimized further.
          {/if}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Render the actual component -->
  <div on:load={endMeasurement}>
    <YamlRenderer {schema} {theme} {context} />
  </div>
</div>

<style>
  .performance-monitor {
    position: relative;
  }
  
  /* Loading indicator */
  .performance-monitor:has([data-loading]) {
    opacity: 0.7;
  }
</style>
