import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from './YamlRenderer.svelte';
import { YamlStoryGenerator } from './yaml-story-generator.js';
import { YamlTester, type ComponentTest } from './YamlTester.js';

const meta: Meta<YamlRenderer> = YamlStoryGenerator.createMeta(
  'YAML Driven/Testing',
  'Automated testing capabilities for YAML component schemas'
);

export default meta;
type Story = StoryObj<YamlRenderer>;

// Test a simple valid component
export const ValidComponentTest: Story = {
  args: {
    schema: {
      name: 'button',
      props: {
        text: 'Test Button',
        variant: 'primary',
        size: 'md'
      },
      description: 'A valid button component for testing'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates testing a valid component schema.

**Test Results:**
${(async () => {
  const schema = {
    name: 'button',
    props: {
      text: 'Test Button',
      variant: 'primary',
      size: 'md'
    },
    description: 'A valid button component for testing'
  };
  
  const testSuite = await YamlTester.runTestSuite(schema, 'Valid Button Test');
  return YamlTester.generateReport([testSuite]);
})()}
        `,
      },
    },
  },
};

// Test an invalid component
export const InvalidComponentTest: Story = {
  args: {
    schema: {
      name: 'button',
      props: {
        text: 'Invalid Button',
        variant: 'invalid-variant',
        size: 'invalid-size'
      },
      description: 'A button with invalid properties for testing'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates testing a component with validation issues.

The component has:
- Invalid variant: "invalid-variant"
- Invalid size: "invalid-size"

These should be caught by the validation tests.
        `,
      },
    },
  },
};

// Test a complex component structure
export const ComplexComponentTest: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'max-w-2xl mx-auto p-6',
        content: Array.from({ length: 50 }, (_, i) => ({
          div: {
            class: 'flex items-center justify-between p-3 border-b',
            content: [
              {
                div: {
                  content: [
                    {
                      p: {
                        content: `Item ${i + 1}`,
                        class: 'font-medium'
                      }
                    },
                    {
                      p: {
                        content: `Description for item ${i + 1}`,
                        class: 'text-sm text-gray-600'
                      }
                    }
                  ]
                }
              },
              {
                button: {
                  text: 'Action',
                  variant: 'outline',
                  size: 'sm'
                }
              }
            ]
          }
        }))
      },
      description: 'Complex component with many nested elements'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
This story tests a complex component structure with:
- 50 nested items
- Multiple levels of nesting
- Performance implications

The tests should identify potential performance issues.
        `,
      },
    },
  },
};

// Custom test example
export const CustomTestExample: Story = {
  args: {
    schema: {
      name: 'form',
      props: {
        class: 'space-y-4',
        content: [
          {
            input: {
              label: 'Name',
              placeholder: 'Enter your name',
              type: 'text'
            }
          },
          {
            input: {
              label: 'Email',
              placeholder: 'Enter your email',
              type: 'email'
            }
          },
          {
            button: {
              text: 'Submit',
              variant: 'primary',
              size: 'md'
            }
          }
        ]
      },
      description: 'Form component with custom tests'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates custom testing with specific expectations:

\`\`\`typescript
const customTest: ComponentTest = {
  name: 'Form Validation Test',
  description: 'Test form component requirements',
  schema: formSchema,
  expectations: [
    YamlTester.expectations.hasValidName(),
    YamlTester.expectations.componentCountLessThan(10),
    YamlTester.expectations.maxDepthLessThan(5),
    {
      type: 'structure',
      description: 'Form contains input fields',
      test: (schema) => {
        const content = schema.props?.content || [];
        return content.some(item => item.input);
      },
      errorMessage: 'Form should contain input fields'
    },
    {
      type: 'structure',
      description: 'Form contains submit button',
      test: (schema) => {
        const content = schema.props?.content || [];
        return content.some(item => 
          item.button && item.button.text === 'Submit'
        );
      },
      errorMessage: 'Form should contain submit button'
    }
  ]
};
\`\`\`
        `,
      },
    },
  },
};

