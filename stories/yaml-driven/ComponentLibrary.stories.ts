import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from './YamlRenderer.svelte';
import { YamlStoryGenerator } from './yaml-story-generator.js';

const meta: Meta<YamlRenderer> = YamlStoryGenerator.createMeta(
  'YAML Driven/Component Library',
  'Comprehensive showcase of all Fluwy components via YAML schemas'
);

export default meta;
type Story = StoryObj<YamlRenderer>;

// Typography components
export const TypographyShowcase: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'space-y-4 p-6',
    content: [
      {
        h1: {
          content: 'Heading 1 - Main Title',
          class: 'text-4xl font-bold text-gray-900'
        }
      },
      {
        h2: {
          content: 'Heading 2 - Section Title',
          class: 'text-3xl font-semibold text-gray-800'
        }
      },
      {
        h3: {
          content: 'Heading 3 - Subsection',
          class: 'text-2xl font-medium text-gray-700'
        }
      },
      {
        h4: {
          content: 'Heading 4 - Minor Section',
          class: 'text-xl font-medium text-gray-600'
        }
      },
      {
        p: {
          content: 'This is a paragraph of text demonstrating the paragraph component. It can contain longer content and will wrap naturally.',
          class: 'text-gray-600 leading-relaxed'
        }
      },
      {
        text: {
          content: 'This is a text component with custom styling.',
          class: 'text-blue-600 font-semibold'
        }
      }
    ]
  },
  description: 'Typography components rendered from YAML'
});

// Form components showcase
export const FormComponentsShowcase: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'max-w-md mx-auto p-6 bg-gray-50 rounded-lg space-y-4',
    content: [
      {
        h2: {
          content: 'Form Components',
          class: 'text-2xl font-bold mb-4'
        }
      },
      {
        input: {
          label: 'Text Input',
          placeholder: 'Enter your name',
          type: 'text'
        }
      },
      {
        input: {
          label: 'Email Input',
          placeholder: 'Enter your email',
          type: 'email'
        }
      },
      {
        input: {
          label: 'Password Input',
          placeholder: 'Enter password',
          type: 'password'
        }
      },
      {
        input: {
          label: 'Number Input',
          placeholder: 'Enter a number',
          type: 'number'
        }
      },
      {
        div: {
          class: 'flex space-x-2',
          content: [
            {
              button: {
                text: 'Submit',
                variant: 'filled',
                size: 'md'
              }
            },
            {
              button: {
                text: 'Cancel',
                variant: 'outline',
                size: 'md'
              }
            }
          ]
        }
      }
    ]
  },
  description: 'Form components collection'
});

