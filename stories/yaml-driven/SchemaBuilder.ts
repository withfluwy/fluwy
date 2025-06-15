/**
 * YAML Schema Builder - Utility for programmatically creating YAML component schemas
 * Provides a fluent API for building complex component structures
 */

import type { YamlComponentSchema } from './yaml-loader.js';

export interface ComponentBuilder {
  name: string;
  props: Record<string, any>;
  content: any[];
}

export class YamlSchemaBuilder {
  private schema: ComponentBuilder;

  constructor(componentName: string) {
    this.schema = {
      name: componentName,
      props: {},
      content: []
    };
  }

  /**
   * Set component properties
   */
  props(properties: Record<string, any>): this {
    this.schema.props = { ...this.schema.props, ...properties };
    return this;
  }

  /**
   * Add a CSS class
   */
  class(className: string): this {
    this.schema.props.class = this.schema.props.class 
      ? `${this.schema.props.class} ${className}`
      : className;
    return this;
  }

  /**
   * Set text content
   */
  text(content: string): this {
    this.schema.props.text = content;
    return this;
  }

  /**
   * Set generic content
   */
  content(content: any): this {
    if (Array.isArray(content)) {
      this.schema.content.push(...content);
    } else {
      this.schema.content.push(content);
    }
    return this;
  }

  /**
   * Add a child component
   */
  child(componentName: string, builderFn?: (builder: YamlSchemaBuilder) => void): this {
    const childBuilder = new YamlSchemaBuilder(componentName);
    
    if (builderFn) {
      builderFn(childBuilder);
    }
    
    this.schema.content.push({
      [componentName]: childBuilder.build().props
    });
    
    return this;
  }

  /**
   * Add multiple children
   */
  children(children: Array<{ name: string; builder?: (b: YamlSchemaBuilder) => void }>): this {
    children.forEach(({ name, builder }) => {
      this.child(name, builder);
    });
    return this;
  }

  /**
   * Add a button component
   */
  button(text: string, variant: string = 'primary', size: string = 'md'): this {
    return this.child('button', (b) => 
      b.props({ text, variant, size })
    );
  }

  /**
   * Add an input component
   */
  input(label: string, placeholder?: string, type: string = 'text'): this {
    return this.child('input', (b) => 
      b.props({ label, placeholder, type })
    );
  }

  /**
   * Add a heading component
   */
  heading(level: 1 | 2 | 3 | 4 | 5 | 6, text: string, className?: string): this {
    return this.child(`h${level}`, (b) => {
      const builder = b.props({ content: text });
      return className ? builder.class(className) : builder;
    });
  }

  /**
   * Add a paragraph component
   */
  paragraph(text: string, className?: string): this {
    return this.child('p', (b) => {
      const builder = b.props({ content: text });
      return className ? builder.class(className) : builder;
    });
  }

  /**
   * Add an icon component
   */
  icon(name: string, className?: string): this {
    return this.child('icon', (b) => {
      const builder = b.props({ name });
      return className ? builder.class(className) : builder;
    });
  }

  /**
   * Add a link component
   */
  link(text: string, href: string, className?: string): this {
    return this.child('link', (b) => {
      const builder = b.props({ text, href });
      return className ? builder.class(className) : builder;
    });
  }

  /**
   * Add a div container
   */
  container(className?: string, builderFn?: (builder: YamlSchemaBuilder) => void): this {
    return this.child('div', (b) => {
      const builder = className ? b.class(className) : b;
      return builderFn ? (builderFn(builder), builder) : builder;
    });
  }

  /**
   * Create a flex container
   */
  flex(direction: 'row' | 'col' = 'row', gap: string = '4', builderFn?: (builder: YamlSchemaBuilder) => void): this {
    const flexClass = `flex flex-${direction} gap-${gap}`;
    return this.container(flexClass, builderFn);
  }

  /**
   * Create a grid container
   */
  grid(cols: number, gap: string = '4', builderFn?: (builder: YamlSchemaBuilder) => void): this {
    const gridClass = `grid grid-cols-${cols} gap-${gap}`;
    return this.container(gridClass, builderFn);
  }

  /**
   * Add spacing
   */
  spacing(type: 'space-y' | 'space-x', size: string): this {
    return this.class(`${type}-${size}`);
  }

  /**
   * Add padding
   */
  padding(size: string): this {
    return this.class(`p-${size}`);
  }

