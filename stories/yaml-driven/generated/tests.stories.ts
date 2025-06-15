import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from '../YamlRenderer.svelte';

// Auto-generated from tests.yaml
const meta: Meta<YamlRenderer> = {
  title: 'YAML Generated/Tests',
  component: YamlRenderer,
  parameters: {
    docs: {
      description: {
        component: 'Stories automatically generated from tests.yaml theme file',
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

// Theme configuration from tests.yaml
const theme = {
  "colors": {
    "secondary": {
      "50": "#ecfdf5",
      "100": "#d1fae5",
      "200": "#a7f3d0",
      "300": "#6ee7b7",
      "400": "#34d399",
      "500": "#10b981",
      "600": "#059669",
      "700": "#047857",
      "800": "#065f46",
      "900": "#064e3b",
      "950": "#022c22",
      "DEFAULT": "#34d399"
    }
  },
  "forms": {
    "common": {
      "sizes": {
        "xl": "text-base h-14 p-4 gap-2"
      }
    },
    "button": {
      "variants": {
        "testing": "bg-linear-to-r from-color-500 to-purple-500 text-white"
      }
    },
    "input": {
      "wrapper": "border border-gray-200 dark:border-gray-700 p-1 rounded-xl",
      "base": "focus:shadow-lg",
      "label": "italic font-bold",
      "errors": "italic underline"
    }
  },
  "common": {
    "spinner": "svg-spinners:bars-rotate-fade"
  }
};


export const ButtonTesting: Story = {
  args: {
    schema:     {
      "name": "button",
      "props": {
        "text": "Testing Button",
        "variant": "testing",
        "class": "bg-linear-to-r from-color-500 to-purple-500 text-white"
      },
      "description": "Button with testing variant from tests theme"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with testing variant from tests theme',
      },
    },
  },
};

export const DivSecondaryColor: Story = {
  args: {
    schema:     {
      "name": "div",
      "props": {
        "class": "p-4 rounded-lg bg-secondary-500 text-white font-semibold text-center",
        "content": "Secondary Color"
      },
      "description": "Color demonstration for secondary from tests theme"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Color demonstration for secondary from tests theme',
      },
    },
  },
};
