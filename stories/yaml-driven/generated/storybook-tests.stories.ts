import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from '../YamlRenderer.svelte';

// Auto-generated from storybook-tests.yaml
const meta: Meta<YamlRenderer> = {
  title: 'YAML Generated/Storybook-tests',
  component: YamlRenderer,
  parameters: {
    docs: {
      description: {
        component: 'Stories automatically generated from storybook-tests.yaml theme file',
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

// Theme configuration from storybook-tests.yaml
const theme = {
  "description": "Comprehensive component testing scenarios for Storybook",
  "colors": {
    "primary": {
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
    },
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
      "DEFAULT": "#10b981"
    },
    "accent": {
      "50": "#fffbeb",
      "100": "#fef3c7",
      "200": "#fde68a",
      "300": "#fcd34d",
      "400": "#fbbf24",
      "500": "#f59e0b",
      "600": "#d97706",
      "700": "#b45309",
      "800": "#92400e",
      "900": "#78350f",
      "950": "#451a03",
      "DEFAULT": "#f59e0b"
    }
  },
  "forms": {
    "common": {
      "sizes": {
        "xs": "text-xs h-8 px-2 gap-1",
        "sm": "text-sm h-9 px-3 gap-1.5",
        "md": "text-sm h-10 px-4 gap-2",
        "lg": "text-base h-11 px-6 gap-2",
        "xl": "text-base h-12 px-8 gap-3"
      }
    },
    "button": {
      "variants": {
        "primary": "bg-primary-500 hover:bg-primary-600 text-white",
        "secondary": "bg-secondary-500 hover:bg-secondary-600 text-white",
        "accent": "bg-accent-500 hover:bg-accent-600 text-white",
        "outline": "border-2 border-primary-500 text-primary-500 hover:bg-primary-50",
        "ghost": "text-primary-500 hover:bg-primary-50",
        "destructive": "bg-red-500 hover:bg-red-600 text-white"
      }
    },
    "input": {
      "base": "border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500",
      "error": "border-red-500 focus:ring-red-500",
      "success": "border-green-500 focus:ring-green-500",
      "disabled": "bg-gray-100 cursor-not-allowed opacity-50"
    }
  },
  "layout": {
    "container": {
      "base": "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
      "narrow": "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
      "wide": "max-w-full px-4 sm:px-6 lg:px-8"
    },
    "grid": {
      "cols_1": "grid grid-cols-1 gap-4",
      "cols_2": "grid grid-cols-1 md:grid-cols-2 gap-4",
      "cols_3": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
      "cols_4": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    }
  },
  "components": [
    {
      "name": "button",
      "description": "Primary button test",
      "props": {
        "text": "Primary Button",
        "variant": "primary",
        "size": "md"
      }
    },
    {
      "name": "button",
      "description": "Secondary button test",
      "props": {
        "text": "Secondary Button",
        "variant": "secondary",
        "size": "md"
      }
    },
    {
      "name": "button",
      "description": "Accent button test",
      "props": {
        "text": "Accent Button",
        "variant": "accent",
        "size": "lg"
      }
    },
    {
      "name": "button",
      "description": "Outline button test",
      "props": {
        "text": "Outline Button",
        "variant": "outline",
        "size": "md"
      }
    },
    {
      "name": "button",
      "description": "Ghost button test",
      "props": {
        "text": "Ghost Button",
        "variant": "ghost",
        "size": "sm"
      }
    },
    {
      "name": "input",
      "description": "Text input test",
      "props": {
        "label": "Username",
        "placeholder": "Enter your username",
        "type": "text"
      }
    },
    {
      "name": "input",
      "description": "Email input test",
      "props": {
        "label": "Email Address",
        "placeholder": "Enter your email",
        "type": "email"
      }
    },
    {
      "name": "input",
      "description": "Password input test",
      "props": {
        "label": "Password",
        "placeholder": "Enter your password",
        "type": "password"
      }
    },
    {
      "name": "div",
      "description": "Card component test",
      "props": {
        "class": "max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden",
        "content": [
          {
            "div": {
              "class": "p-6",
              "content": [
                {
                  "h3": {
                    "content": "Card Title",
                    "class": "text-xl font-semibold text-gray-900 mb-2"
                  }
                },
                {
                  "p": {
                    "content": "This is a card component created from YAML schema for testing purposes.",
                    "class": "text-gray-600 mb-4"
                  }
                },
                {
                  "button": {
                    "text": "Learn More",
                    "variant": "primary",
                    "size": "sm"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      "name": "div",
      "description": "Alert component test",
      "props": {
        "class": "p-4 rounded-md bg-blue-50 border border-blue-200",
        "content": [
          {
            "div": {
              "class": "flex items-center",
              "content": [
                {
                  "icon": {
                    "name": "mdi:information",
                    "class": "text-blue-500 mr-2"
                  }
                },
                {
                  "p": {
                    "content": "This is an informational alert created from YAML schema.",
                    "class": "text-blue-800"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      "name": "div",
      "description": "Navigation component test",
      "props": {
        "class": "bg-white shadow-sm border-b",
        "content": [
          {
            "div": {
              "class": "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
              "content": [
                {
                  "div": {
                    "class": "flex justify-between items-center h-16",
                    "content": [
                      {
                        "div": {
                          "class": "flex items-center space-x-4",
                          "content": [
                            {
                              "h1": {
                                "content": "Brand",
                                "class": "text-xl font-bold text-gray-900"
                              }
                            },
                            {
                              "div": {
                                "class": "hidden md:flex space-x-4",
                                "content": [
                                  {
                                    "link": {
                                      "text": "Home",
                                      "href": "#",
                                      "class": "text-gray-600 hover:text-gray-900"
                                    }
                                  },
                                  {
                                    "link": {
                                      "text": "About",
                                      "href": "#",
                                      "class": "text-gray-600 hover:text-gray-900"
                                    }
                                  },
                                  {
                                    "link": {
                                      "text": "Contact",
                                      "href": "#",
                                      "class": "text-gray-600 hover:text-gray-900"
                                    }
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      },
                      {
                        "button": {
                          "text": "Sign In",
                          "variant": "primary",
                          "size": "sm"
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ],
  "test_scenarios": {
    "button_states": [
      {
        "name": "button",
        "description": "Normal state button",
        "props": {
          "text": "Normal",
          "variant": "primary"
        }
      },
      {
        "name": "button",
        "description": "Disabled state button",
        "props": {
          "text": "Disabled",
          "variant": "primary",
          "disabled": true
        }
      },
      {
        "name": "button",
        "description": "Loading state button",
        "props": {
          "text": "Loading...",
          "variant": "primary",
          "loading": true
        }
      }
    ],
    "input_states": [
      {
        "name": "input",
        "description": "Normal input",
        "props": {
          "label": "Normal Input",
          "placeholder": "Enter text"
        }
      },
      {
        "name": "input",
        "description": "Error input",
        "props": {
          "label": "Error Input",
          "placeholder": "Enter text",
          "error": "This field is required"
        }
      },
      {
        "name": "input",
        "description": "Success input",
        "props": {
          "label": "Success Input",
          "placeholder": "Enter text",
          "value": "Valid input",
          "success": true
        }
      }
    ]
  }
};


export const ButtonPrimary: Story = {
  args: {
    schema:     {
      "name": "button",
      "props": {
        "text": "Primary Button",
        "variant": "primary",
        "size": "md"
      },
      "description": "Primary button test"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary button test',
      },
    },
  },
};

export const ButtonSecondary: Story = {
  args: {
    schema:     {
      "name": "button",
      "props": {
        "text": "Secondary Button",
        "variant": "secondary",
        "size": "md"
      },
      "description": "Secondary button test"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Secondary button test',
      },
    },
  },
};

export const ButtonAccent: Story = {
  args: {
    schema:     {
      "name": "button",
      "props": {
        "text": "Accent Button",
        "variant": "accent",
        "size": "lg"
      },
      "description": "Accent button test"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Accent button test',
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
        "size": "md"
      },
      "description": "Outline button test"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Outline button test',
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
        "size": "sm"
      },
      "description": "Ghost button test"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Ghost button test',
      },
    },
  },
};

export const Input6: Story = {
  args: {
    schema:     {
      "name": "input",
      "props": {
        "label": "Username",
        "placeholder": "Enter your username",
        "type": "text"
      },
      "description": "Text input test"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Text input test',
      },
    },
  },
};

export const Input7: Story = {
  args: {
    schema:     {
      "name": "input",
      "props": {
        "label": "Email Address",
        "placeholder": "Enter your email",
        "type": "email"
      },
      "description": "Email input test"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Email input test',
      },
    },
  },
};

export const Input8: Story = {
  args: {
    schema:     {
      "name": "input",
      "props": {
        "label": "Password",
        "placeholder": "Enter your password",
        "type": "password"
      },
      "description": "Password input test"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Password input test',
      },
    },
  },
};

export const Div9: Story = {
  args: {
    schema:     {
      "name": "div",
      "props": {
        "class": "max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden",
        "content": [
          {
            "div": {
              "class": "p-6",
              "content": [
                {
                  "h3": {
                    "content": "Card Title",
                    "class": "text-xl font-semibold text-gray-900 mb-2"
                  }
                },
                {
                  "p": {
                    "content": "This is a card component created from YAML schema for testing purposes.",
                    "class": "text-gray-600 mb-4"
                  }
                },
                {
                  "button": {
                    "text": "Learn More",
                    "variant": "primary",
                    "size": "sm"
                  }
                }
              ]
            }
          }
        ]
      },
      "description": "Card component test"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Card component test',
      },
    },
  },
};

export const Div10: Story = {
  args: {
    schema:     {
      "name": "div",
      "props": {
        "class": "p-4 rounded-md bg-blue-50 border border-blue-200",
        "content": [
          {
            "div": {
              "class": "flex items-center",
              "content": [
                {
                  "icon": {
                    "name": "mdi:information",
                    "class": "text-blue-500 mr-2"
                  }
                },
                {
                  "p": {
                    "content": "This is an informational alert created from YAML schema.",
                    "class": "text-blue-800"
                  }
                }
              ]
            }
          }
        ]
      },
      "description": "Alert component test"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Alert component test',
      },
    },
  },
};

export const Div11: Story = {
  args: {
    schema:     {
      "name": "div",
      "props": {
        "class": "bg-white shadow-sm border-b",
        "content": [
          {
            "div": {
              "class": "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
              "content": [
                {
                  "div": {
                    "class": "flex justify-between items-center h-16",
                    "content": [
                      {
                        "div": {
                          "class": "flex items-center space-x-4",
                          "content": [
                            {
                              "h1": {
                                "content": "Brand",
                                "class": "text-xl font-bold text-gray-900"
                              }
                            },
                            {
                              "div": {
                                "class": "hidden md:flex space-x-4",
                                "content": [
                                  {
                                    "link": {
                                      "text": "Home",
                                      "href": "#",
                                      "class": "text-gray-600 hover:text-gray-900"
                                    }
                                  },
                                  {
                                    "link": {
                                      "text": "About",
                                      "href": "#",
                                      "class": "text-gray-600 hover:text-gray-900"
                                    }
                                  },
                                  {
                                    "link": {
                                      "text": "Contact",
                                      "href": "#",
                                      "class": "text-gray-600 hover:text-gray-900"
                                    }
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      },
                      {
                        "button": {
                          "text": "Sign In",
                          "variant": "primary",
                          "size": "sm"
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
      "description": "Navigation component test"
    },
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigation component test',
      },
    },
  },
};
