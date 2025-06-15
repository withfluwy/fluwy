import type { Meta, StoryObj } from '@storybook/svelte';
import PerformanceMonitor from './PerformanceMonitor.svelte';
import { createComponent, dashboard } from './SchemaBuilder.js';

const meta: Meta<PerformanceMonitor> = {
  title: 'YAML Driven/System Showcase',
  component: PerformanceMonitor,
  parameters: {
    docs: {
      description: {
        component: `
# Complete YAML-Driven Storybook System Showcase

This showcase demonstrates the full capabilities of the YAML-driven Storybook system, including:

- **Schema-driven component rendering**
- **Real-time performance monitoring**
- **Programmatic schema building**
- **Theme integration**
- **Validation and error handling**

## System Architecture

\`\`\`
YAML Schema → Validation → Rendering → Performance Monitoring
     ↓              ↓           ↓              ↓
SchemaBuilder → YamlValidator → YamlRenderer → PerformanceMonitor
\`\`\`

## Key Innovations

1. **No Traditional Stories**: Components defined entirely through YAML
2. **Universal Renderer**: Single component handles all Fluwy components
3. **Real-time Validation**: Immediate feedback on schema issues
4. **Performance Insights**: Built-in monitoring and optimization tips
5. **Type-safe Building**: Programmatic schema creation with IntelliSense
        `,
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
    showMetrics: {
      control: 'boolean',
      description: 'Show performance metrics',
    },
  },
};

export default meta;
type Story = StoryObj<PerformanceMonitor>;

// Complete system demonstration
export const CompleteSystemDemo: Story = {
  args: {
    schema: createComponent('div')
      .class('min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100')
      // Header
      .container('bg-white shadow-lg border-b', (header) => {
        header.container('max-w-7xl mx-auto px-4 py-6', (inner) => {
          inner.flex('row', '0', (flex) => {
            flex.class('justify-between items-center')
                .container('', (left) => {
                  left.heading(1, 'YAML-Driven Storybook', 'text-3xl font-bold text-gray-900')
                      .paragraph('Revolutionary component testing through schema configuration', 'text-gray-600 mt-1');
                })
                .flex('row', '3', (right) => {
                  right.button('Documentation', 'outline', 'sm')
                       .button('GitHub', 'primary', 'sm');
                });
          });
        });
      })
      // Hero section
      .container('py-16', (hero) => {
        hero.container('max-w-4xl mx-auto text-center px-4', (content) => {
          content.heading(2, 'Complete System Showcase', 'text-4xl font-bold text-gray-900 mb-6')
                 .paragraph('This entire interface is generated from a single YAML schema using the SchemaBuilder API', 'text-xl text-gray-600 mb-8')
                 .flex('row', '4', (stats) => {
                   stats.class('justify-center')
                        .container('bg-white rounded-lg shadow-md p-6', (stat1) => {
                          stat1.heading(3, '21+', 'text-3xl font-bold text-blue-600')
                               .paragraph('Story Files', 'text-gray-600');
                        })
                        .container('bg-white rounded-lg shadow-md p-6', (stat2) => {
                          stat2.heading(3, '6', 'text-3xl font-bold text-green-600')
                               .paragraph('Core Utilities', 'text-gray-600');
                        })
                        .container('bg-white rounded-lg shadow-md p-6', (stat3) => {
                          stat3.heading(3, '150+', 'text-3xl font-bold text-purple-600')
                               .paragraph('Examples', 'text-gray-600');
                        })
                        .container('bg-white rounded-lg shadow-md p-6', (stat4) => {
                          stat4.heading(3, '100%', 'text-3xl font-bold text-orange-600')
                               .paragraph('YAML-Driven', 'text-gray-600');
                        });
                 });
        });
      })
      // Features grid
      .container('py-16 bg-white', (features) => {
        features.container('max-w-7xl mx-auto px-4', (content) => {
          content.heading(2, 'System Features', 'text-3xl font-bold text-center text-gray-900 mb-12')
                 .grid(3, '8', (grid) => {
                   // Feature 1: Schema-Driven
                   grid.container('text-center', (feature1) => {
                     feature1.container('w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4', (icon) => {
                       icon.icon('mdi:file-code', 'text-2xl text-white');
                     })
                     .heading(3, 'Schema-Driven', 'text-xl font-semibold text-gray-900 mb-2')
                     .paragraph('Components defined entirely through YAML schemas with full validation', 'text-gray-600');
                   })
                   // Feature 2: Performance Monitoring
                   .container('text-center', (feature2) => {
                     feature2.container('w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4', (icon) => {
                       icon.icon('mdi:speedometer', 'text-2xl text-white');
                     })
                     .heading(3, 'Performance Monitoring', 'text-xl font-semibold text-gray-900 mb-2')
                     .paragraph('Real-time performance metrics with optimization suggestions', 'text-gray-600');
                   })
                   // Feature 3: Auto-Generation
                   .container('text-center', (feature3) => {
                     feature3.container('w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4', (icon) => {
                       icon.icon('mdi:auto-fix', 'text-2xl text-white');
                     })
                     .heading(3, 'Auto-Generation', 'text-xl font-semibold text-gray-900 mb-2')
                     .paragraph('Automatic story generation from theme files and schemas', 'text-gray-600');
                   })
                   // Feature 4: Type Safety
                   .container('text-center', (feature4) => {
                     feature4.container('w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4', (icon) => {
                       icon.icon('mdi:shield-check', 'text-2xl text-white');
                     })
                     .heading(3, 'Type Safety', 'text-xl font-semibold text-gray-900 mb-2')
                     .paragraph('Full TypeScript support with IntelliSense and compile-time checking', 'text-gray-600');
                   })
                   // Feature 5: Testing Framework
                   .container('text-center', (feature5) => {
                     feature5.container('w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4', (icon) => {
                       icon.icon('mdi:test-tube', 'text-2xl text-white');
                     })
                     .heading(3, 'Testing Framework', 'text-xl font-semibold text-gray-900 mb-2')
                     .paragraph('Comprehensive automated testing for validation and accessibility', 'text-gray-600');
                   })
                   // Feature 6: Theme Integration
                   .container('text-center', (feature6) => {
                     feature6.container('w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4', (icon) => {
                       icon.icon('mdi:palette', 'text-2xl text-white');
                     })
                     .heading(3, 'Theme Integration', 'text-xl font-semibold text-gray-900 mb-2')
                     .paragraph('Deep integration with Fluwy\'s theme system for comprehensive testing', 'text-gray-600');
                   });
                 });
        });
      })
      // Code example
      .container('py-16 bg-gray-50', (codeSection) => {
        codeSection.container('max-w-6xl mx-auto px-4', (content) => {
          content.heading(2, 'Schema Builder Example', 'text-3xl font-bold text-center text-gray-900 mb-12')
                 .grid(2, '8', (grid) => {
                   // Code
                   grid.container('', (codeBlock) => {
                     codeBlock.heading(3, 'TypeScript Code', 'text-xl font-semibold text-gray-900 mb-4')
                              .container('bg-gray-900 rounded-lg p-6 overflow-x-auto', (code) => {
                                code.paragraph(`createComponent('div')
  .class('bg-white rounded-lg shadow-md p-6')
  .heading(2, 'Welcome Card', 'text-xl font-bold mb-2')
  .paragraph('Built with SchemaBuilder API')
  .flex('row', '2', (actions) => {
    actions.button('Learn More', 'primary', 'sm')
           .button('Cancel', 'outline', 'sm');
  })
  .build()`, 'text-green-400 font-mono text-sm whitespace-pre');
                              });
                   })
                   // Result
                   .container('', (result) => {
                     result.heading(3, 'Rendered Result', 'text-xl font-semibold text-gray-900 mb-4')
                           .container('bg-white rounded-lg shadow-md p-6', (card) => {
                             card.heading(2, 'Welcome Card', 'text-xl font-bold mb-2')
                                 .paragraph('Built with SchemaBuilder API', 'text-gray-600 mb-4')
                                 .flex('row', '2', (actions) => {
                                   actions.button('Learn More', 'primary', 'sm')
                                          .button('Cancel', 'outline', 'sm');
                                 });
                           });
                   });
                 });
        });
      })
      // Footer
      .container('bg-gray-900 text-white py-12', (footer) => {
        footer.container('max-w-7xl mx-auto px-4 text-center', (content) => {
          content.heading(2, 'Ready to Get Started?', 'text-2xl font-bold mb-4')
                 .paragraph('Experience the future of component testing with YAML-driven Storybook', 'text-gray-300 mb-8')
                 .flex('row', '4', (actions) => {
                   actions.class('justify-center')
                          .button('View Documentation', 'primary', 'lg')
                          .button('Explore Examples', 'outline', 'lg')
                          .button('GitHub Repository', 'ghost', 'lg');
                 })
                 .container('mt-12 pt-8 border-t border-gray-700', (copyright) => {
                   copyright.paragraph('© 2024 Fluwy UI - YAML-Driven Storybook System', 'text-gray-400 text-sm');
                 });
        });
      })
      .build(),
    theme: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb'
        }
      }
    },
    context: {},
    showMetrics: true
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates the complete YAML-driven Storybook system in action. The entire interface you see is generated from a single YAML schema created using the SchemaBuilder API.

**Key Highlights:**

1. **Complex Layout**: Multi-section layout with header, hero, features, code example, and footer
2. **Performance Monitoring**: Real-time metrics showing render time and component count
3. **Schema Builder**: Programmatic creation using the fluent API
4. **Theme Integration**: Uses theme colors and styling
5. **Responsive Design**: Grid layouts and responsive utilities
6. **Rich Content**: Icons, typography, buttons, and interactive elements

**Performance Metrics:**
- This complex layout contains 50+ components
- Demonstrates the system's ability to handle large schemas
- Shows real-time performance monitoring in action

**Schema Builder Benefits:**
- Type-safe component creation
- IntelliSense support
- Readable, maintainable code
- Easy refactoring and updates
        `,
      },
    },
  },
};
