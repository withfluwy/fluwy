import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from './YamlRenderer.svelte';
import { YamlStoryGenerator } from './yaml-story-generator.js';
import { 
  YamlSchemaBuilder, 
  createComponent, 
  button, 
  card, 
  form, 
  navigation, 
  dashboard 
} from './SchemaBuilder.js';

const meta: Meta<YamlRenderer> = YamlStoryGenerator.createMeta(
  'YAML Driven/Schema Builder',
  'Programmatic YAML schema creation using the fluent SchemaBuilder API'
);

export default meta;
type Story = StoryObj<YamlRenderer>;

// Simple button using builder
export const SimpleButton: Story = {
  args: {
    schema: button('Click Me', 'primary', 'md').build(),
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
Created using the SchemaBuilder:

\`\`\`typescript
button('Click Me', 'primary', 'md').build()
\`\`\`

This is equivalent to the YAML:
\`\`\`yaml
name: button
props:
  text: "Click Me"
  variant: "primary"
  size: "md"
\`\`\`
        `,
      },
    },
  },
};

// Card component using builder
export const CardComponent: Story = {
  args: {
    schema: card(
      'Welcome Card',
      'This card was created using the SchemaBuilder API with a fluent interface.',
      [
        { text: 'Learn More', variant: 'primary' },
        { text: 'Cancel', variant: 'outline' }
      ]
    ).build(),
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
Created using the card factory method:

\`\`\`typescript
card(
  'Welcome Card',
  'This card was created using the SchemaBuilder API...',
  [
    { text: 'Learn More', variant: 'primary' },
    { text: 'Cancel', variant: 'outline' }
  ]
).build()
\`\`\`
        `,
      },
    },
  },
};

// Form using builder
export const FormComponent: Story = {
  args: {
    schema: createComponent('div')
      .class('max-w-md mx-auto p-6 bg-white rounded-lg shadow-md')
      .heading(2, 'Contact Form', 'text-xl font-bold mb-4')
      .content(
        form([
          { label: 'Name', placeholder: 'Enter your name' },
          { label: 'Email', type: 'email', placeholder: 'Enter your email' },
          { label: 'Message', placeholder: 'Enter your message' }
        ]).build().props.content
      )
      .flex('row', '2', (b) => {
        b.button('Submit', 'primary', 'md')
         .button('Cancel', 'outline', 'md');
      })
      .build(),
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
Created using the fluent SchemaBuilder API:

\`\`\`typescript
createComponent('div')
  .class('max-w-md mx-auto p-6 bg-white rounded-lg shadow-md')
  .heading(2, 'Contact Form', 'text-xl font-bold mb-4')
  .content(form([...]).build().props.content)
  .flex('row', '2', (b) => {
    b.button('Submit', 'primary', 'md')
     .button('Cancel', 'outline', 'md');
  })
  .build()
\`\`\`
        `,
      },
    },
  },
};

// Navigation using builder
export const NavigationComponent: Story = {
  args: {
    schema: navigation('My App', [
      { text: 'Home', href: '/' },
      { text: 'About', href: '/about' },
      { text: 'Services', href: '/services' },
      { text: 'Contact', href: '/contact' }
    ]).build(),
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
Created using the navigation factory:

\`\`\`typescript
navigation('My App', [
  { text: 'Home', href: '/' },
  { text: 'About', href: '/about' },
  { text: 'Services', href: '/services' },
  { text: 'Contact', href: '/contact' }
]).build()
\`\`\`
        `,
      },
    },
  },
};

// Dashboard using builder
export const DashboardComponent: Story = {
  args: {
    schema: dashboard('Analytics Dashboard', [
      { label: 'Total Users', value: '12,345', icon: 'mdi:account-group' },
      { label: 'Revenue', value: '$98,765', icon: 'mdi:currency-usd' },
      { label: 'Orders', value: '1,234', icon: 'mdi:shopping-cart' },
      { label: 'Growth', value: '+23.5%', icon: 'mdi:trending-up' }
    ]).build(),
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
Created using the dashboard factory:

\`\`\`typescript
dashboard('Analytics Dashboard', [
  { label: 'Total Users', value: '12,345', icon: 'mdi:account-group' },
  { label: 'Revenue', value: '$98,765', icon: 'mdi:currency-usd' },
  { label: 'Orders', value: '1,234', icon: 'mdi:shopping-cart' },
  { label: 'Growth', value: '+23.5%', icon: 'mdi:trending-up' }
]).build()
\`\`\`
        `,
      },
    },
  },
};

