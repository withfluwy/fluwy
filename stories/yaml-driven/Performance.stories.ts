import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from './YamlRenderer.svelte';
import { YamlStoryGenerator } from './yaml-story-generator.js';

const meta: Meta<YamlRenderer> = YamlStoryGenerator.createMeta(
  'YAML Driven/Performance',
  'Performance testing and optimization examples for YAML-driven components'
);

export default meta;
type Story = StoryObj<YamlRenderer>;

// Generate a large list of components for performance testing
function generateLargeComponentList(count: number) {
  const components = [];
  for (let i = 0; i < count; i++) {
    components.push({
      div: {
        class: 'flex items-center justify-between p-3 border-b border-gray-200',
        content: [
          {
            div: {
              class: 'flex items-center space-x-3',
              content: [
                {
                  icon: {
                    name: 'mdi:user',
                    class: 'text-blue-500'
                  }
                },
                {
                  div: {
                    content: [
                      {
                        p: {
                          content: `User ${i + 1}`,
                          class: 'font-medium text-gray-900'
                        }
                      },
                      {
                        p: {
                          content: `user${i + 1}@example.com`,
                          class: 'text-sm text-gray-500'
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
              class: 'flex space-x-2',
              content: [
                {
                  button: {
                    text: 'Edit',
                    variant: 'outline',
                    size: 'sm'
                  }
                },
                {
                  button: {
                    text: 'Delete',
                    variant: 'outline',
                    size: 'sm',
                    class: 'text-red-600 border-red-600 hover:bg-red-50'
                  }
                }
              ]
            }
          }
        ]
      }
    });
  }
  return components;
}

// Small component list (good performance)
export const SmallList: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden',
    content: [
      {
        div: {
          class: 'bg-gray-50 px-6 py-4 border-b',
          content: {
            h2: {
              content: 'Small List (10 items)',
              class: 'text-lg font-semibold text-gray-900'
            }
          }
        }
      },
      {
        div: {
          class: 'divide-y divide-gray-200',
          content: generateLargeComponentList(10)
        }
      }
    ]
  },
  description: 'Small list of components for baseline performance'
});

// Medium component list
export const MediumList: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden',
    content: [
      {
        div: {
          class: 'bg-gray-50 px-6 py-4 border-b',
          content: {
            h2: {
              content: 'Medium List (50 items)',
              class: 'text-lg font-semibold text-gray-900'
            }
          }
        }
      },
      {
        div: {
          class: 'max-h-96 overflow-y-auto divide-y divide-gray-200',
          content: generateLargeComponentList(50)
        }
      }
    ]
  },
  description: 'Medium list testing component rendering performance'
});

// Large component list (stress test)
export const LargeList: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden',
    content: [
      {
        div: {
          class: 'bg-gray-50 px-6 py-4 border-b',
          content: [
            {
              h2: {
                content: 'Large List (100 items)',
                class: 'text-lg font-semibold text-gray-900'
              }
            },
            {
              p: {
                content: 'This tests the performance of rendering many components via YAML.',
                class: 'text-sm text-gray-600 mt-1'
              }
            }
          ]
        }
      },
      {
        div: {
          class: 'max-h-96 overflow-y-auto divide-y divide-gray-200',
          content: generateLargeComponentList(100)
        }
      }
    ]
  },
  description: 'Large list stress testing YAML component rendering'
});

