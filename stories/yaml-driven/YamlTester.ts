/**
 * YAML Component Tester - Automated testing utilities for YAML schemas
 * Provides comprehensive testing capabilities for YAML-driven components
 */

import type { YamlComponentSchema } from './yaml-loader.js';
import { YamlValidator, type ValidationResult } from './YamlValidator.js';

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  total: number;
}

export interface ComponentTest {
  name: string;
  description: string;
  schema: YamlComponentSchema;
  expectations: TestExpectation[];
}

export interface TestExpectation {
  type: 'validation' | 'props' | 'structure' | 'performance' | 'accessibility';
  description: string;
  test: (schema: YamlComponentSchema) => boolean | Promise<boolean>;
  errorMessage?: string;
}

export class YamlTester {
  private testSuites: TestSuite[] = [];

  /**
   * Run validation tests on a schema
   */
  static validateSchema(schema: YamlComponentSchema): TestResult[] {
    const results: TestResult[] = [];
    const validation = YamlValidator.validateComponent(schema, 'component');

    // Test: Schema should be valid
    results.push({
      name: 'Schema Validation',
      passed: validation.filter(v => v.severity === 'error').length === 0,
      message: validation.length === 0 
        ? 'Schema is valid' 
        : `Found ${validation.filter(v => v.severity === 'error').length} errors, ${validation.filter(v => v.severity === 'warning').length} warnings`,
      details: validation
    });

    // Test: Component name should be valid
    results.push({
      name: 'Component Name',
      passed: !!schema.name && typeof schema.name === 'string',
      message: schema.name ? `Component name "${schema.name}" is valid` : 'Component name is missing or invalid'
    });

    // Test: Props should be an object
    results.push({
      name: 'Props Structure',
      passed: !schema.props || (typeof schema.props === 'object' && schema.props !== null),
      message: !schema.props ? 'No props defined' : 'Props structure is valid'
    });

    return results;
  }

  /**
   * Test component props
   */
  static testProps(schema: YamlComponentSchema, expectedProps: Record<string, any>): TestResult[] {
    const results: TestResult[] = [];
    const props = schema.props || {};

    Object.entries(expectedProps).forEach(([key, expectedValue]) => {
      const actualValue = props[key];
      const passed = actualValue === expectedValue;

      results.push({
        name: `Prop: ${key}`,
        passed,
        message: passed 
          ? `Property "${key}" has expected value` 
          : `Property "${key}" expected "${expectedValue}", got "${actualValue}"`,
        details: { expected: expectedValue, actual: actualValue }
      });
    });

    return results;
  }

  /**
   * Test component structure
   */
  static testStructure(schema: YamlComponentSchema): TestResult[] {
    const results: TestResult[] = [];

    // Count nested components
    const componentCount = this.countComponents(schema);
    results.push({
      name: 'Component Count',
      passed: componentCount > 0,
      message: `Found ${componentCount} components in structure`,
      details: { count: componentCount }
    });

    // Check nesting depth
    const maxDepth = this.getMaxDepth(schema);
    results.push({
      name: 'Nesting Depth',
      passed: maxDepth <= 10, // Reasonable limit
      message: maxDepth <= 10 
        ? `Nesting depth (${maxDepth}) is reasonable` 
        : `Nesting depth (${maxDepth}) may cause performance issues`,
      details: { depth: maxDepth }
    });

    return results;
  }

  /**
   * Test performance characteristics
   */
  static async testPerformance(schema: YamlComponentSchema): Promise<TestResult[]> {
    const results: TestResult[] = [];
    const componentCount = this.countComponents(schema);

    // Test: Component count should be reasonable
    results.push({
      name: 'Component Count Performance',
      passed: componentCount <= 100,
      message: componentCount <= 100 
        ? `Component count (${componentCount}) is optimal` 
        : `Component count (${componentCount}) may impact performance`,
      details: { count: componentCount }
    });

    // Test: Nesting depth should be reasonable
    const depth = this.getMaxDepth(schema);
    results.push({
      name: 'Nesting Depth Performance',
      passed: depth <= 5,
      message: depth <= 5 
        ? `Nesting depth (${depth}) is optimal` 
        : `Nesting depth (${depth}) may impact rendering performance`,
      details: { depth }
    });

    return results;
  }

