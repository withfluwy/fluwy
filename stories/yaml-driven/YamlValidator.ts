/**
 * YAML Schema Validator for component testing
 * Provides validation and error reporting for YAML component schemas
 */

export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class YamlValidator {
  private static knownComponents = [
    'button', 'input', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'text', 'link', 'image', 'icon', 'tabs', 'tab', 'form', 'column', 'row',
    'container', 'header', 'footer', 'sidebar', 'page', 'dialog', 'dropdown',
    'avatar', 'badge', 'card', 'alert', 'modal', 'tooltip', 'spinner',
    'checkbox', 'radio', 'select', 'textarea', 'label', 'fieldset',
    'nav', 'menu', 'breadcrumb', 'pagination', 'table', 'thead', 'tbody',
    'tr', 'td', 'th', 'ul', 'ol', 'li', 'section', 'article', 'aside',
    'main', 'figure', 'figcaption', 'blockquote', 'code', 'pre'
  ];

  private static requiredProps: Record<string, string[]> = {
    button: [],
    input: [],
    link: ['href'],
    image: ['src'],
    icon: ['name']
  };

  private static validVariants: Record<string, string[]> = {
    button: ['filled', 'outline', 'ghost', 'link', 'primary', 'secondary', 'accent', 'destructive'],
    input: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    alert: ['info', 'success', 'warning', 'error']
  };

  private static validSizes: string[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

  /**
   * Validate a complete YAML schema
   */
  static validateSchema(schema: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!schema) {
      errors.push({
        path: 'root',
        message: 'Schema is empty or undefined',
        severity: 'error'
      });
      return { isValid: false, errors, warnings };
    }

    // Validate components array
    if (schema.components && Array.isArray(schema.components)) {
      schema.components.forEach((component: any, index: number) => {
        const componentErrors = this.validateComponent(component, `components[${index}]`);
        errors.push(...componentErrors.filter(e => e.severity === 'error'));
        warnings.push(...componentErrors.filter(e => e.severity === 'warning'));
      });
    }

    // Validate theme structure
    if (schema.colors) {
      const themeErrors = this.validateTheme(schema, 'theme');
      warnings.push(...themeErrors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate a single component definition
   */
  static validateComponent(component: any, path: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!component) {
      errors.push({
        path,
        message: 'Component is undefined',
        severity: 'error'
      });
      return errors;
    }

    // Check component name
    if (!component.name) {
      errors.push({
        path: `${path}.name`,
        message: 'Component name is required',
        severity: 'error'
      });
    } else if (typeof component.name !== 'string') {
      errors.push({
        path: `${path}.name`,
        message: 'Component name must be a string',
        severity: 'error'
      });
    } else if (!this.knownComponents.includes(component.name)) {
      errors.push({
        path: `${path}.name`,
        message: `Unknown component "${component.name}". Known components: ${this.knownComponents.join(', ')}`,
        severity: 'warning'
      });
    }

    // Validate props
    if (component.props) {
      const propsErrors = this.validateProps(component.props, component.name, `${path}.props`);
      errors.push(...propsErrors);
    }

    // Check required props
    if (component.name && this.requiredProps[component.name]) {
      const required = this.requiredProps[component.name];
      const props = component.props || {};
      
      required.forEach(prop => {
        if (!(prop in props)) {
          errors.push({
            path: `${path}.props.${prop}`,
            message: `Required property "${prop}" is missing for component "${component.name}"`,
            severity: 'error'
          });
        }
      });
    }

    // Validate content structure
    if (component.props?.content) {
      const contentErrors = this.validateContent(component.props.content, `${path}.props.content`);
      errors.push(...contentErrors);
    }

    return errors;
  }

  /**
   * Validate component props
   */
  static validateProps(props: any, componentName: string, path: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (typeof props !== 'object' || props === null) {
      errors.push({
        path,
        message: 'Props must be an object',
        severity: 'error'
      });
      return errors;
    }

    // Validate variant
    if (props.variant && componentName && this.validVariants[componentName]) {
      const validVariants = this.validVariants[componentName];
      if (!validVariants.includes(props.variant)) {
        errors.push({
          path: `${path}.variant`,
          message: `Invalid variant "${props.variant}" for ${componentName}. Valid variants: ${validVariants.join(', ')}`,
          severity: 'warning'
        });
      }
    }

    // Validate size
    if (props.size && !this.validSizes.includes(props.size)) {
      errors.push({
        path: `${path}.size`,
        message: `Invalid size "${props.size}". Valid sizes: ${this.validSizes.join(', ')}`,
        severity: 'warning'
      });
    }

    // Validate class names (basic check)
    if (props.class && typeof props.class !== 'string') {
      errors.push({
        path: `${path}.class`,
        message: 'Class property must be a string',
        severity: 'error'
      });
    }

    // Validate href for links
    if (componentName === 'link' && props.href && typeof props.href !== 'string') {
      errors.push({
        path: `${path}.href`,
        message: 'href property must be a string',
        severity: 'error'
      });
    }

    // Validate src for images
    if (componentName === 'image' && props.src && typeof props.src !== 'string') {
      errors.push({
        path: `${path}.src`,
        message: 'src property must be a string',
        severity: 'error'
      });
    }

    return errors;
  }

  /**
   * Validate content structure (nested components)
   */
  static validateContent(content: any, path: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (Array.isArray(content)) {
      content.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          // Each item should be a component definition
          Object.entries(item).forEach(([componentName, componentDef]) => {
            const componentErrors = this.validateComponent(
              { name: componentName, props: componentDef },
              `${path}[${index}].${componentName}`
            );
            errors.push(...componentErrors);
          });
        }
      });
    } else if (typeof content === 'object' && content !== null) {
      // Single component definition
      Object.entries(content).forEach(([componentName, componentDef]) => {
        const componentErrors = this.validateComponent(
          { name: componentName, props: componentDef },
          `${path}.${componentName}`
        );
        errors.push(...componentErrors);
      });
    }

    return errors;
  }

  /**
   * Validate theme structure
   */
  static validateTheme(theme: any, path: string): ValidationError[] {
    const warnings: ValidationError[] = [];

    // Check color structure
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([colorName, colorValue]) => {
        if (typeof colorValue === 'object' && colorValue !== null) {
          const colorObj = colorValue as Record<string, string>;
          
          // Check for DEFAULT value
          if (!colorObj.DEFAULT) {
            warnings.push({
              path: `${path}.colors.${colorName}`,
              message: `Color "${colorName}" should have a DEFAULT value`,
              severity: 'warning'
            });
          }

          // Check for common shade values
          const commonShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
          const hasCommonShades = commonShades.some(shade => shade in colorObj);
          
          if (!hasCommonShades) {
            warnings.push({
              path: `${path}.colors.${colorName}`,
              message: `Color "${colorName}" should include common shade values (50, 100, 200, etc.)`,
              severity: 'info'
            });
          }
        }
      });
    }

    return warnings;
  }

  /**
   * Get suggestions for fixing validation errors
   */
  static getSuggestions(error: ValidationError): string[] {
    const suggestions: string[] = [];

    if (error.message.includes('Unknown component')) {
      suggestions.push('Check if the component is registered in the Fluwy app');
      suggestions.push('Verify the component name spelling');
      suggestions.push('Use one of the known components listed in the error');
    }

    if (error.message.includes('Required property')) {
      suggestions.push('Add the missing required property to the component props');
      suggestions.push('Check the component documentation for required properties');
    }

    if (error.message.includes('Invalid variant')) {
      suggestions.push('Use one of the valid variants listed in the error');
      suggestions.push('Check the theme configuration for available variants');
    }

    if (error.message.includes('Invalid size')) {
      suggestions.push('Use one of the standard sizes: xs, sm, md, lg, xl, 2xl');
    }

    return suggestions;
  }

  /**
   * Format validation results for display
   */
  static formatValidationResults(result: ValidationResult): string {
    let output = '';

    if (result.isValid) {
      output += '✅ Schema validation passed!\n';
    } else {
      output += '❌ Schema validation failed!\n\n';
    }

    if (result.errors.length > 0) {
      output += '🚨 Errors:\n';
      result.errors.forEach(error => {
        output += `  • ${error.path}: ${error.message}\n`;
        const suggestions = this.getSuggestions(error);
        if (suggestions.length > 0) {
          output += `    Suggestions:\n`;
          suggestions.forEach(suggestion => {
            output += `    - ${suggestion}\n`;
          });
        }
      });
      output += '\n';
    }

    if (result.warnings.length > 0) {
      output += '⚠️  Warnings:\n';
      result.warnings.forEach(warning => {
        output += `  • ${warning.path}: ${warning.message}\n`;
      });
      output += '\n';
    }

    return output;
  }
}
