import type { Meta, StoryObj } from '@storybook/svelte';
import PerformanceMonitor from './PerformanceMonitor.svelte';

const meta: Meta<PerformanceMonitor> = {
  title: 'YAML Driven/Performance Monitoring',
  component: PerformanceMonitor,
  parameters: {
    docs: {
      description: {
        component: `
# Performance Monitoring for YAML Components

This component wraps the YamlRenderer with performance monitoring capabilities, providing:

- **Render Time**: How long it takes to render the component
- **Component Count**: Number of components in the YAML structure
- **Memory Usage**: JavaScript heap memory usage (when available)
- **Performance Rating**: Automatic rating based on render time

## Performance Guidelines

- **Excellent** (< 10ms): Optimal performance
- **Good** (10-50ms): Acceptable performance
- **Fair** (50-100ms): May need optimization
- **Slow** (> 100ms): Requires optimization

## Optimization Tips

1. **Reduce Component Count**: Simplify complex nested structures
2. **Limit Deep Nesting**: Avoid excessive component nesting
3. **Use Efficient Layouts**: Prefer CSS Grid/Flexbox over complex div structures
4. **Optimize Large Lists**: Consider virtualization for 100+ items
        `,
      },
    },
  },
  argTypes: {
    schema: {
      control: 'object',
      description: 'YAML component schema to render and monitor',
    },
    theme: {
      control: 'object',
      description: 'Theme configuration',
    },
    context: {
      control: 'object',
      description: 'Additional context data',
    },
    showMetrics: {
      control: 'boolean',
      description: 'Show performance metrics',
    },
  },
};

export default meta;
type Story = StoryObj<PerformanceMonitor>;

// Simple component (baseline)
export const SimpleComponent: Story = {
  args: {
    schema: {
      name: 'button',
      props: {
        text: 'Simple Button',
        variant: 'primary',
        size: 'md'
      },
      description: 'Simple button for performance baseline'
    },
    theme: {},
    context: {},
    showMetrics: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Baseline performance test with a simple button component. Should show excellent performance.',
      },
    },
  },
};

// Medium complexity component
export const MediumComplexity: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'max-w-md mx-auto bg-white rounded-lg shadow-md p-6',
        content: [
          {
            h2: {
              content: 'User Profile',
              class: 'text-xl font-bold mb-4'
            }
          },
          {
            div: {
              class: 'flex items-center space-x-4 mb-4',
              content: [
                {
                  icon: {
                    name: 'mdi:account-circle',
                    class: 'text-4xl text-blue-500'
                  }
                },
                {
                  div: {
                    content: [
                      {
                        p: {
                          content: 'John Doe',
                          class: 'font-semibold text-gray-900'
                        }
                      },
                      {
                        p: {
                          content: 'Software Developer',
                          class: 'text-gray-600'
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
              class: 'space-y-2 mb-4',
              content: [
                {
                  input: {
                    label: 'Email',
                    value: 'john@example.com',
                    type: 'email'
                  }
                },
                {
                  input: {
                    label: 'Phone',
                    value: '+1 (555) 123-4567',
                    type: 'tel'
                  }
                }
              ]
            }
          },
          {
            div: {
              class: 'flex space-x-2',
              content: [
                {
                  button: {
                    text: 'Save',
                    variant: 'primary',
                    size: 'sm'
                  }
                },
                {
                  button: {
                    text: 'Cancel',
                    variant: 'outline',
                    size: 'sm'
                  }
                }
              ]
            }
          }
        ]
      },
      description: 'Medium complexity user profile component'
    },
    theme: {},
    context: {},
    showMetrics: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium complexity component with multiple nested elements. Should show good to fair performance.',
      },
    },
  },
};