// Deep nesting test
export const DeepNesting: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'max-w-2xl mx-auto p-6',
    content: [
      {
        h2: {
          content: 'Deep Nesting Test',
          class: 'text-xl font-bold mb-4'
        }
      },
      {
        div: {
          class: 'border border-gray-300 p-4 rounded',
          content: [
            {
              p: {
                content: 'Level 1',
                class: 'font-semibold text-blue-600'
              }
            },
            {
              div: {
                class: 'ml-4 border-l-2 border-blue-200 pl-4 mt-2',
                content: [
                  {
                    p: {
                      content: 'Level 2',
                      class: 'font-semibold text-green-600'
                    }
                  },
                  {
                    div: {
                      class: 'ml-4 border-l-2 border-green-200 pl-4 mt-2',
                      content: [
                        {
                          p: {
                            content: 'Level 3',
                            class: 'font-semibold text-purple-600'
                          }
                        },
                        {
                          div: {
                            class: 'ml-4 border-l-2 border-purple-200 pl-4 mt-2',
                            content: [
                              {
                                p: {
                                  content: 'Level 4',
                                  class: 'font-semibold text-red-600'
                                }
                              },
                              {
                                div: {
                                  class: 'ml-4 border-l-2 border-red-200 pl-4 mt-2',
                                  content: [
                                    {
                                      p: {
                                        content: 'Level 5 - Deep nesting test complete',
                                        class: 'font-semibold text-orange-600'
                                      }
                                    },
                                    {
                                      button: {
                                        text: 'Action at depth 5',
                                        variant: 'filled',
                                        size: 'sm',
                                        class: 'mt-2'
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
        }
      }
    ]
  },
  description: 'Testing deep component nesting performance'
});

// Complex dashboard simulation
export const ComplexDashboard: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'min-h-screen bg-gray-100',
    content: [
      {
        header: {
          class: 'bg-white shadow-sm border-b',
          content: {
            div: {
              class: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4',
              content: [
                {
                  div: {
                    class: 'flex justify-between items-center',
                    content: [
                      {
                        h1: {
                          content: 'Performance Dashboard',
                          class: 'text-2xl font-bold text-gray-900'
                        }
                      },
                      {
                        div: {
                          class: 'flex space-x-2',
                          content: [
                            {
                              button: {
                                text: 'Refresh',
                                variant: 'outline',
                                size: 'sm'
                              }
                            },
                            {
                              button: {
                                text: 'Settings',
                                variant: 'filled',
                                size: 'sm'
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
        }
      },
      {
        div: {
          class: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
          content: [
            {
              div: {
                class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8',
                content: [
                  {
                    div: {
                      class: 'bg-white rounded-lg shadow p-6',
                      content: [
                        {
                          div: {
                            class: 'flex items-center',
                            content: [
                              {
                                icon: {
                                  name: 'mdi:chart-line',
                                  class: 'text-3xl text-blue-500'
                                }
                              },
                              {
                                div: {
                                  class: 'ml-4',
                                  content: [
                                    {
                                      p: {
                                        content: 'Total Users',
                                        class: 'text-sm font-medium text-gray-500'
                                      }
                                    },
                                    {
                                      p: {
                                        content: '12,345',
                                        class: 'text-2xl font-bold text-gray-900'
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
                  },
                  {
                    div: {
                      class: 'bg-white rounded-lg shadow p-6',
                      content: [
                        {
                          div: {
                            class: 'flex items-center',
                            content: [
                              {
                                icon: {
                                  name: 'mdi:currency-usd',
                                  class: 'text-3xl text-green-500'
                                }
                              },
                              {
                                div: {
                                  class: 'ml-4',
                                  content: [
                                    {
                                      p: {
                                        content: 'Revenue',
                                        class: 'text-sm font-medium text-gray-500'
                                      }
                                    },
                                    {
                                      p: {
                                        content: '$98,765',
                                        class: 'text-2xl font-bold text-gray-900'
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
                  },
                  {
                    div: {
                      class: 'bg-white rounded-lg shadow p-6',
                      content: [
                        {
                          div: {
                            class: 'flex items-center',
                            content: [
                              {
                                icon: {
                                  name: 'mdi:shopping-cart',
                                  class: 'text-3xl text-purple-500'
                                }
                              },
                              {
                                div: {
                                  class: 'ml-4',
                                  content: [
                                    {
                                      p: {
                                        content: 'Orders',
                                        class: 'text-sm font-medium text-gray-500'
                                      }
                                    },
                                    {
                                      p: {
                                        content: '1,234',
                                        class: 'text-2xl font-bold text-gray-900'
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
                  },
                  {
                    div: {
                      class: 'bg-white rounded-lg shadow p-6',
                      content: [
                        {
                          div: {
                            class: 'flex items-center',
                            content: [
                              {
                                icon: {
                                  name: 'mdi:trending-up',
                                  class: 'text-3xl text-orange-500'
                                }
                              },
                              {
                                div: {
                                  class: 'ml-4',
                                  content: [
                                    {
                                      p: {
                                        content: 'Growth',
                                        class: 'text-sm font-medium text-gray-500'
                                      }
                                    },
                                    {
                                      p: {
                                        content: '+23.5%',
                                        class: 'text-2xl font-bold text-gray-900'
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
            },
            {
              div: {
                class: 'bg-white rounded-lg shadow',
                content: [
                  {
                    div: {
                      class: 'px-6 py-4 border-b border-gray-200',
                      content: {
                        h3: {
                          content: 'Recent Activity',
                          class: 'text-lg font-medium text-gray-900'
                        }
                      }
                    }
                  },
                  {
                    div: {
                      class: 'max-h-64 overflow-y-auto',
                      content: generateLargeComponentList(25)
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
  description: 'Complex dashboard with multiple components and data'
});
