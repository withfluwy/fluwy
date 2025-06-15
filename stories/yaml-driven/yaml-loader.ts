import { parse } from 'yaml';
import fs from 'fs';
import path from 'path';

export interface YamlComponentSchema {
  name: string;
  props?: Record<string, any>;
  content?: any;
  theme?: string;
  description?: string;
  variants?: Record<string, any>;
}

export interface YamlTestSchema {
  components: YamlComponentSchema[];
  theme?: Record<string, any>;
  description?: string;
}

/**
 * Load and parse YAML schema files for component testing
 */
export class YamlSchemaLoader {
  private static instance: YamlSchemaLoader;
  private schemasCache = new Map<string, YamlTestSchema>();

  static getInstance(): YamlSchemaLoader {
    if (!YamlSchemaLoader.instance) {
      YamlSchemaLoader.instance = new YamlSchemaLoader();
    }
    return YamlSchemaLoader.instance;
  }

  /**
   * Load a YAML schema from file
   */
  async loadSchema(filePath: string): Promise<YamlTestSchema> {
    if (this.schemasCache.has(filePath)) {
      return this.schemasCache.get(filePath)!;
    }

    try {
      const fullPath = path.resolve(process.cwd(), filePath);
      const yamlContent = fs.readFileSync(fullPath, 'utf8');
      const parsed = parse(yamlContent);
      
      const schema = this.normalizeSchema(parsed);
      this.schemasCache.set(filePath, schema);
      
      return schema;
    } catch (error) {
      console.error(`Failed to load YAML schema from ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Load theme configuration from YAML
   */
  async loadTheme(themeName: string): Promise<Record<string, any>> {
    const themePath = `app/themes/${themeName}.yaml`;
    
    try {
      const fullPath = path.resolve(process.cwd(), themePath);
      const yamlContent = fs.readFileSync(fullPath, 'utf8');
      return parse(yamlContent);
    } catch (error) {
      console.warn(`Failed to load theme ${themeName}:`, error);
      return {};
    }
  }

  /**
   * Normalize parsed YAML into component schema format
   */
  private normalizeSchema(parsed: any): YamlTestSchema {
    // If the YAML contains component test definitions
    if (parsed.components) {
      return {
        components: this.normalizeComponents(parsed.components),
        theme: parsed.theme,
        description: parsed.description,
      };
    }

    // If the YAML is a theme file, convert it to component tests
    if (this.isThemeFile(parsed)) {
      return this.convertThemeToComponentTests(parsed);
    }

    // If the YAML contains direct component definitions
    return {
      components: this.extractComponentsFromYaml(parsed),
      description: 'Auto-generated from YAML schema',
    };
  }

  /**
   * Check if the parsed YAML is a theme file
   */
  private isThemeFile(parsed: any): boolean {
    return !!(parsed.colors || parsed.forms || parsed.layout || parsed.common);
  }

  /**
   * Convert theme file to component test scenarios
   */
  private convertThemeToComponentTests(theme: any): YamlTestSchema {
    const components: YamlComponentSchema[] = [];

    // Generate button tests from theme
    if (theme.forms?.button?.variants) {
      Object.entries(theme.forms.button.variants).forEach(([variant, classes]) => {
        components.push({
          name: 'button',
          props: {
            text: `${variant} Button`,
            variant: variant,
            class: classes,
          },
          description: `Button with ${variant} variant from theme`,
        });
      });
    }

    // Generate color palette tests
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([colorName, colorValues]) => {
        if (typeof colorValues === 'object') {
          components.push({
            name: 'div',
            props: {
              class: `p-4 rounded-lg bg-${colorName}-500 text-white`,
              content: `${colorName} Color`,
            },
            description: `Color palette test for ${colorName}`,
          });
        }
      });
    }

    return {
      components,
      theme,
      description: 'Component tests generated from theme configuration',
    };
  }

  /**
   * Extract components from general YAML structure
   */
  private extractComponentsFromYaml(parsed: any): YamlComponentSchema[] {
    const components: YamlComponentSchema[] = [];

    const extractFromObject = (obj: any, parentKey = ''): void => {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          if (typeof item === 'object') {
            extractFromObject(item, `${parentKey}[${index}]`);
          }
        });
      } else if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
          // Check if this looks like a component definition
          if (this.isComponentDefinition(key, value)) {
            components.push({
              name: key,
              props: typeof value === 'object' ? value : { content: value },
              description: `Component ${key} from YAML schema`,
            });
          } else if (typeof value === 'object') {
            extractFromObject(value, key);
          }
        });
      }
    };

    extractFromObject(parsed);
    return components;
  }

  /**
   * Check if a key-value pair represents a component definition
   */
  private isComponentDefinition(key: string, value: any): boolean {
    // Known component names from the Fluwy system
    const knownComponents = [
      'button', 'input', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'text', 'link', 'image', 'icon', 'tabs', 'tab', 'form', 'column', 'row',
      'container', 'header', 'footer', 'sidebar', 'page', 'dialog', 'dropdown',
    ];

    return knownComponents.includes(key.toLowerCase());
  }

  /**
   * Normalize component definitions
   */
  private normalizeComponents(components: any[]): YamlComponentSchema[] {
    return components.map((comp, index) => ({
      name: comp.name || `component-${index}`,
      props: comp.props || {},
      content: comp.content,
      theme: comp.theme,
      description: comp.description || `Component ${comp.name || index}`,
      variants: comp.variants,
    }));
  }

  /**
   * Get all available schema files
   */
  getAvailableSchemas(): string[] {
    const schemasDir = path.resolve(process.cwd(), 'app/themes');
    
    try {
      return fs.readdirSync(schemasDir)
        .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
        .map(file => `app/themes/${file}`);
    } catch (error) {
      console.warn('Could not read schemas directory:', error);
      return [];
    }
  }
}

export const yamlLoader = YamlSchemaLoader.getInstance();