// High complexity component
export const HighComplexity: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'max-w-4xl mx-auto p-6',
        content: Array.from({ length: 20 }, (_, i) => ({
          div: {
            class: 'bg-white rounded-lg shadow-md p-4 mb-4',
            content: [
              {
                div: {
                  class: 'flex justify-between items-start mb-3',
                  content: [
                    {
                      div: {
                        content: [
                          {
                            h3: {
                              content: `Item ${i + 1}`,
                              class: 'text-lg font-semibold'
                            }
                          },
                          {
                            p: {
                              content: `Description for item ${i + 1}`,
                              class: 'text-gray-600'
                            }
                          }
                        ]
                      }
                    },
                    {
                      div: {
                        class: 'flex space-x-2',
                        content: [
                          {
                            button: {
                              text: 'Edit',
                              variant: 'outline',
                              size: 'xs'
                            }
                          },
                          {
                            button: {
                              text: 'Delete',
                              variant: 'outline',
                              size: 'xs',
                              class: 'text-red-600'
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
                  class: 'grid grid-cols-3 gap-2',
                  content: Array.from({ length: 6 }, (_, j) => ({
                    div: {
                      class: 'bg-gray-100 p-2 rounded text-center',
                      content: {
                        p: {
                          content: `Data ${j + 1}`,
                          class: 'text-xs text-gray-600'
                        }
                      }
                    }
                  }))
                }
              }
            ]
          }
        }))
      },
      description: 'High complexity component with many nested elements'
    },
    theme: {},
    context: {},
    showMetrics: true
  },
  parameters: {
    docs: {
      description: {
        story: 'High complexity component with many nested elements. May show fair to slow performance and trigger optimization tips.',
      },
    },
  },
};

// Performance comparison
export const PerformanceComparison: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'space-y-8 p-6',
        content: [
          {
            h1: {
              content: 'Performance Comparison',
              class: 'text-2xl font-bold mb-6'
            }
          },
          {
            div: {
              class: 'grid grid-cols-1 md:grid-cols-3 gap-6',
              content: [
                {
                  div: {
                    class: 'bg-green-50 border border-green-200 rounded-lg p-4',
                    content: [
                      {
                        h3: {
                          content: 'Simple (Fast)',
                          class: 'text-lg font-semibold text-green-800 mb-2'
                        }
                      },
                      {
                        button: {
                          text: 'Simple Button',
                          variant: 'primary',
                          size: 'md'
                        }
                      },
                      {
                        p: {
                          content: 'Single component, minimal nesting',
                          class: 'text-sm text-green-700 mt-2'
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
                          content: 'Medium (Moderate)',
                          class: 'text-lg font-semibold text-yellow-800 mb-2'
                        }
                      },
                      {
                        div: {
                          class: 'space-y-2',
                          content: [
                            {
                              input: {
                                label: 'Name',
                                placeholder: 'Enter name'
                              }
                            },
                            {
                              div: {
                                class: 'flex space-x-2',
                                content: [
                                  {
                                    button: {
                                      text: 'Save',
                                      variant: 'primary',
                                      size: 'sm'
                                    }
                                  },
                                  {
                                    button: {
                                      text: 'Cancel',
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
                        p: {
                          content: 'Multiple components, some nesting',
                          class: 'text-sm text-yellow-700 mt-2'
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
                          content: 'Complex (Slow)',
                          class: 'text-lg font-semibold text-red-800 mb-2'
                        }
                      },
                      {
                        div: {
                          class: 'space-y-1',
                          content: Array.from({ length: 5 }, (_, i) => ({
                            div: {
                              class: 'flex items-center justify-between bg-white p-2 rounded border',
                              content: [
                                {
                                  p: {
                                    content: `Item ${i + 1}`,
                                    class: 'text-sm'
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
                          content: 'Many components, deep nesting',
                          class: 'text-sm text-red-700 mt-2'
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
      description: 'Performance comparison between different complexity levels'
    },
    theme: {},
    context: {},
    showMetrics: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of different component complexity levels and their performance characteristics.',
      },
    },
  },
};
