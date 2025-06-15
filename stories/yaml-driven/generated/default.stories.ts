import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from '../YamlRenderer.svelte';

// Auto-generated from default.yaml
const meta: Meta<YamlRenderer> = {
  title: 'YAML Generated/Default',
  component: YamlRenderer,
  parameters: {
    docs: {
      description: {
        component: 'Stories automatically generated from default.yaml theme file',
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

// Theme configuration from default.yaml
const theme = {
  "typography": {
    "h1": null,
    "h2": null,
    "h3": null,
    "h4": null,
    "h5": null,
    "h6": null,
    "p": null,
    "body": {
      "font-family": "Inter",
      "sizes": null
    }
  },
  "layout": {
    "banner": "bg-purple-100 sticky top-0 border-purple-500 p-3 border",
    "header": null,
    "body": null,
    "main": null,
    "page": null,
    "sidebar": null,
    "sidebar_indicator": null,
    "aside": null,
    "footer": null,
    "sidebar_toggler": null,
    "sidebar_toggler_icon": null,
    "row": null,
    "column": null,
    "menu_item": {
      "default": null,
      "indicator": {
        "active": null
      }
    },
    "menu_group": {
      "wrapper": null,
      "header": {
        "default": null,
        "active": null
      }
    }
  },
  "common": {
    "border_radius": null,
    "tab": {
      "class": null,
      "outer_radius": null,
      "title": null,
      "panel": null,
      "root": null,
      "list": null
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
    }
  },
  "forms": {
    "common": {
      "default_size": null,
      "sizes": {
        "sm": null,
        "md": null,
        "lg": null
      },
      "border_radius": {
        "sm": null,
        "md": null,
        "lg": null
      }
    },
    "button": {
      "variants": {
        "filled": null,
        "outline": null,
        "ghost": null,
        "link": null
      }
    }
  }
};


export const ButtonFilled: Story = {
  args: {
    schema:     {
      "name": "button",
      "props": {
        "text": "Filled Button",
        "variant": "filled",
        "class": null
      },
      "description": "Button with filled variant from default theme"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with filled variant from default theme',
      },
    },
  },
};

export const ButtonOutline: Story = {
  args: {
    schema:     {
      "name": "button",
      "props": {
        "text": "Outline Button",
        "variant": "outline",
        "class": null
      },
      "description": "Button with outline variant from default theme"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with outline variant from default theme',
      },
    },
  },
};

export const ButtonGhost: Story = {
  args: {
    schema:     {
      "name": "button",
      "props": {
        "text": "Ghost Button",
        "variant": "ghost",
        "class": null
      },
      "description": "Button with ghost variant from default theme"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with ghost variant from default theme',
      },
    },
  },
};

export const ButtonLink: Story = {
  args: {
    schema:     {
      "name": "button",
      "props": {
        "text": "Link Button",
        "variant": "link",
        "class": null
      },
      "description": "Button with link variant from default theme"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with link variant from default theme',
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
      "description": "Color demonstration for primary from default theme"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Color demonstration for primary from default theme',
      },
    },
  },
};
