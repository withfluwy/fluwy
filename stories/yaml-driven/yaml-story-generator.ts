import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from './YamlRenderer.svelte';
import { yamlLoader, type YamlComponentSchema, type YamlTestSchema } from './yaml-loader.js';

/**
 * Generate Storybook stories from YAML schemas
 */
export class YamlStoryGenerator {
  /**
   * Create a meta configuration for YAML-driven stories
   */
  static createMeta(title: string, description?: string): Meta<YamlRenderer> {
    return {
      title,
      component: YamlRenderer,
      parameters: {
        docs: {
          description: {
            component: description || 'Component rendered from YAML schema configuration',
          },
        },
      },
      argTypes: {
        schema: {
          control: 'object',
          description: 'YAML component schema configuration',
        },
        theme: {
          control: 'object',
          description: 'Theme configuration object',
        },
        context: {
          control: 'object',
          description: 'Additional context data',
        },
      },
    };
  }

  /**
   * Create a story from a YAML component schema
   */
  static createStory(
    schema: YamlComponentSchema,
    theme: Record<string, any> = {},
    context: Record<string, any> = {}
  ): StoryObj<YamlRenderer> {
    return {
      args: {
        schema,
        theme,
        context,
      },
      parameters: {
        docs: {
          description: {
            story: schema.description || `${schema.name} component from YAML schema`,
          },
        },
      },
    };
  }

  /**
   * Generate multiple stories from a YAML test schema
   */
  static generateStoriesFromSchema(testSchema: YamlTestSchema): Record<string, StoryObj<YamlRenderer>> {
    const stories: Record<string, StoryObj<YamlRenderer>> = {};

    testSchema.components.forEach((componentSchema, index) => {
      const storyName = this.generateStoryName(componentSchema, index);
      stories[storyName] = this.createStory(
        componentSchema,
        testSchema.theme || {},
        {}
      );
    });

    return stories;
  }

  /**
   * Generate a unique story name from component schema
   */
  private static generateStoryName(schema: YamlComponentSchema, index: number): string {
    const baseName = schema.name.charAt(0).toUpperCase() + schema.name.slice(1);
    
    if (schema.props?.variant) {
      return `${baseName}${schema.props.variant.charAt(0).toUpperCase() + schema.props.variant.slice(1)}`;
    }
    
    if (schema.props?.text) {
      const textPart = schema.props.text.replace(/[^a-zA-Z0-9]/g, '');
      return `${baseName}${textPart}`;
    }

    return `${baseName}${index + 1}`;
  }

  /**
   * Create stories with variants for a component
   */
  static createVariantStories(
    baseSchema: YamlComponentSchema,
    variants: Record<string, any>,
    theme: Record<string, any> = {}
  ): Record<string, StoryObj<YamlRenderer>> {
    const stories: Record<string, StoryObj<YamlRenderer>> = {};

    Object.entries(variants).forEach(([variantName, variantProps]) => {
      const variantSchema: YamlComponentSchema = {
        ...baseSchema,
        props: {
          ...baseSchema.props,
          ...variantProps,
        },
        description: `${baseSchema.name} with ${variantName} variant`,
      };

      const storyName = `${baseSchema.name.charAt(0).toUpperCase() + baseSchema.name.slice(1)}${variantName.charAt(0).toUpperCase() + variantName.slice(1)}`;
      
      stories[storyName] = this.createStory(variantSchema, theme);
    });

    return stories;
  }

  /**
   * Load and generate stories from a YAML file
   */
  static async loadAndGenerateStories(
    yamlFilePath: string,
    storyTitle: string
  ): Promise<{
    meta: Meta<YamlRenderer>;
    stories: Record<string, StoryObj<YamlRenderer>>;
  }> {
    try {
      const testSchema = await yamlLoader.loadSchema(yamlFilePath);
      
      const meta = this.createMeta(storyTitle, testSchema.description);
      const stories = this.generateStoriesFromSchema(testSchema);

      return { meta, stories };
    } catch (error) {
      console.error(`Failed to generate stories from ${yamlFilePath}:`, error);
      
      // Return fallback meta and empty stories
      return {
        meta: this.createMeta(storyTitle, 'Failed to load YAML schema'),
        stories: {
          Error: {
            args: {
              schema: {
                name: 'div',
                props: {
                  class: 'p-4 bg-red-100 border border-red-400 rounded',
                  content: `Failed to load YAML schema from ${yamlFilePath}: ${error}`,
                },
                description: 'Error loading schema',
              },
              theme: {},
              context: {},
            },
          },
        },
      };
    }
  }
}

/**
 * Helper function to create a complete story file export
 */
export function createYamlStoryExport(
  yamlFilePath: string,
  storyTitle: string
): Promise<{
  default: Meta<YamlRenderer>;
  [key: string]: any;
}> {
  return YamlStoryGenerator.loadAndGenerateStories(yamlFilePath, storyTitle).then(
    ({ meta, stories }) => ({
      default: meta,
      ...stories,
    })
  );
}
