import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from './YamlRenderer.svelte';
import { YamlStoryGenerator } from './yaml-story-generator.js';

// This story demonstrates the YAML schema loader functionality
const meta: Meta<YamlRenderer> = YamlStoryGenerator.createMeta(
  'YAML Driven/Schema Examples',
  'Examples of components rendered from various YAML schema formats'
);

export default meta;
type Story = StoryObj<YamlRenderer>;

// Example 1: Simple component schema
export const SimpleButton: Story = YamlStoryGenerator.createStory({
  name: 'button',
  props: {
    text: 'Click Me',
    variant: 'filled',
    size: 'md'
  },
  description: 'Simple button component from YAML schema'
});

// Example 2: Complex component with nested content
export const ComplexCard: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden',
    content: [
      {
        div: {
          class: 'p-6',
          content: [
            {
              h3: {
                content: 'Card Title',
                class: 'text-xl font-semibold text-gray-900 mb-2'
              }
            },
            {
              p: {
                content: 'This is a card component created from YAML schema with nested content structure.',
                class: 'text-gray-600 mb-4'
              }
            },
            {
              button: {
                text: 'Learn More',
                variant: 'outline',
                size: 'sm'
              }
            }
          ]
        }
      }
    ]
  },
  description: 'Complex card component with nested YAML structure'
});

// Example 3: Form components
export const FormExample: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'max-w-sm mx-auto p-6 bg-gray-50 rounded-lg',
    content: [
      {
        h2: {
          content: 'Contact Form',
          class: 'text-lg font-bold mb-4'
        }
      },
      {
        input: {
          label: 'Name',
          placeholder: 'Enter your name',
          class: 'mb-3'
        }
      },
      {
        input: {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
          class: 'mb-3'
        }
      },
      {
        button: {
          text: 'Submit',
          variant: 'filled',
          class: 'w-full'
        }
      }
    ]
  },
  description: 'Form components arranged via YAML schema'
});

// Example 4: Layout components
export const LayoutExample: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'min-h-64',
    content: [
      {
        header: {
          class: 'bg-blue-600 text-white p-4',
          content: {
            h1: {
              content: 'Header Section',
              class: 'text-xl font-bold'
            }
          }
        }
      },
      {
        div: {
          class: 'flex',
          content: [
            {
              sidebar: {
                class: 'w-64 bg-gray-200 p-4',
                content: {
                  p: {
                    content: 'Sidebar Content',
                    class: 'font-medium'
                  }
                }
              }
            },
            {
              div: {
                class: 'flex-1 p-4',
                content: {
                  p: {
                    content: 'Main content area created from YAML layout schema.',
                    class: 'text-gray-700'
                  }
                }
              }
            }
          ]
        }
      }
    ]
  },
  description: 'Layout structure defined in YAML schema'
});

// Example 5: Component with variants
export const ButtonVariants: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'space-x-2 p-4',
    content: [
      {
        button: {
          text: 'Filled',
          variant: 'filled'
        }
      },
      {
        button: {
          text: 'Outline',
          variant: 'outline'
        }
      },
      {
        button: {
          text: 'Ghost',
          variant: 'ghost'
        }
      },
      {
        button: {
          text: 'Link',
          variant: 'link'
        }
      }
    ]
  },
  description: 'Multiple button variants from YAML schema'
});

// Example 6: Icon and text combinations
export const IconTextExample: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'space-y-3 p-4',
    content: [
      {
        div: {
          class: 'flex items-center space-x-2',
          content: [
            {
              icon: {
                name: 'mdi:check-circle',
                class: 'text-green-500'
              }
            },
            {
              text: {
                content: 'Success message',
                class: 'text-green-700'
              }
            }
          ]
        }
      },
      {
        div: {
          class: 'flex items-center space-x-2',
          content: [
            {
              icon: {
                name: 'mdi:alert-circle',
                class: 'text-yellow-500'
              }
            },
            {
              text: {
                content: 'Warning message',
                class: 'text-yellow-700'
              }
            }
          ]
        }
      },
      {
        div: {
          class: 'flex items-center space-x-2',
          content: [
            {
              icon: {
                name: 'mdi:close-circle',
                class: 'text-red-500'
              }
            },
            {
              text: {
                content: 'Error message',
                class: 'text-red-700'
              }
            }
          ]
        }
      }
    ]
  },
  description: 'Icon and text combinations from YAML schema'
});
