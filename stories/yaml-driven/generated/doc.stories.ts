import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from '../YamlRenderer.svelte';

// Auto-generated from doc.yaml
const meta: Meta<YamlRenderer> = {
  title: 'YAML Generated/Doc',
  component: YamlRenderer,
  parameters: {
    docs: {
      description: {
        component: 'Stories automatically generated from doc.yaml theme file',
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

// Theme configuration from doc.yaml
const theme = {
  "typography": {
    "link": "bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent hover:to-primary transition-all duration-300"
  },
  "layout": {
    "footer": "bg-purple-50 border-purple-500 p-3 border",
    "main": "px-0 sm:px-4 lg:p-10",
    "menu_item": {
      "active": "bg-transparent text-primary-500 font-semibold hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent",
      "indicator": {
        "default": "visible"
      }
    },
    "menu_group": {
      "content": "border-l"
    }
  },
  "colors": {
    "primary": {
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
    },
    "secondary": {
      "50": "#eff6ff",
      "100": "#dbeafe",
      "200": "#bfdbfe",
      "300": "#93c5fd",
      "400": "#60a5fa",
      "500": "#3b82f6",
      "600": "#2563eb",
      "700": "#1d4ed8",
      "800": "#1e40af",
      "900": "#1e3a8a",
      "950": "#172554",
      "DEFAULT": "#3b82f6"
    }
  },
  "forms": {
    "common": {
      "default_size": null,
      "sizes": {
        "sm": null,
        "md": "p-2.5",
        "lg": null,
        "my-size": "h-14 px-5 text-2xl"
      }
    },
    "button": {
      "variants": {
        "my-gradient-variant": "bg-linear-to-r from-color-500 to-purple-500 text-white"
      }
    }
  },
  "common": {
    "border_radius": {
      "sm": null,
      "md": null,
      "lg": null
    },
    "tabs": {
      "tab": null,
      "tab_panel": null,
      "root": null,
      "list": null
    }
  }
};


export const ButtonMygradientvariant: Story = {
  args: {
    schema:     {
      "name": "button",
      "props": {
        "text": "My-gradient-variant Button",
        "variant": "my-gradient-variant",
        "class": "bg-linear-to-r from-color-500 to-purple-500 text-white"
      },
      "description": "Button with my-gradient-variant variant from doc theme"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with my-gradient-variant variant from doc theme',
      },
    },
  },
};

export const DivPrimaryColor: Story = {
  args: {
    schema:     {
      "name": "div",
      "props": {
        "class": "p-4 rounded-lg bg-primary-500 text-white font-semibold text-center",
        "content": "Primary Color"
      },
      "description": "Color demonstration for primary from doc theme"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Color demonstration for primary from doc theme',
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
      "description": "Color demonstration for secondary from doc theme"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Color demonstration for secondary from doc theme',
      },
    },
  },
};