  /**
   * Test accessibility features
   */
  static testAccessibility(schema: YamlComponentSchema): TestResult[] {
    const results: TestResult[] = [];
    const props = schema.props || {};

    // Test: Images should have alt text
    if (schema.name === 'image') {
      results.push({
        name: 'Image Alt Text',
        passed: !!props.alt,
        message: props.alt ? 'Image has alt text' : 'Image missing alt text for accessibility'
      });
    }

    // Test: Links should have meaningful text
    if (schema.name === 'link') {
      const hasText = !!(props.text || props.content);
      results.push({
        name: 'Link Text',
        passed: hasText,
        message: hasText ? 'Link has descriptive text' : 'Link missing descriptive text'
      });
    }

    // Test: Form inputs should have labels
    if (schema.name === 'input') {
      results.push({
        name: 'Input Label',
        passed: !!props.label,
        message: props.label ? 'Input has label' : 'Input missing label for accessibility'
      });
    }

    // Test: Headings should have proper hierarchy
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(schema.name)) {
      const hasContent = !!(props.content || props.text);
      results.push({
        name: 'Heading Content',
        passed: hasContent,
        message: hasContent ? 'Heading has content' : 'Heading missing content'
      });
    }

    return results;
  }

  /**
   * Run a complete test suite on a schema
   */
  static async runTestSuite(schema: YamlComponentSchema, suiteName: string = 'Component Test'): Promise<TestSuite> {
    const allTests: TestResult[] = [];

    // Run all test categories
    allTests.push(...this.validateSchema(schema));
    allTests.push(...this.testStructure(schema));
    allTests.push(...await this.testPerformance(schema));
    allTests.push(...this.testAccessibility(schema));

    const passed = allTests.filter(t => t.passed).length;
    const failed = allTests.filter(t => !t.passed).length;

    return {
      name: suiteName,
      tests: allTests,
      passed,
      failed,
      total: allTests.length
    };
  }

  /**
   * Run custom tests on a schema
   */
  static async runCustomTests(componentTest: ComponentTest): Promise<TestSuite> {
    const results: TestResult[] = [];

    for (const expectation of componentTest.expectations) {
      try {
        const passed = await expectation.test(componentTest.schema);
        results.push({
          name: expectation.description,
          passed,
          message: passed 
            ? `✅ ${expectation.description}` 
            : `❌ ${expectation.errorMessage || expectation.description}`
        });
      } catch (error) {
        results.push({
          name: expectation.description,
          passed: false,
          message: `❌ Test failed with error: ${error}`,
          details: { error }
        });
      }
    }

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;

    return {
      name: componentTest.name,
      tests: results,
      passed,
      failed,
      total: results.length
    };
  }

  /**
   * Generate a test report
   */
  static generateReport(testSuites: TestSuite[]): string {
    let report = '# YAML Component Test Report\n\n';
    
    const totalTests = testSuites.reduce((sum, suite) => sum + suite.total, 0);
    const totalPassed = testSuites.reduce((sum, suite) => sum + suite.passed, 0);
    const totalFailed = testSuites.reduce((sum, suite) => sum + suite.failed, 0);

    report += `## Summary\n`;
    report += `- **Total Tests**: ${totalTests}\n`;
    report += `- **Passed**: ${totalPassed} (${((totalPassed / totalTests) * 100).toFixed(1)}%)\n`;
    report += `- **Failed**: ${totalFailed} (${((totalFailed / totalTests) * 100).toFixed(1)}%)\n\n`;

    testSuites.forEach(suite => {
      report += `## ${suite.name}\n`;
      report += `- Passed: ${suite.passed}/${suite.total}\n`;
      report += `- Success Rate: ${((suite.passed / suite.total) * 100).toFixed(1)}%\n\n`;

      suite.tests.forEach(test => {
        const icon = test.passed ? '✅' : '❌';
        report += `### ${icon} ${test.name}\n`;
        report += `${test.message}\n\n`;
        
        if (test.details) {
          report += `**Details:**\n`;
          report += `\`\`\`json\n${JSON.stringify(test.details, null, 2)}\n\`\`\`\n\n`;
        }
      });
    });

    return report;
  }

  /**
   * Helper: Count components in schema
   */
  private static countComponents(obj: any, count = 0): number {
    if (!obj || typeof obj !== 'object') return count;

    if (obj.name) count++;

    if (obj.content) {
      if (Array.isArray(obj.content)) {
        obj.content.forEach((item: any) => {
          count = this.countComponents(item, count);
        });
      } else {
        count = this.countComponents(obj.content, count);
      }
    }

    if (obj.props?.content) {
      count = this.countComponents(obj.props.content, count);
    }

    // Handle direct component definitions
    Object.values(obj).forEach((value: any) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        count = this.countComponents(value, count);
      }
    });

    return count;
  }

  /**
   * Helper: Get maximum nesting depth
   */
  private static getMaxDepth(obj: any, currentDepth = 0): number {
    if (!obj || typeof obj !== 'object') return currentDepth;

    let maxDepth = currentDepth;

    if (obj.content) {
      if (Array.isArray(obj.content)) {
        obj.content.forEach((item: any) => {
          maxDepth = Math.max(maxDepth, this.getMaxDepth(item, currentDepth + 1));
        });
      } else {
        maxDepth = Math.max(maxDepth, this.getMaxDepth(obj.content, currentDepth + 1));
      }
    }

    if (obj.props?.content) {
      maxDepth = Math.max(maxDepth, this.getMaxDepth(obj.props.content, currentDepth + 1));
    }

    return maxDepth;
  }

  /**
   * Create common test expectations
   */
  static expectations = {
    hasValidName: (): TestExpectation => ({
      type: 'validation',
      description: 'Component has valid name',
      test: (schema) => !!schema.name && typeof schema.name === 'string',
      errorMessage: 'Component name is missing or invalid'
    }),

    hasRequiredProp: (propName: string): TestExpectation => ({
      type: 'props',
      description: `Has required prop: ${propName}`,
      test: (schema) => !!(schema.props && schema.props[propName]),
      errorMessage: `Missing required prop: ${propName}`
    }),

    propEquals: (propName: string, expectedValue: any): TestExpectation => ({
      type: 'props',
      description: `Prop ${propName} equals ${expectedValue}`,
      test: (schema) => schema.props?.[propName] === expectedValue,
      errorMessage: `Prop ${propName} does not equal ${expectedValue}`
    }),

    componentCountLessThan: (maxCount: number): TestExpectation => ({
      type: 'performance',
      description: `Component count less than ${maxCount}`,
      test: (schema) => YamlTester.countComponents(schema) < maxCount,
      errorMessage: `Component count exceeds ${maxCount}`
    }),

    maxDepthLessThan: (maxDepth: number): TestExpectation => ({
      type: 'performance',
      description: `Nesting depth less than ${maxDepth}`,
      test: (schema) => YamlTester.getMaxDepth(schema) < maxDepth,
      errorMessage: `Nesting depth exceeds ${maxDepth}`
    }),

    hasAccessibleText: (): TestExpectation => ({
      type: 'accessibility',
      description: 'Has accessible text content',
      test: (schema) => !!(schema.props?.text || schema.props?.content || schema.props?.alt || schema.props?.label),
      errorMessage: 'Missing accessible text content'
    })
  };
}