// Layout components
export const LayoutShowcase: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'min-h-96',
    content: [
      {
        header: {
          class: 'bg-blue-600 text-white p-4 mb-4',
          content: {
            h1: {
              content: 'Header Component',
              class: 'text-2xl font-bold'
            }
          }
        }
      },
      {
        div: {
          class: 'flex gap-4 mb-4',
          content: [
            {
              sidebar: {
                class: 'w-64 bg-gray-200 p-4 rounded',
                content: [
                  {
                    h3: {
                      content: 'Sidebar',
                      class: 'font-bold mb-2'
                    }
                  },
                  {
                    p: {
                      content: 'Sidebar content goes here.',
                      class: 'text-sm text-gray-600'
                    }
                  }
                ]
              }
            },
            {
              div: {
                class: 'flex-1 bg-white p-4 rounded border',
                content: [
                  {
                    h3: {
                      content: 'Main Content',
                      class: 'font-bold mb-2'
                    }
                  },
                  {
                    p: {
                      content: 'This is the main content area of the layout.',
                      class: 'text-gray-700'
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      {
        footer: {
          class: 'bg-gray-800 text-white p-4 text-center',
          content: {
            p: {
              content: '© 2024 Footer Component',
              class: 'text-sm'
            }
          }
        }
      }
    ]
  },
  description: 'Layout components demonstration'
});

// Interactive components
export const InteractiveShowcase: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'p-6 space-y-6',
    content: [
      {
        h2: {
          content: 'Interactive Components',
          class: 'text-2xl font-bold mb-4'
        }
      },
      {
        div: {
          class: 'space-y-4',
          content: [
            {
              h3: {
                content: 'Buttons',
                class: 'text-lg font-semibold'
              }
            },
            {
              div: {
                class: 'flex flex-wrap gap-2',
                content: [
                  {
                    button: {
                      text: 'Primary',
                      variant: 'filled',
                      size: 'sm'
                    }
                  },
                  {
                    button: {
                      text: 'Secondary',
                      variant: 'outline',
                      size: 'sm'
                    }
                  },
                  {
                    button: {
                      text: 'Ghost',
                      variant: 'ghost',
                      size: 'sm'
                    }
                  },
                  {
                    button: {
                      text: 'Link',
                      variant: 'link',
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
          class: 'space-y-4',
          content: [
            {
              h3: {
                content: 'Links',
                class: 'text-lg font-semibold'
              }
            },
            {
              div: {
                class: 'space-x-4',
                content: [
                  {
                    link: {
                      text: 'Internal Link',
                      href: '#internal',
                      class: 'text-blue-600 hover:text-blue-800'
                    }
                  },
                  {
                    link: {
                      text: 'External Link',
                      href: 'https://example.com',
                      class: 'text-green-600 hover:text-green-800'
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
  description: 'Interactive components showcase'
});

// Media components
export const MediaShowcase: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'p-6 space-y-6',
    content: [
      {
        h2: {
          content: 'Media Components',
          class: 'text-2xl font-bold mb-4'
        }
      },
      {
        div: {
          class: 'space-y-4',
          content: [
            {
              h3: {
                content: 'Icons',
                class: 'text-lg font-semibold'
              }
            },
            {
              div: {
                class: 'flex items-center space-x-4',
                content: [
                  {
                    icon: {
                      name: 'mdi:home',
                      class: 'text-2xl text-blue-500'
                    }
                  },
                  {
                    icon: {
                      name: 'mdi:user',
                      class: 'text-2xl text-green-500'
                    }
                  },
                  {
                    icon: {
                      name: 'mdi:settings',
                      class: 'text-2xl text-gray-500'
                    }
                  },
                  {
                    icon: {
                      name: 'mdi:heart',
                      class: 'text-2xl text-red-500'
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
          class: 'space-y-4',
          content: [
            {
              h3: {
                content: 'Images',
                class: 'text-lg font-semibold'
              }
            },
            {
              image: {
                src: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=YAML+Image',
                alt: 'Placeholder image rendered via YAML',
                class: 'rounded-lg shadow-md'
              }
            }
          ]
        }
      }
    ]
  },
  description: 'Media components (icons, images) showcase'
});

// Complex nested structure
export const ComplexStructure: Story = YamlStoryGenerator.createStory({
  name: 'div',
  props: {
    class: 'max-w-4xl mx-auto p-6',
    content: [
      {
        div: {
          class: 'bg-white rounded-lg shadow-lg overflow-hidden',
          content: [
            {
              div: {
                class: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6',
                content: [
                  {
                    h1: {
                      content: 'Complex Component Structure',
                      class: 'text-3xl font-bold mb-2'
                    }
                  },
                  {
                    p: {
                      content: 'This entire structure is defined in YAML schema format.',
                      class: 'text-blue-100'
                    }
                  }
                ]
              }
            },
            {
              div: {
                class: 'p-6',
                content: [
                  {
                    div: {
                      class: 'grid grid-cols-1 md:grid-cols-2 gap-6',
                      content: [
                        {
                          div: {
                            class: 'space-y-4',
                            content: [
                              {
                                h3: {
                                  content: 'Features',
                                  class: 'text-xl font-semibold'
                                }
                              },
                              {
                                div: {
                                  class: 'space-y-2',
                                  content: [
                                    {
                                      div: {
                                        class: 'flex items-center space-x-2',
                                        content: [
                                          {
                                            icon: {
                                              name: 'mdi:check-circle',
                                              class: 'text-green-500'
                                            }
                                          },
                                          {
                                            text: {
                                              content: 'YAML-driven component rendering',
                                              class: 'text-gray-700'
                                            }
                                          }
                                        ]
                                      }
                                    },
                                    {
                                      div: {
                                        class: 'flex items-center space-x-2',
                                        content: [
                                          {
                                            icon: {
                                              name: 'mdi:check-circle',
                                              class: 'text-green-500'
                                            }
                                          },
                                          {
                                            text: {
                                              content: 'Nested component structures',
                                              class: 'text-gray-700'
                                            }
                                          }
                                        ]
                                      }
                                    },
                                    {
                                      div: {
                                        class: 'flex items-center space-x-2',
                                        content: [
                                          {
                                            icon: {
                                              name: 'mdi:check-circle',
                                              class: 'text-green-500'
                                            }
                                          },
                                          {
                                            text: {
                                              content: 'Theme integration',
                                              class: 'text-gray-700'
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
                            class: 'space-y-4',
                            content: [
                              {
                                h3: {
                                  content: 'Actions',
                                  class: 'text-xl font-semibold'
                                }
                              },
                              {
                                div: {
                                  class: 'space-y-2',
                                  content: [
                                    {
                                      button: {
                                        text: 'Primary Action',
                                        variant: 'filled',
                                        size: 'md',
                                        class: 'w-full'
                                      }
                                    },
                                    {
                                      button: {
                                        text: 'Secondary Action',
                                        variant: 'outline',
                                        size: 'md',
                                        class: 'w-full'
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
  description: 'Complex nested component structure from YAML'
});
