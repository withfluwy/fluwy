import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from './YamlRenderer.svelte';
import { createYamlStoryExport } from './yaml-story-generator.js';

// This story file is automatically generated from the storybook-tests.yaml file
// It demonstrates the complete YAML-driven workflow

// Note: In a real implementation, this would be dynamically generated
// For now, we'll manually create the stories based on the YAML schema

const meta: Meta<YamlRenderer> = {
  title: 'YAML Driven/Auto Generated',
  component: YamlRenderer,
  parameters: {
    docs: {
      description: {
        component: 'Stories automatically generated from app/themes/storybook-tests.yaml',
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

// Load the theme from storybook-tests.yaml
const storybookTheme = {
  colors: {
    primary: {
      DEFAULT: "#3b82f6",
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554"
    },
    secondary: {
      DEFAULT: "#10b981",
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
      950: "#022c22"
    },
    accent: {
      DEFAULT: "#f59e0b",
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
      950: "#451a03"
    }
  },
  forms: {
    button: {
      variants: {
        primary: "bg-primary-500 hover:bg-primary-600 text-white",
        secondary: "bg-secondary-500 hover:bg-secondary-600 text-white",
        accent: "bg-accent-500 hover:bg-accent-600 text-white",
        outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50",
        ghost: "text-primary-500 hover:bg-primary-50",
        destructive: "bg-red-500 hover:bg-red-600 text-white"
      }
    }
  }
};

// Auto-generated stories from YAML schema
export const PrimaryButton: Story = {
  args: {
    schema: {
      name: 'button',
      props: {
        text: 'Primary Button',
        variant: 'primary',
        size: 'md'
      },
      description: 'Primary button test'
    },
    theme: storybookTheme,
    context: {}
  }
};

export const SecondaryButton: Story = {
  args: {
    schema: {
      name: 'button',
      props: {
        text: 'Secondary Button',
        variant: 'secondary',
        size: 'md'
      },
      description: 'Secondary button test'
    },
    theme: storybookTheme,
    context: {}
  }
};

export const AccentButton: Story = {
  args: {
    schema: {
      name: 'button',
      props: {
        text: 'Accent Button',
        variant: 'accent',
        size: 'lg'
      },
      description: 'Accent button test'
    },
    theme: storybookTheme,
    context: {}
  }
};

export const OutlineButton: Story = {
  args: {
    schema: {
      name: 'button',
      props: {
        text: 'Outline Button',
        variant: 'outline',
        size: 'md'
      },
      description: 'Outline button test'
    },
    theme: storybookTheme,
    context: {}
  }
};

export const GhostButton: Story = {
  args: {
    schema: {
      name: 'button',
      props: {
        text: 'Ghost Button',
        variant: 'ghost',
        size: 'sm'
      },
      description: 'Ghost button test'
    },
    theme: storybookTheme,
    context: {}
  }
};

export const TextInput: Story = {
  args: {
    schema: {
      name: 'input',
      props: {
        label: 'Username',
        placeholder: 'Enter your username',
        type: 'text'
      },
      description: 'Text input test'
    },
    theme: storybookTheme,
    context: {}
  }
};

export const EmailInput: Story = {
  args: {
    schema: {
      name: 'input',
      props: {
        label: 'Email Address',
        placeholder: 'Enter your email',
        type: 'email'
      },
      description: 'Email input test'
    },
    theme: storybookTheme,
    context: {}
  }
};

export const CardComponent: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden',
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
                    content: 'This is a card component created from YAML schema for testing purposes.',
                    class: 'text-gray-600 mb-4'
                  }
                },
                {
                  button: {
                    text: 'Learn More',
                    variant: 'primary',
                    size: 'sm'
                  }
                }
              ]
            }
          }
        ]
      },
      description: 'Card component test'
    },
    theme: storybookTheme,
    context: {}
  }
};

export const AlertComponent: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'p-4 rounded-md bg-blue-50 border border-blue-200',
        content: [
          {
            div: {
              class: 'flex items-center',
              content: [
                {
                  icon: {
                    name: 'mdi:information',
                    class: 'text-blue-500 mr-2'
                  }
                },
                {
                  p: {
                    content: 'This is an informational alert created from YAML schema.',
                    class: 'text-blue-800'
                  }
                }
              ]
            }
          }
        ]
      },
      description: 'Alert component test'
    },
    theme: storybookTheme,
    context: {}
  }
};
