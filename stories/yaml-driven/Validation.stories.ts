import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from './YamlRenderer.svelte';
import { YamlStoryGenerator } from './yaml-story-generator.js';
import { YamlValidator } from './YamlValidator.js';

const meta: Meta<YamlRenderer> = YamlStoryGenerator.createMeta(
  'YAML Driven/Validation',
  'Examples of YAML schema validation and error handling'
);

export default meta;
type Story = StoryObj<YamlRenderer>;

// Valid schema example
export const ValidSchema: Story = {
  args: {
    schema: {
      name: 'button',
      props: {
        text: 'Valid Button',
        variant: 'primary',
        size: 'md'
      },
      description: 'A properly validated button component'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates a valid YAML schema that passes all validation checks.

**Validation Result:**
${YamlValidator.formatValidationResults(
  YamlValidator.validateComponent({
    name: 'button',
    props: {
      text: 'Valid Button',
      variant: 'primary',
      size: 'md'
    }
  }, 'button')
)}
        `,
      },
    },
  },
};

// Invalid variant example
export const InvalidVariant: Story = {
  args: {
    schema: {
      name: 'button',
      props: {
        text: 'Invalid Variant Button',
        variant: 'invalid-variant',
        size: 'md'
      },
      description: 'Button with invalid variant (still renders with warning)'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates a schema with an invalid variant. The component still renders, but validation warnings are shown.

**Validation Result:**
\`\`\`
⚠️  Warnings:
  • button.props.variant: Invalid variant "invalid-variant" for button. Valid variants: filled, outline, ghost, link, primary, secondary, accent, destructive
    Suggestions:
    - Use one of the valid variants listed in the error
    - Check the theme configuration for available variants
\`\`\`
        `,
      },
    },
  },
};

// Missing required props example
export const MissingRequiredProps: Story = {
  args: {
    schema: {
      name: 'link',
      props: {
        text: 'Link without href'
        // Missing required 'href' prop
      },
      description: 'Link component missing required href property'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates a component with missing required properties.

**Validation Result:**
\`\`\`
❌ Schema validation failed!

🚨 Errors:
  • link.props.href: Required property "href" is missing for component "link"
    Suggestions:
    - Add the missing required property to the component props
    - Check the component documentation for required properties
\`\`\`
        `,
      },
    },
  },
};

// Unknown component example
export const UnknownComponent: Story = {
  args: {
    schema: {
      name: 'unknown-widget',
      props: {
        text: 'This component does not exist',
        someProperty: 'value'
      },
      description: 'Example of unknown component with validation warning'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates how the system handles unknown components with validation warnings.

**Validation Result:**
\`\`\`
⚠️  Warnings:
  • unknown-widget.name: Unknown component "unknown-widget". Known components: button, input, div, p, h1, h2, h3, h4, h5, h6, text, link, image, icon, tabs, tab, form, column, row, container, header, footer, sidebar, page, dialog, dropdown, avatar, badge, card, alert, modal, tooltip, spinner, checkbox, radio, select, textarea, label, fieldset, nav, menu, breadcrumb, pagination, table, thead, tbody, tr, td, th, ul, ol, li, section, article, aside, main, figure, figcaption, blockquote, code, pre
    Suggestions:
    - Check if the component is registered in the Fluwy app
    - Verify the component name spelling
    - Use one of the known components listed in the error
\`\`\`
        `,
      },
    },
  },
};

// Complex validation example
export const ComplexValidation: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'p-6 space-y-4',
        content: [
          {
            h2: {
              content: 'Validation Examples',
              class: 'text-xl font-bold'
            }
          },
          {
            button: {
              text: 'Valid Primary',
              variant: 'primary',
              size: 'md'
            }
          },
          {
            button: {
              text: 'Invalid Size',
              variant: 'secondary',
              size: 'invalid-size'
            }
          },
          {
            input: {
              label: 'Valid Input',
              placeholder: 'Enter text',
              type: 'text'
            }
          },
          {
            'unknown-component': {
              text: 'This will show a warning',
              prop: 'value'
            }
          }
        ]
      },
      description: 'Complex component with mixed validation results'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates validation of a complex component structure with nested elements.

**Validation includes:**
- ✅ Valid h2 component
- ✅ Valid primary button
- ⚠️ Button with invalid size
- ✅ Valid input component  
- ⚠️ Unknown component type

The validation system checks each nested component individually and provides detailed feedback.
        `,
      },
    },
  },
};

// Validation showcase
export const ValidationShowcase: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'max-w-4xl mx-auto p-6 space-y-6',
        content: [
          {
            div: {
              class: 'bg-green-50 border border-green-200 rounded-lg p-4',
              content: [
                {
                  h3: {
                    content: '✅ Valid Components',
                    class: 'text-green-800 font-bold mb-2'
                  }
                },
                {
                  div: {
                    class: 'space-x-2',
                    content: [
                      {
                        button: {
                          text: 'Primary',
                          variant: 'primary',
                          size: 'sm'
                        }
                      },
                      {
                        button: {
                          text: 'Secondary',
                          variant: 'secondary',
                          size: 'sm'
                        }
                      },
                      {
                        button: {
                          text: 'Outline',
                          variant: 'outline',
                          size: 'sm'
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
              class: 'bg-yellow-50 border border-yellow-200 rounded-lg p-4',
              content: [
                {
                  h3: {
                    content: '⚠️ Components with Warnings',
                    class: 'text-yellow-800 font-bold mb-2'
                  }
                },
                {
                  p: {
                    content: 'These components render but have validation warnings:',
                    class: 'text-yellow-700 mb-2'
                  }
                },
                {
                  div: {
                    class: 'space-x-2',
                    content: [
                      {
                        button: {
                          text: 'Invalid Variant',
                          variant: 'custom-variant',
                          size: 'md'
                        }
                      },
                      {
                        button: {
                          text: 'Invalid Size',
                          variant: 'primary',
                          size: 'huge'
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
              class: 'bg-red-50 border border-red-200 rounded-lg p-4',
              content: [
                {
                  h3: {
                    content: '❌ Components with Errors',
                    class: 'text-red-800 font-bold mb-2'
                  }
                },
                {
                  p: {
                    content: 'These components have validation errors but still attempt to render:',
                    class: 'text-red-700 mb-2'
                  }
                },
                {
                  'missing-component': {
                    text: 'This component does not exist',
                    class: 'inline-block'
                  }
                }
              ]
            }
          }
        ]
      },
      description: 'Comprehensive validation showcase'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
This story provides a comprehensive showcase of the validation system, demonstrating:

1. **Valid Components** - Components that pass all validation checks
2. **Warning Components** - Components that render but have validation warnings
3. **Error Components** - Components with validation errors

The validation system helps developers identify issues early while still allowing components to render when possible.
        `,
      },
    },
  },
};
