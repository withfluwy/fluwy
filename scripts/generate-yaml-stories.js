#!/usr/bin/env node

/**
 * Script to automatically generate Storybook stories from YAML schema files
 * Usage: node scripts/generate-yaml-stories.js
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const THEMES_DIR = path.join(PROJECT_ROOT, 'app', 'themes');
const STORIES_DIR = path.join(PROJECT_ROOT, 'stories', 'yaml-driven', 'generated');

/**
 * Ensure the generated stories directory exists
 */
function ensureStoriesDir() {
  if (!fs.existsSync(STORIES_DIR)) {
    fs.mkdirSync(STORIES_DIR, { recursive: true });
  }
}

/**
 * Get all YAML files from the themes directory
 */
function getYamlFiles() {
  if (!fs.existsSync(THEMES_DIR)) {
    console.warn(`Themes directory not found: ${THEMES_DIR}`);
    return [];
  }

  return fs.readdirSync(THEMES_DIR)
    .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
    .map(file => path.join(THEMES_DIR, file));
}

/**
 * Parse YAML file and extract component definitions
 */
function parseYamlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = parse(content);
    
    return {
      filename: path.basename(filePath, path.extname(filePath)),
      content: parsed,
      path: filePath
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Extract components from parsed YAML
 */
function extractComponents(yamlData) {
  const components = [];

  // If there's a components array, use it directly
  if (yamlData.content.components && Array.isArray(yamlData.content.components)) {
    return yamlData.content.components.map((comp, index) => ({
      name: comp.name || `component-${index}`,
      props: comp.props || {},
      description: comp.description || `Component ${comp.name || index}`,
      ...comp
    }));
  }

  // Extract from theme structure
  if (yamlData.content.forms?.button?.variants) {
    Object.entries(yamlData.content.forms.button.variants).forEach(([variant, classes]) => {
      components.push({
        name: 'button',
        props: {
          text: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Button`,
          variant: variant,
          class: classes
        },
        description: `Button with ${variant} variant from ${yamlData.filename} theme`
      });
    });
  }

  // Extract color components
  if (yamlData.content.colors) {
    Object.entries(yamlData.content.colors).forEach(([colorName, colorValues]) => {
      if (typeof colorValues === 'object' && colorValues.DEFAULT) {
        components.push({
          name: 'div',
          props: {
            class: `p-4 rounded-lg bg-${colorName}-500 text-white font-semibold text-center`,
            content: `${colorName.charAt(0).toUpperCase() + colorName.slice(1)} Color`
          },
          description: `Color demonstration for ${colorName} from ${yamlData.filename} theme`
        });
      }
    });
  }

  return components;
}

/**
 * Generate TypeScript story content
 */
function generateStoryContent(yamlData, components) {
  const storyTitle = `YAML Generated/${yamlData.filename.charAt(0).toUpperCase() + yamlData.filename.slice(1)}`;
  const themeJson = JSON.stringify(yamlData.content, null, 2);
  
  let storyContent = `import type { Meta, StoryObj } from '@storybook/svelte';
import YamlRenderer from '../YamlRenderer.svelte';

// Auto-generated from ${yamlData.filename}.yaml
const meta: Meta<YamlRenderer> = {
  title: '${storyTitle}',
  component: YamlRenderer,
  parameters: {
    docs: {
      description: {
        component: 'Stories automatically generated from ${yamlData.filename}.yaml theme file',
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
  },
};

export default meta;
type Story = StoryObj<YamlRenderer>;

// Theme configuration from ${yamlData.filename}.yaml
const theme = ${themeJson};

`;

  // Generate individual stories
  components.forEach((component, index) => {
    const storyName = generateStoryName(component, index);
    const componentJson = JSON.stringify(component, null, 2);
    
    storyContent += `
export const ${storyName}: Story = {
  args: {
    schema: ${componentJson.replace(/^/gm, '    ')},
    theme,
    context: {}
  },
  parameters: {
    docs: {
      description: {
        story: '${component.description || `Component ${component.name}`}',
      },
    },
  },
};
`;
  });

  return storyContent;
}

/**
 * Generate a valid story name from component data
 */
function generateStoryName(component, index) {
  const baseName = component.name.charAt(0).toUpperCase() + component.name.slice(1);
  
  if (component.props?.variant) {
    const variant = component.props.variant.replace(/[^a-zA-Z0-9]/g, '');
    return `${baseName}${variant.charAt(0).toUpperCase() + variant.slice(1)}`;
  }
  
  if (component.props?.text) {
    const text = component.props.text.replace(/[^a-zA-Z0-9]/g, '');
    return `${baseName}${text}`;
  }

  if (component.props?.content && typeof component.props.content === 'string') {
    const content = component.props.content.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
    return `${baseName}${content}`;
  }

  return `${baseName}${index + 1}`;
}

/**
 * Write story file to disk
 */
function writeStoryFile(yamlData, storyContent) {
  const storyFileName = `${yamlData.filename}.stories.ts`;
  const storyFilePath = path.join(STORIES_DIR, storyFileName);
  
  fs.writeFileSync(storyFilePath, storyContent, 'utf8');
  console.log(`Generated: ${storyFilePath}`);
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Generating Storybook stories from YAML schemas...\n');
  
  ensureStoriesDir();
  
  const yamlFiles = getYamlFiles();
  
  if (yamlFiles.length === 0) {
    console.log('No YAML files found in themes directory.');
    return;
  }

  console.log(`Found ${yamlFiles.length} YAML files:`);
  yamlFiles.forEach(file => console.log(`  - ${path.basename(file)}`));
  console.log('');

  let generatedCount = 0;

  yamlFiles.forEach(filePath => {
    const yamlData = parseYamlFile(filePath);
    
    if (!yamlData) {
      return;
    }

    const components = extractComponents(yamlData);
    
    if (components.length === 0) {
      console.log(`⚠️  No components found in ${yamlData.filename}.yaml`);
      return;
    }

    console.log(`📝 Processing ${yamlData.filename}.yaml (${components.length} components)`);
    
    const storyContent = generateStoryContent(yamlData, components);
    writeStoryFile(yamlData, storyContent);
    
    generatedCount++;
  });

  console.log(`\n✅ Generated ${generatedCount} story files in ${STORIES_DIR}`);
  console.log('\n🎉 Run "npm run storybook" to see your generated stories!');
}

// Run the script
main();
