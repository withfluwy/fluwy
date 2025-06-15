import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from './YamlRenderer.svelte';
import { YamlStoryGenerator } from './yaml-story-generator.js';

// This demonstrates the complete YAML-driven component testing workflow
const meta: Meta<YamlRenderer> = YamlStoryGenerator.createMeta(
  'YAML Driven/Component Testing',
  'Complete examples of YAML-driven component testing scenarios'
);

export default meta;
type Story = StoryObj<YamlRenderer>;

// Test scenario 1: Button component testing
export const ButtonTestSuite: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'p-6 space-y-6',
    content: [
      {
        h2: {
          content: 'Button Component Test Suite',
          class: 'text-2xl font-bold mb-4'
        }
      },
      {
        div: {
          class: 'space-y-4',
          content: [
            {
              h3: {
                content: 'Size Variants',
                class: 'text-lg font-semibold'
              }
            },
            {
              div: {
                class: 'space-x-2',
                content: [
                  {
                    button: {
                      text: 'Small',
                      size: 'sm',
                      variant: 'filled'
                    }
                  },
                  {
                    button: {
                      text: 'Medium',
                      size: 'md',
                      variant: 'filled'
                    }
                  },
                  {
                    button: {
                      text: 'Large',
                      size: 'lg',
                      variant: 'filled'
                    }
                  },
                  {
                    button: {
                      text: 'Extra Large',
                      size: 'xl',
                      variant: 'filled'
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      {
        div: {
          class: 'space-y-4',
          content: [
            {
              h3: {
                content: 'Style Variants',
                class: 'text-lg font-semibold'
              }
            },
            {
              div: {
                class: 'space-x-2',
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
              }
            }
          ]
        }
      }
    ]
  },
  description: 'Comprehensive button component testing via YAML'
});

// Test scenario 2: Form component testing
export const FormTestSuite: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'max-w-2xl mx-auto p-6',
    content: [
      {
        h2: {
          content: 'Form Components Test Suite',
          class: 'text-2xl font-bold mb-6'
        }
      },
      {
        div: {
          class: 'grid grid-cols-1 md:grid-cols-2 gap-6',
          content: [
            {
              div: {
                class: 'space-y-4',
                content: [
                  {
                    h3: {
                      content: 'Input Variants',
                      class: 'text-lg font-semibold'
                    }
                  },
                  {
                    input: {
                      label: 'Text Input',
                      placeholder: 'Enter text',
                      type: 'text'
                    }
                  },
                  {
                    input: {
                      label: 'Email Input',
                      placeholder: 'Enter email',
                      type: 'email'
                    }
                  },
                  {
                    input: {
                      label: 'Password Input',
                      placeholder: 'Enter password',
                      type: 'password'
                    }
                  },
                  {
                    input: {
                      label: 'Disabled Input',
                      placeholder: 'Disabled',
                      disabled: true
                    }
                  }
                ]
              }
            },
            {
              div: {
                class: 'space-y-4',
                content: [
                  {
                    h3: {
                      content: 'Input Sizes',
                      class: 'text-lg font-semibold'
                    }
                  },
                  {
                    input: {
                      label: 'Small Input',
                      placeholder: 'Small size',
                      size: 'sm'
                    }
                  },
                  {
                    input: {
                      label: 'Medium Input',
                      placeholder: 'Medium size',
                      size: 'md'
                    }
                  },
                  {
                    input: {
                      label: 'Large Input',
                      placeholder: 'Large size',
                      size: 'lg'
                    }
                  },
                  {
                    input: {
                      label: 'Extra Large Input',
                      placeholder: 'Extra large size',
                      size: 'xl'
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  description: 'Form component testing scenarios via YAML'
});

// Test scenario 3: Layout component testing
export const LayoutTestSuite: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'min-h-96',
    content: [
      {
        h2: {
          content: 'Layout Components Test Suite',
          class: 'text-2xl font-bold p-4 bg-gray-100'
        }
      },
      {
        div: {
          class: 'grid grid-cols-1 lg:grid-cols-3 gap-4 p-4',
          content: [
            {
              div: {
                class: 'bg-blue-100 p-4 rounded',
                content: [
                  {
                    h3: {
                      content: 'Column 1',
                      class: 'font-bold text-blue-800'
                    }
                  },
                  {
                    p: {
                      content: 'This is the first column in our layout test.',
                      class: 'text-blue-700'
                    }
                  }
                ]
              }
            },
            {
              div: {
                class: 'bg-green-100 p-4 rounded',
                content: [
                  {
                    h3: {
                      content: 'Column 2',
                      class: 'font-bold text-green-800'
                    }
                  },
                  {
                    p: {
                      content: 'This is the second column with different styling.',
                      class: 'text-green-700'
                    }
                  }
                ]
              }
            },
            {
              div: {
                class: 'bg-purple-100 p-4 rounded',
                content: [
                  {
                    h3: {
                      content: 'Column 3',
                      class: 'font-bold text-purple-800'
                    }
                  },
                  {
                    p: {
                      content: 'This is the third column completing our layout.',
                      class: 'text-purple-700'
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  description: 'Layout component testing via YAML schema'
});

// Test scenario 4: Interactive component testing
export const InteractiveTestSuite: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'p-6 space-y-6',
    content: [
      {
        h2: {
          content: 'Interactive Components Test Suite',
          class: 'text-2xl font-bold mb-4'
        }
      },
      {
        div: {
          class: 'space-y-4',
          content: [
            {
              h3: {
                content: 'Tabs Component',
                class: 'text-lg font-semibold'
              }
            },
            {
              tabs: {
                content: [
                  {
                    tab: {
                      title: 'Tab 1',
                      panel: {
                        p: {
                          content: 'Content for the first tab, defined in YAML schema.',
                          class: 'p-4'
                        }
                      }
                    }
                  },
                  {
                    tab: {
                      title: 'Tab 2',
                      panel: {
                        p: {
                          content: 'Content for the second tab, also from YAML.',
                          class: 'p-4'
                        }
                      }
                    }
                  },
                  {
                    tab: {
                      title: 'Tab 3',
                      panel: {
                        p: {
                          content: 'Third tab content, demonstrating YAML-driven tabs.',
                          class: 'p-4'
                        }
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  description: 'Interactive component testing via YAML configuration'
});
