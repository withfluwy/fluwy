import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from './YamlRenderer.svelte';

// Introduction to YAML-driven Storybook
const meta: Meta<YamlRenderer> = {
  title: 'YAML Driven/Introduction',
  component: YamlRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# YAML-Driven Storybook POC

This is a proof of concept for testing components through YAML schema configuration instead of traditional component imports.

## How it works

1. **YAML Schema**: Components are defined in YAML format
2. **Universal Renderer**: The YamlRenderer component can render any Fluwy component
3. **Theme Integration**: Full integration with Fluwy's theme system
4. **Auto-generation**: Stories can be automatically generated from theme files

## Benefits

- **Rapid Testing**: No need to write individual story files
- **Schema-driven**: Components tested as they would be used in production
- **Theme Testing**: Comprehensive theme validation
- **Consistency**: Same rendering system as the actual application

## Examples

The stories in this section demonstrate various aspects of the YAML-driven approach.
        `,
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

export default meta;
type Story = StoryObj<YamlRenderer>;

// Simple button example
export const SimpleButton: Story = {
  args: {
    schema: {
      name: 'button',
      props: {
        text: 'Hello YAML!',
        variant: 'filled',
        size: 'md'
      },
      description: 'A simple button rendered from YAML schema'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic button component defined entirely through YAML schema configuration.',
      },
    },
  },
};

// Text component example
export const SimpleText: Story = {
  args: {
    schema: {
      name: 'text',
      props: {
        content: 'This text is rendered from a YAML schema!',
        class: 'text-lg font-semibold text-blue-600'
      },
      description: 'Text component from YAML'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'A text component with custom styling defined in YAML.',
      },
    },
  },
};

// Container with multiple components
export const ComponentContainer: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'p-6 bg-gray-50 rounded-lg space-y-4 max-w-md mx-auto',
        content: [
          {
            h2: {
              content: 'YAML Component Demo',
              class: 'text-2xl font-bold text-gray-800 mb-4'
            }
          },
          {
            p: {
              content: 'This entire component structure is defined in YAML schema format.',
              class: 'text-gray-600 mb-4'
            }
          },
          {
            div: {
              class: 'space-x-2',
              content: [
                {
                  button: {
                    text: 'Primary',
                    variant: 'filled',
                    size: 'sm'
                  }
                },
                {
                  button: {
                    text: 'Secondary',
                    variant: 'outline',
                    size: 'sm'
                  }
                }
              ]
            }
          }
        ]
      },
      description: 'Complex component structure from YAML'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'A complex component structure with nested elements, all defined through YAML schema.',
      },
    },
  },
};

// Example with theme integration
export const ThemedComponents: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'p-6 space-y-4',
        content: [
          {
            h3: {
              content: 'Themed Components',
              class: 'text-xl font-bold mb-4'
            }
          },
          {
            button: {
              text: 'Primary Button',
              variant: 'primary',
              size: 'md'
            }
          },
          {
            button: {
              text: 'Secondary Button',
              variant: 'secondary',
              size: 'md'
            }
          },
          {
            div: {
              class: 'p-4 rounded bg-primary-100 border border-primary-300',
              content: {
                p: {
                  content: 'This container uses theme colors!',
                  class: 'text-primary-800'
                }
              }
            }
          }
        ]
      },
      description: 'Components using theme configuration'
    },
    theme: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          100: '#dbeafe',
          300: '#93c5fd',
          800: '#1e40af'
        },
        secondary: {
          DEFAULT: '#10b981',
          500: '#10b981'
        }
      },
      forms: {
        button: {
          variants: {
            primary: 'bg-primary-500 hover:bg-primary-600 text-white',
            secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white'
          }
        }
      }
    },
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Components that use theme configuration for styling. Try editing the theme object in the controls!',
      },
    },
  },
};

// Error handling example
export const UnknownComponent: Story = {
  args: {
    schema: {
      name: 'unknown-component',
      props: {
        text: 'This component does not exist',
        someProperty: 'value'
      },
      description: 'Example of unknown component handling'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the system handles unknown or unregistered components with helpful error messages.',
      },
    },
  },
};
