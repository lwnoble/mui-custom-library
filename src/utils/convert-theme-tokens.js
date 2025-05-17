import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { 
  convertToCssFiles,
  convertSystemToCss,
  extractPlatformVariables,
  extractCognitiveVariables,
  processModeTarget,
  processParagraphSpacing,
  processBackgrounds
} from './JsonToCssSplit.js';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set input and output paths
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

// Comprehensive theme token conversion
async function convertThemeTokens() {
  try {
    console.log('Reading theme.json...');
    const data = await fs.promises.readFile(inputPath, 'utf8');
    const theme = JSON.parse(data);
    
    // Clean up theme json
    if (theme.$themes && Array.isArray(theme.$themes)) {
      console.log('Cleaning $themes array...');
      theme.$themes = [];
    }
    
    if (theme.$metadata) {
      console.log('Removing $metadata section...');
      delete theme.$metadata;
    }
    
    // Write the cleaned theme back to file
    await fs.promises.writeFile(inputPath, JSON.stringify(theme, null, 2));
    
    // Use convertToCssFiles to generate comprehensive CSS files
    console.log('Generating CSS files...');
    const results = await convertToCssFiles(theme, outputDir);
    
    // Detailed logging of generated files
    console.log('Generated CSS files:');
    Object.entries(results).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          console.log(`- ${item.file || 'Unknown file'}`);
        });
      } else if (value) {
        console.log(`- ${value.file || 'Unknown file'}`);
      }
    });
    
    // Optional: Generate a comprehensive debug log
    await generateDebugLog(theme, results);
    
    return results;
  } catch (error) {
    console.error('Error converting theme tokens:', error);
    process.exit(1);
  }
}

// Optional debug logging function
async function generateDebugLog(theme, results) {
  const debugLogPath = path.join(outputDir, 'conversion-debug.log');
  const debugContent = `
Theme Tokens Conversion Debug Log
=================================

Input Theme Structure:
${JSON.stringify(Object.keys(theme), null, 2)}

Generated Files:
${JSON.stringify(results, null, 2)}

Processed Sections:
- Modes: ${Object.keys(theme).filter(key => key.startsWith('Modes/')).join(', ')}
- Platforms: ${Object.keys(theme).filter(key => key.startsWith('Platform/')).join(', ')}
- System Tokens: ${theme['System/Default'] ? 'Present' : 'Not Found'}
- Cognitive Tokens: ${theme['Cognitive/None'] ? 'Present' : 'Not Found'}
`;

  await fs.promises.writeFile(debugLogPath, debugContent, 'utf8');
  console.log(`Generated debug log: ${debugLogPath}`);
}

// Run the conversion if this script is called directly
if (import.meta.url === `file://${__filename}`) {
  convertThemeTokens();
}

export default convertThemeTokens;