// Accessibility test example
export const AccessibilityTest: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'space-y-4 p-6',
        content: [
          {
            h1: {
              content: 'Accessibility Test Page',
              class: 'text-2xl font-bold'
            }
          },
          {
            image: {
              src: 'https://via.placeholder.com/300x200',
              alt: 'Placeholder image with proper alt text',
              class: 'rounded'
            }
          },
          {
            input: {
              label: 'Accessible Input',
              placeholder: 'This input has a label',
              type: 'text'
            }
          },
          {
            input: {
              // Missing label - should fail accessibility test
              placeholder: 'This input has no label',
              type: 'text'
            }
          },
          {
            link: {
              text: 'Descriptive link text',
              href: '#example',
              class: 'text-blue-600'
            }
          },
          {
            link: {
              // Missing text - should fail accessibility test
              href: '#example2',
              class: 'text-blue-600'
            }
          }
        ]
      },
      description: 'Component testing accessibility features'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
This story tests accessibility features:

**Good Accessibility:**
- Image with alt text
- Input with label
- Link with descriptive text

**Poor Accessibility:**
- Input without label
- Link without text

The accessibility tests should identify these issues.
        `,
      },
    },
  },
};

// Performance test showcase
export const PerformanceTestShowcase: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'grid grid-cols-1 md:grid-cols-3 gap-6 p-6',
        content: [
          // Fast component
          {
            div: {
              class: 'bg-green-50 border border-green-200 rounded-lg p-4',
              content: [
                {
                  h3: {
                    content: 'Fast Component',
                    class: 'text-lg font-semibold text-green-800 mb-2'
                  }
                },
                {
                  button: {
                    text: 'Simple Button',
                    variant: 'primary'
                  }
                },
                {
                  p: {
                    content: 'Low complexity, fast rendering',
                    class: 'text-sm text-green-700 mt-2'
                  }
                }
              ]
            }
          },
          // Medium component
          {
            div: {
              class: 'bg-yellow-50 border border-yellow-200 rounded-lg p-4',
              content: [
                {
                  h3: {
                    content: 'Medium Component',
                    class: 'text-lg font-semibold text-yellow-800 mb-2'
                  }
                },
                {
                  div: {
                    class: 'space-y-2',
                    content: Array.from({ length: 5 }, (_, i) => ({
                      div: {
                        class: 'flex items-center space-x-2',
                        content: [
                          {
                            icon: {
                              name: 'mdi:check',
                              class: 'text-green-500'
                            }
                          },
                          {
                            p: {
                              content: `Item ${i + 1}`,
                              class: 'text-sm'
                            }
                          }
                        ]
                      }
                    }))
                  }
                },
                {
                  p: {
                    content: 'Medium complexity, acceptable performance',
                    class: 'text-sm text-yellow-700 mt-2'
                  }
                }
              ]
            }
          },
          // Slow component
          {
            div: {
              class: 'bg-red-50 border border-red-200 rounded-lg p-4',
              content: [
                {
                  h3: {
                    content: 'Slow Component',
                    class: 'text-lg font-semibold text-red-800 mb-2'
                  }
                },
                {
                  div: {
                    class: 'space-y-1 max-h-32 overflow-y-auto',
                    content: Array.from({ length: 20 }, (_, i) => ({
                      div: {
                        class: 'flex items-center justify-between bg-white p-2 rounded border',
                        content: [
                          {
                            div: {
                              content: [
                                {
                                  p: {
                                    content: `Complex Item ${i + 1}`,
                                    class: 'text-xs font-medium'
                                  }
                                },
                                {
                                  p: {
                                    content: `Nested description ${i + 1}`,
                                    class: 'text-xs text-gray-500'
                                  }
                                }
                              ]
                            }
                          },
                          {
                            button: {
                              text: 'Action',
                              variant: 'outline',
                              size: 'xs'
                            }
                          }
                        ]
                      }
                    }))
                  }
                },
                {
                  p: {
                    content: 'High complexity, may impact performance',
                    class: 'text-sm text-red-700 mt-2'
                  }
                }
              ]
            }
          }
        ]
      },
      description: 'Performance testing showcase with different complexity levels'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
This story showcases performance testing across different component complexity levels:

1. **Fast Component**: Simple structure, minimal nesting
2. **Medium Component**: Moderate complexity with some iteration
3. **Slow Component**: High complexity with deep nesting and many components

Performance tests will evaluate:
- Component count
- Nesting depth
- Rendering complexity
- Memory usage implications
        `,
      },
    },
  },
};
