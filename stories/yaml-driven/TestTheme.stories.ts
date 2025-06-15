import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from './YamlRenderer.svelte';
import { YamlStoryGenerator } from './yaml-story-generator.js';

// This story demonstrates loading the test theme and generating component stories
const meta: Meta<YamlRenderer> = YamlStoryGenerator.createMeta(
  'YAML Driven/Test Theme Components',
  'Components generated from app/themes/tests.yaml theme configuration'
);

export default meta;
type Story = StoryObj<YamlRenderer>;

// Load the test theme
const testTheme = {
  colors: {
    secondary: {
      DEFAULT: "#34d399",
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
    }
  },
  forms: {
    common: {
      sizes: {
        xl: "text-base h-14 p-4 gap-2"
      }
    },
    button: {
      variants: {
        testing: "bg-linear-to-r from-color-500 to-purple-500 text-white"
      }
    },
    input: {
      wrapper: "border border-gray-200 dark:border-gray-700 p-1 rounded-xl",
      base: "focus:shadow-lg",
      label: "italic font-bold",
      errors: "italic underline"
    }
  },
  common: {
    spinner: "svg-spinners:bars-rotate-fade"
  }
};

// Button with testing variant
export const ButtonTesting: Story = YamlStoryGenerator.createStory(
  {
    name: 'button',
    props: {
      text: 'Testing Button',
      variant: 'testing',
      size: 'xl'
    },
    description: 'Button using the testing variant from test theme'
  },
  testTheme
);

// Secondary color demonstration
export const SecondaryColorDiv: Story = YamlStoryGenerator.createStory(
  {
    name: 'div',
    props: {
      class: 'p-6 rounded-lg bg-secondary-500 text-white font-bold text-center',
      content: 'Secondary Color from Test Theme'
    },
    description: 'Div showcasing the secondary color from test theme'
  },
  testTheme
);

// Input with custom styling
export const StyledInput: Story = YamlStoryGenerator.createStory(
  {
    name: 'input',
    props: {
      placeholder: 'Test input with custom styling',
      label: 'Custom Styled Input',
      size: 'xl'
    },
    description: 'Input component with custom styling from test theme'
  },
  testTheme
);

// Text component with secondary color
export const SecondaryText: Story = YamlStoryGenerator.createStory(
  {
    name: 'text',
    props: {
      content: 'This text uses the secondary color',
      class: 'text-secondary-600 font-semibold text-lg'
    },
    description: 'Text component using secondary color from theme'
  },
  testTheme
);

// Container with multiple components
export const ThemeShowcase: Story = YamlStoryGenerator.createStory(
  {
    name: 'div',
    props: {
      class: 'p-6 space-y-4 bg-gray-50 rounded-lg',
      content: [
        {
          h2: {
            content: 'Test Theme Showcase',
            class: 'text-secondary-700 font-bold text-2xl mb-4'
          }
        },
        {
          button: {
            text: 'Primary Button',
            variant: 'filled',
            class: 'mr-2'
          }
        },
        {
          button: {
            text: 'Testing Variant',
            variant: 'testing'
          }
        },
        {
          div: {
            class: 'mt-4 p-4 bg-secondary-100 rounded border-l-4 border-secondary-500',
            content: 'This is a callout using the secondary color palette'
          }
        }
      ]
    },
    description: 'Comprehensive showcase of test theme components'
  },
  testTheme
);
