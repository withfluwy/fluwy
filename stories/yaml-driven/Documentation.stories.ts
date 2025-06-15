import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from './YamlRenderer.svelte';
import { YamlStoryGenerator } from './yaml-story-generator.js';

const meta: Meta<YamlRenderer> = YamlStoryGenerator.createMeta(
  'YAML Driven/Documentation',
  'Comprehensive documentation and examples for the YAML-driven Storybook system'
);

export default meta;
type Story = StoryObj<YamlRenderer>;

// Overview and introduction
export const SystemOverview: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'max-w-4xl mx-auto p-8 space-y-8',
        content: [
          {
            div: {
              class: 'text-center mb-12',
              content: [
                {
                  h1: {
                    content: 'YAML-Driven Storybook System',
                    class: 'text-4xl font-bold text-gray-900 mb-4'
                  }
                },
                {
                  p: {
                    content: 'A revolutionary approach to component testing through YAML schema configuration',
                    class: 'text-xl text-gray-600 max-w-2xl mx-auto'
                  }
                }
              ]
            }
          },
          {
            div: {
              class: 'grid grid-cols-1 md:grid-cols-3 gap-8',
              content: [
                {
                  div: {
                    class: 'bg-blue-50 border border-blue-200 rounded-lg p-6 text-center',
                    content: [
                      {
                        div: {
                          class: 'w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4',
                          content: {
                            icon: {
                              name: 'mdi:file-code',
                              class: 'text-2xl text-white'
                            }
                          }
                        }
                      },
                      {
                        h3: {
                          content: 'Schema-Driven',
                          class: 'text-lg font-semibold text-blue-800 mb-2'
                        }
                      },
                      {
                        p: {
                          content: 'Define components using YAML schemas instead of traditional story files',
                          class: 'text-blue-700 text-sm'
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    class: 'bg-green-50 border border-green-200 rounded-lg p-6 text-center',
                    content: [
                      {
                        div: {
                          class: 'w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4',
                          content: {
                            icon: {
                              name: 'mdi:auto-fix',
                              class: 'text-2xl text-white'
                            }
                          }
                        }
                      },
                      {
                        h3: {
                          content: 'Auto-Generated',
                          class: 'text-lg font-semibold text-green-800 mb-2'
                        }
                      },
                      {
                        p: {
                          content: 'Automatically generate stories from theme files and component definitions',
                          class: 'text-green-700 text-sm'
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    class: 'bg-purple-50 border border-purple-200 rounded-lg p-6 text-center',
                    content: [
                      {
                        div: {
                          class: 'w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4',
                          content: {
                            icon: {
                              name: 'mdi:palette',
                              class: 'text-2xl text-white'
                            }
                          }
                        }
                      },
                      {
                        h3: {
                          content: 'Theme-Integrated',
                          class: 'text-lg font-semibold text-purple-800 mb-2'
                        }
                      },
                      {
                        p: {
                          content: 'Full integration with Fluwy\'s theme system for comprehensive testing',
                          class: 'text-purple-700 text-sm'
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
              class: 'bg-gray-50 rounded-lg p-6',
              content: [
                {
                  h2: {
                    content: 'Key Features',
                    class: 'text-2xl font-bold text-gray-900 mb-4'
                  }
                },
                {
                  div: {
                    class: 'grid grid-cols-1 md:grid-cols-2 gap-4',
                    content: [
                      {
                        div: {
                          class: 'flex items-start space-x-3',
                          content: [
                            {
                              icon: {
                                name: 'mdi:check-circle',
                                class: 'text-green-500 mt-1'
                              }
                            },
                            {
                              div: {
                                content: [
                                  {
                                    p: {
                                      content: 'Universal Component Renderer',
                                      class: 'font-semibold text-gray-900'
                                    }
                                  },
                                  {
                                    p: {
                                      content: 'Single renderer handles all Fluwy components',
                                      class: 'text-sm text-gray-600'
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
                          class: 'flex items-start space-x-3',
                          content: [
                            {
                              icon: {
                                name: 'mdi:check-circle',
                                class: 'text-green-500 mt-1'
                              }
                            },
                            {
                              div: {
                                content: [
                                  {
                                    p: {
                                      content: 'Schema Validation',
                                      class: 'font-semibold text-gray-900'
                                    }
                                  },
                                  {
                                    p: {
                                      content: 'Comprehensive validation with helpful error messages',
                                      class: 'text-sm text-gray-600'
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
                          class: 'flex items-start space-x-3',
                          content: [
                            {
                              icon: {
                                name: 'mdi:check-circle',
                                class: 'text-green-500 mt-1'
                              }
                            },
                            {
                              div: {
                                content: [
                                  {
                                    p: {
                                      content: 'Performance Monitoring',
                                      class: 'font-semibold text-gray-900'
                                    }
                                  },
                                  {
                                    p: {
                                      content: 'Real-time performance metrics and optimization tips',
                                      class: 'text-sm text-gray-600'
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
                          class: 'flex items-start space-x-3',
                          content: [
                            {
                              icon: {
                                name: 'mdi:check-circle',
                                class: 'text-green-500 mt-1'
                              }
                            },
                            {
                              div: {
                                content: [
                                  {
                                    p: {
                                      content: 'Automated Testing',
                                      class: 'font-semibold text-gray-900'
                                    }
                                  },
                                  {
                                    p: {
                                      content: 'Built-in testing utilities for validation and accessibility',
                                      class: 'text-sm text-gray-600'
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
              ]
            }
          }
        ]
      },
      description: 'System overview and key features'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete overview of the YAML-driven Storybook system, its features, and benefits.',
      },
    },
  },
};

// Quick start guide
export const QuickStartGuide: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'max-w-4xl mx-auto p-8 space-y-8',
        content: [
          {
            h1: {
              content: 'Quick Start Guide',
              class: 'text-3xl font-bold text-gray-900 mb-6'
            }
          },
          {
            div: {
              class: 'space-y-6',
              content: [
                {
                  div: {
                    class: 'bg-blue-50 border-l-4 border-blue-400 p-4',
                    content: [
                      {
                        h3: {
                          content: 'Step 1: Run Storybook',
                          class: 'text-lg font-semibold text-blue-800 mb-2'
                        }
                      },
                      {
                        div: {
                          class: 'bg-blue-100 p-3 rounded font-mono text-sm',
                          content: {
                            p: {
                              content: 'npm run storybook:yaml',
                              class: 'text-blue-800'
                            }
                          }
                        }
                      },
                      {
                        p: {
                          content: 'This generates stories from YAML files and starts Storybook',
                          class: 'text-blue-700 mt-2'
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    class: 'bg-green-50 border-l-4 border-green-400 p-4',
                    content: [
                      {
                        h3: {
                          content: 'Step 2: Create YAML Schema',
                          class: 'text-lg font-semibold text-green-800 mb-2'
                        }
                      },
                      {
                        div: {
                          class: 'bg-green-100 p-3 rounded font-mono text-sm',
                          content: {
                            p: {
                              content: `# app/themes/my-test.yaml
components:
  - name: "button"
    props:
      text: "My Button"
      variant: "primary"`,
                              class: 'text-green-800 whitespace-pre'
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    class: 'bg-purple-50 border-l-4 border-purple-400 p-4',
                    content: [
                      {
                        h3: {
                          content: 'Step 3: Generate Stories',
                          class: 'text-lg font-semibold text-purple-800 mb-2'
                        }
                      },
                      {
                        div: {
                          class: 'bg-purple-100 p-3 rounded font-mono text-sm',
                          content: {
                            p: {
                              content: 'npm run generate-yaml-stories',
                              class: 'text-purple-800'
                            }
                          }
                        }
                      },
                      {
                        p: {
                          content: 'Automatically generates TypeScript story files from your YAML',
                          class: 'text-purple-700 mt-2'
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
      description: 'Quick start guide for getting up and running'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Step-by-step guide to get started with the YAML-driven Storybook system.',
      },
    },
  },
};

// Available tools and utilities
export const ToolsAndUtilities: Story = {
  args: {
    schema: {
      name: 'div',
      props: {
        class: 'max-w-6xl mx-auto p-8 space-y-8',
        content: [
          {
            h1: {
              content: 'Tools & Utilities',
              class: 'text-3xl font-bold text-gray-900 mb-6'
            }
          },
          {
            div: {
              class: 'grid grid-cols-1 md:grid-cols-2 gap-8',
              content: [
                {
                  div: {
                    class: 'bg-white border border-gray-200 rounded-lg p-6',
                    content: [
                      {
                        h3: {
                          content: 'YamlRenderer',
                          class: 'text-xl font-semibold text-gray-900 mb-3'
                        }
                      },
                      {
                        p: {
                          content: 'Universal component renderer that can display any Fluwy component based on YAML schema.',
                          class: 'text-gray-600 mb-4'
                        }
                      },
                      {
                        div: {
                          class: 'bg-gray-50 p-3 rounded text-sm font-mono',
                          content: {
                            p: {
                              content: '<YamlRenderer {schema} {theme} />',
                              class: 'text-gray-800'
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    class: 'bg-white border border-gray-200 rounded-lg p-6',
                    content: [
                      {
                        h3: {
                          content: 'YamlValidator',
                          class: 'text-xl font-semibold text-gray-900 mb-3'
                        }
                      },
                      {
                        p: {
                          content: 'Comprehensive validation system with error reporting and suggestions.',
                          class: 'text-gray-600 mb-4'
                        }
                      },
                      {
                        div: {
                          class: 'bg-gray-50 p-3 rounded text-sm font-mono',
                          content: {
                            p: {
                              content: 'YamlValidator.validateSchema(schema)',
                              class: 'text-gray-800'
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    class: 'bg-white border border-gray-200 rounded-lg p-6',
                    content: [
                      {
                        h3: {
                          content: 'SchemaBuilder',
                          class: 'text-xl font-semibold text-gray-900 mb-3'
                        }
                      },
                      {
                        p: {
                          content: 'Fluent API for programmatically creating YAML schemas with type safety.',
                          class: 'text-gray-600 mb-4'
                        }
                      },
                      {
                        div: {
                          class: 'bg-gray-50 p-3 rounded text-sm font-mono',
                          content: {
                            p: {
                              content: 'createComponent("div").class("p-4")',
                              class: 'text-gray-800'
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    class: 'bg-white border border-gray-200 rounded-lg p-6',
                    content: [
                      {
                        h3: {
                          content: 'PerformanceMonitor',
                          class: 'text-xl font-semibold text-gray-900 mb-3'
                        }
                      },
                      {
                        p: {
                          content: 'Real-time performance monitoring with metrics and optimization tips.',
                          class: 'text-gray-600 mb-4'
                        }
                      },
                      {
                        div: {
                          class: 'bg-gray-50 p-3 rounded text-sm font-mono',
                          content: {
                            p: {
                              content: '<PerformanceMonitor {schema} />',
                              class: 'text-gray-800'
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    class: 'bg-white border border-gray-200 rounded-lg p-6',
                    content: [
                      {
                        h3: {
                          content: 'YamlTester',
                          class: 'text-xl font-semibold text-gray-900 mb-3'
                        }
                      },
                      {
                        p: {
                          content: 'Automated testing utilities for validation, performance, and accessibility.',
                          class: 'text-gray-600 mb-4'
                        }
                      },
                      {
                        div: {
                          class: 'bg-gray-50 p-3 rounded text-sm font-mono',
                          content: {
                            p: {
                              content: 'YamlTester.runTestSuite(schema)',
                              class: 'text-gray-800'
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    class: 'bg-white border border-gray-200 rounded-lg p-6',
                    content: [
                      {
                        h3: {
                          content: 'Story Generator',
                          class: 'text-xl font-semibold text-gray-900 mb-3'
                        }
                      },
                      {
                        p: {
                          content: 'Automatic story generation from YAML theme files and schemas.',
                          class: 'text-gray-600 mb-4'
                        }
                      },
                      {
                        div: {
                          class: 'bg-gray-50 p-3 rounded text-sm font-mono',
                          content: {
                            p: {
                              content: 'generate-yaml-stories.js',
                              class: 'text-gray-800'
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
      description: 'Overview of available tools and utilities'
    },
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive overview of all available tools and utilities in the YAML-driven system.',
      },
    },
  },
};
