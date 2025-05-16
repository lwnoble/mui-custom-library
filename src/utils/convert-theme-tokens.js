#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug: Print current directory and script location
console.log('Current directory:', process.cwd());
console.log('Script directory:', __dirname);
console.log('Full script path:', __filename);

// Set input and output paths (use path.join for cross-platform compatibility)
const inputPath = path.join(process.cwd(), 'src', 'styles', 'theme.json');
const outputDir = path.join(process.cwd(), 'src', 'styles', 'theme-files');
const outputCssPath = path.join(process.cwd(), 'src', 'styles', 'generated.css');

// Verify input file exists
if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Simple function to generate CSS from theme.json
async function simplifiedConversion() {
  try {
    console.log('Reading theme.json...');
    const data = await fs.promises.readFile(inputPath, 'utf8');
    const theme = JSON.parse(data);
    
    // Clean up theme json
    if (theme.$themes && Array.isArray(theme.$themes)) {
      console.log('Cleaning $themes array...');
      theme.$themes = [];
      
      // Write the cleaned theme back to file
      await fs.promises.writeFile(inputPath, JSON.stringify(theme, null, 2));
    }
    
    if (theme.$metadata) {
      console.log('Removing $metadata section...');
      delete theme.$metadata;
      
      // Write the cleaned theme back to file
      await fs.promises.writeFile(inputPath, JSON.stringify(theme, null, 2));
    }
    
    console.log('Generating CSS...');
    
    // Generate a simple CSS file with basic variables
    let css = `:root {\n`;
    css += `  /* Generated CSS variables from theme.json */\n`;
    
    // Add system variables if available
    if (theme['System/Default']) {
      const systemDefaults = theme['System/Default'];
      
      // Add button properties if available
      if (systemDefaults.Buttons) {
        css += `  /* Button properties */\n`;
        Object.entries(systemDefaults.Buttons).forEach(([key, value]) => {
          if (value && value.value !== undefined) {
            css += `  --Button-${key}: ${value.value}${typeof value.value === 'number' ? 'px' : ''};\n`;
          }
        });
      }
      
      // Add breakpoints if available
      if (systemDefaults.Breakpoints) {
        css += `\n  /* Breakpoints */\n`;
        Object.entries(systemDefaults.Breakpoints).forEach(([key, value]) => {
          if (value && value.value !== undefined) {
            css += `  --Breakpoint-${key}: ${value.value}px;\n`;
          }
        });
      }
    }
    
    // Add mode variables if available
    const modes = Object.keys(theme).filter(key => key.startsWith('Modes/'));
    if (modes.length > 0) {
      css += `\n  /* Mode variables */\n`;
      modes.forEach(mode => {
        const modeName = mode.split('/')[1];
        css += `  --Mode-${modeName}: ${modeName};\n`;
      });
    }
    
    // Close the CSS block
    css += `}\n`;
    
    // Write the CSS file
    await fs.promises.writeFile(outputCssPath, css, 'utf8');
    console.log(`Successfully wrote CSS to ${outputCssPath}`);
    
    // Create a minimal base.css in the theme-files directory
    const baseCSS = `:root {\n  --system-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;\n}\n`;
    await fs.promises.writeFile(path.join(outputDir, 'base.css'), baseCSS, 'utf8');
    console.log(`Created base.css in ${outputDir}`);
    
    return {
      outputCssPath,
      outputDir
    };
  } catch (error) {
    console.error('Error generating CSS:', error);
    throw error;
  }
}

// Convert JSON to CSS files
async function convertThemeTokens() {
  try {
    console.log('Converting theme tokens...');
    console.log('Input path:', inputPath);
    console.log('Output directory:', outputDir);

    // Use the simplified conversion instead of JsonToCssSplit
    const results = await simplifiedConversion();
    console.log('Theme tokens successfully converted!');
    return results;
  } catch (error) {
    console.error('Error converting theme tokens:', error);
    process.exit(1);
  }
}

// Run the conversion if this script is called directly
if (import.meta.url === `file://${__filename}`) {
  convertThemeTokens();
}

export default convertThemeTokens;