// Complex layout using builder
export const ComplexLayout: Story = {
  args: {
    schema: createComponent('div')
      .class('min-h-screen bg-gray-50')
      // Header
      .container('bg-white shadow-sm border-b mb-8', (header) => {
        header.container('max-w-7xl mx-auto px-4 py-4', (inner) => {
          inner.flex('row', '0', (flex) => {
            flex.class('justify-between items-center')
                .heading(1, 'Complex Layout', 'text-2xl font-bold text-gray-900')
                .flex('row', '2', (actions) => {
                  actions.button('Settings', 'outline', 'sm')
                         .button('Profile', 'primary', 'sm');
                });
          });
        });
      })
      // Main content
      .container('max-w-7xl mx-auto px-4', (main) => {
        main.grid(3, '8', (grid) => {
          // Sidebar
          grid.container('bg-white rounded-lg shadow-md p-6', (sidebar) => {
            sidebar.heading(3, 'Navigation', 'text-lg font-semibold mb-4')
                   .spacing('space-y', '2')
                   .link('Dashboard', '#dashboard', 'block py-2 px-3 rounded hover:bg-gray-100')
                   .link('Analytics', '#analytics', 'block py-2 px-3 rounded hover:bg-gray-100')
                   .link('Settings', '#settings', 'block py-2 px-3 rounded hover:bg-gray-100');
          })
          // Content area
          .container('col-span-2 space-y-6', (content) => {
            // Stats cards
            content.grid(2, '4', (statsGrid) => {
              statsGrid.container('bg-white rounded-lg shadow-md p-6', (stat1) => {
                stat1.flex('row', '0', (flex) => {
                  flex.class('items-center')
                      .icon('mdi:chart-line', 'text-3xl text-blue-500')
                      .container('ml-4', (text) => {
                        text.paragraph('Active Users', 'text-sm text-gray-500')
                            .paragraph('2,345', 'text-2xl font-bold text-gray-900');
                      });
                });
              })
              .container('bg-white rounded-lg shadow-md p-6', (stat2) => {
                stat2.flex('row', '0', (flex) => {
                  flex.class('items-center')
                      .icon('mdi:currency-usd', 'text-3xl text-green-500')
                      .container('ml-4', (text) => {
                        text.paragraph('Revenue', 'text-sm text-gray-500')
                            .paragraph('$12,345', 'text-2xl font-bold text-gray-900');
                      });
                });
              });
            })
            // Main content card
            .container('bg-white rounded-lg shadow-md p-6', (mainCard) => {
              mainCard.heading(2, 'Recent Activity', 'text-xl font-semibold mb-4')
                      .spacing('space-y', '3');
              
              // Add some activity items
              for (let i = 1; i <= 5; i++) {
                mainCard.flex('row', '0', (activity) => {
                  activity.class('items-center justify-between py-3 border-b border-gray-200')
                          .flex('row', '3', (left) => {
                            left.class('items-center')
                                .icon('mdi:account', 'text-gray-400')
                                .container('', (text) => {
                                  text.paragraph(`Activity ${i}`, 'font-medium text-gray-900')
                                      .paragraph(`Description for activity ${i}`, 'text-sm text-gray-500');
                                });
                          })
                          .button('View', 'outline', 'xs');
                });
              }
            });
          });
        });
      })
      .build(),
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
Complex layout created entirely with the SchemaBuilder fluent API. This demonstrates:

- **Nested containers** with proper spacing and styling
- **Grid layouts** for responsive design
- **Flex layouts** for component alignment
- **Utility classes** applied through the builder
- **Component composition** with headers, sidebars, and content areas

The builder provides a programmatic way to create complex YAML schemas without writing raw YAML.
        `,
      },
    },
  },
};

// Builder comparison
export const BuilderComparison: Story = {
  args: {
    schema: createComponent('div')
      .class('max-w-4xl mx-auto p-6 space-y-8')
      .heading(1, 'SchemaBuilder vs Manual YAML', 'text-3xl font-bold mb-8')
      .grid(2, '8', (grid) => {
        // Manual YAML approach
        grid.container('bg-red-50 border border-red-200 rounded-lg p-6', (manual) => {
          manual.heading(2, 'Manual YAML', 'text-xl font-semibold text-red-800 mb-4')
                .paragraph('Writing YAML schemas manually:', 'text-red-700 mb-4')
                .container('bg-red-100 p-4 rounded font-mono text-sm', (code) => {
                  code.paragraph(`name: div
props:
  class: "bg-white p-6 rounded"
  content:
    - h3:
        content: "Title"
        class: "font-bold"
    - p:
        content: "Description"
    - button:
        text: "Action"
        variant: "primary"`, 'whitespace-pre text-red-800');
                })
                .paragraph('❌ Verbose and error-prone', 'text-red-600 mt-4')
                .paragraph('❌ No type safety', 'text-red-600')
                .paragraph('❌ Hard to refactor', 'text-red-600');
        })
        // SchemaBuilder approach
        .container('bg-green-50 border border-green-200 rounded-lg p-6', (builder) => {
          builder.heading(2, 'SchemaBuilder API', 'text-xl font-semibold text-green-800 mb-4')
                 .paragraph('Using the fluent builder API:', 'text-green-700 mb-4')
                 .container('bg-green-100 p-4 rounded font-mono text-sm', (code) => {
                   code.paragraph(`createComponent('div')
  .class('bg-white p-6 rounded')
  .heading(3, 'Title', 'font-bold')
  .paragraph('Description')
  .button('Action', 'primary')
  .build()`, 'whitespace-pre text-green-800');
                 })
                 .paragraph('✅ Concise and readable', 'text-green-600 mt-4')
                 .paragraph('✅ Type-safe with IntelliSense', 'text-green-600')
                 .paragraph('✅ Easy to refactor and compose', 'text-green-600');
        });
      })
      .build(),
    theme: {},
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
This story compares the manual YAML approach with the SchemaBuilder API, highlighting the benefits of programmatic schema creation.

**SchemaBuilder Benefits:**
- **Type Safety**: IntelliSense and compile-time error checking
- **Composability**: Reusable components and patterns
- **Readability**: Fluent API that reads like natural language
- **Maintainability**: Easy refactoring and updates
- **Validation**: Built-in validation and error prevention
        `,
      },
    },
  },
};