  /**
   * Add margin
   */
  margin(size: string): this {
    return this.class(`m-${size}`);
  }

  /**
   * Add background color
   */
  background(color: string): this {
    return this.class(`bg-${color}`);
  }

  /**
   * Add text color
   */
  textColor(color: string): this {
    return this.class(`text-${color}`);
  }

  /**
   * Add border
   */
  border(color?: string): this {
    const borderClass = color ? `border border-${color}` : 'border';
    return this.class(borderClass);
  }

  /**
   * Add rounded corners
   */
  rounded(size: string = 'md'): this {
    return this.class(`rounded-${size}`);
  }

  /**
   * Add shadow
   */
  shadow(size: string = 'md'): this {
    return this.class(`shadow-${size}`);
  }

  /**
   * Build the final schema
   */
  build(): YamlComponentSchema {
    const finalProps = { ...this.schema.props };
    
    if (this.schema.content.length > 0) {
      finalProps.content = this.schema.content;
    }

    return {
      name: this.schema.name,
      props: finalProps,
      description: `${this.schema.name} component built with SchemaBuilder`
    };
  }

  /**
   * Convert to JSON for debugging
   */
  toJSON(): string {
    return JSON.stringify(this.build(), null, 2);
  }

  /**
   * Static factory methods for common patterns
   */
  static button(text: string, variant: string = 'primary', size: string = 'md'): YamlSchemaBuilder {
    return new YamlSchemaBuilder('button').props({ text, variant, size });
  }

  static card(title: string, content: string, actions?: Array<{ text: string; variant?: string }>): YamlSchemaBuilder {
    const builder = new YamlSchemaBuilder('div')
      .class('bg-white rounded-lg shadow-md overflow-hidden')
      .container('p-6', (b) => {
        b.heading(3, title, 'text-xl font-semibold mb-2')
         .paragraph(content, 'text-gray-600 mb-4');
        
        if (actions && actions.length > 0) {
          b.flex('row', '2', (flexB) => {
            actions.forEach(action => {
              flexB.button(action.text, action.variant || 'primary', 'sm');
            });
          });
        }
      });
    
    return builder;
  }

  static form(fields: Array<{ label: string; type?: string; placeholder?: string }>): YamlSchemaBuilder {
    const builder = new YamlSchemaBuilder('div')
      .class('space-y-4');
    
    fields.forEach(field => {
      builder.input(field.label, field.placeholder, field.type || 'text');
    });
    
    return builder;
  }

  static navigation(brand: string, links: Array<{ text: string; href: string }>): YamlSchemaBuilder {
    return new YamlSchemaBuilder('nav')
      .class('bg-white shadow-sm border-b')
      .container('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', (b) => {
        b.flex('row', '0', (flexB) => {
          flexB.class('justify-between items-center h-16')
               .heading(1, brand, 'text-xl font-bold text-gray-900')
               .flex('row', '4', (linksB) => {
                 links.forEach(link => {
                   linksB.link(link.text, link.href, 'text-gray-600 hover:text-gray-900');
                 });
               });
        });
      });
  }

  static dashboard(title: string, stats: Array<{ label: string; value: string; icon: string }>): YamlSchemaBuilder {
    const builder = new YamlSchemaBuilder('div')
      .class('min-h-screen bg-gray-100')
      .container('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8', (b) => {
        b.heading(1, title, 'text-3xl font-bold text-gray-900 mb-8')
         .grid(stats.length, '6', (gridB) => {
           stats.forEach(stat => {
             gridB.container('bg-white rounded-lg shadow p-6', (cardB) => {
               cardB.flex('row', '0', (flexB) => {
                 flexB.class('items-center')
                      .icon(stat.icon, 'text-3xl text-blue-500')
                      .container('ml-4', (contentB) => {
                        contentB.paragraph(stat.label, 'text-sm font-medium text-gray-500')
                                .paragraph(stat.value, 'text-2xl font-bold text-gray-900');
                      });
               });
             });
           });
         });
      });
    
    return builder;
  }
}

// Export convenience functions
export const createComponent = (name: string) => new YamlSchemaBuilder(name);
export const button = YamlSchemaBuilder.button;
export const card = YamlSchemaBuilder.card;
export const form = YamlSchemaBuilder.form;
export const navigation = YamlSchemaBuilder.navigation;
export const dashboard = YamlSchemaBuilder.dashboard;
