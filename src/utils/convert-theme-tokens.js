#!/usr/bin/env node

import { convertJsonFileToCssFiles } from './JsonToCssSplit.js';
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

// Verify input file exists
if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Convert JSON to CSS files
async function convertThemeTokens() {
  try {
    console.log('Converting theme tokens...');
    console.log('Input path:', inputPath);
    console.log('Output directory:', outputDir);

    const results = await convertJsonFileToCssFiles(inputPath, outputDir);
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