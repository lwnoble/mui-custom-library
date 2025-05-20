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

// Comprehensive theme token conversion
async function convertThemeTokens() {
  try {
    console.log('Reading theme.json...');
    
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error(`Input file not found: ${inputPath}`);
      return null;
    }
    
    // Read the theme JSON file
    const data = await fs.promises.readFile(inputPath, 'utf8');
    let theme;
    
    try {
      theme = JSON.parse(data);
      console.log('Successfully parsed theme.json');
    } catch (parseError) {
      console.error('Error parsing theme.json:', parseError.message);
      return null;
    }
    
    // Log original structure before cleaning
    console.log('Original theme structure before cleaning:');
    console.log('Root keys:', Object.keys(theme));
    
    // Make a deep copy of the theme to work with
    const themeCopy = JSON.parse(JSON.stringify(theme));
    
    // CLEAN THEME JSON - Remove sections completely
    if (themeCopy.$themes) {
      console.log('Removing $themes section...');
      delete themeCopy.$themes; // Remove completely instead of emptying
    }
    
    if (themeCopy.$metadata) {
      console.log('Removing $metadata section...');
      delete themeCopy.$metadata;
    }
    
    // Log theme structure after cleaning
    console.log('Theme structure after cleaning:');
    console.log('Root keys:', Object.keys(themeCopy));
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      try {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Created output directory: ${outputDir}`);
      } catch (mkdirError) {
        console.error(`Error creating output directory: ${mkdirError}`);
        return null;
      }
    }
    
    // Use convertToCssFiles to generate comprehensive CSS files
    // Use the cleaned copy, not the original theme
    console.log('Generating CSS files...');
    const results = await convertToCssFiles(themeCopy, outputDir);
    
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
    await generateDebugLog(themeCopy, results);
    
    return results;
  } catch (error) {
    console.error('Error converting theme tokens:', error);
    process.exit(1);
  }
}

// Helper function to check for required sections
function checkRequiredSections(theme) {
  const requiredSectionPrefixes = [
    'System-Styles/Default',
    'System/Default',
    'Modes/',
    'Platform/',
    'Cognitive/',
    'Surface and Containers/',
    'Shadow-Level/',
    'Sizing & Spacing/'
  ];
  
  const result = {
    present: [],
    missing: []
  };
  
  // Check for exact section matches
  requiredSectionPrefixes.forEach(prefix => {
    // For prefix matches (with trailing slash)
    if (prefix.endsWith('/')) {
      const matchingKeys = Object.keys(theme).filter(key => key.startsWith(prefix));
      if (matchingKeys.length === 0) {
        result.missing.push(prefix);
      } else {
        result.present.push(prefix);
      }
    } 
    // For exact matches
    else {
      if (theme[prefix]) {
        result.present.push(prefix);
      } else {
        result.missing.push(prefix);
      }
    }
  });
  
  return result;
}

// Generate a comprehensive debug log
async function generateDebugLog(theme, results) {
  const debugLogPath = path.join(outputDir, 'conversion-debug.log');
  
  // Generate a more detailed log
  const debugContent = `
Theme Tokens Conversion Debug Log
=================================
Generated: ${new Date().toISOString()}

Input Theme Structure:
${JSON.stringify(Object.keys(theme), null, 2)}

Generated Files:
${JSON.stringify(results, null, 2)}

Expected Sections:
- System-Styles/Default: ${theme['System-Styles/Default'] ? 'Present' : 'Missing'}
- System/Default: ${theme['System/Default'] ? 'Present' : 'Missing'}
- Modes: ${Object.keys(theme).filter(key => key.startsWith('Modes/')).join(', ') || 'None'}
- Platforms: ${Object.keys(theme).filter(key => key.startsWith('Platform/')).join(', ') || 'None'}
- Cognitive: ${Object.keys(theme).filter(key => key.startsWith('Cognitive/')).join(', ') || 'None'}
- Surface and Containers: ${Object.keys(theme).filter(key => key.startsWith('Surface and Containers/')).join(', ') || 'None'}
- Shadow-Level: ${Object.keys(theme).filter(key => key.startsWith('Shadow-Level/')).join(', ') || 'None'}
- Sizing & Spacing: ${Object.keys(theme).filter(key => key.startsWith('Sizing & Spacing/')).join(', ') || 'None'}
`;

  try {
    await fs.promises.writeFile(debugLogPath, debugContent, 'utf8');
    console.log(`Generated debug log: ${debugLogPath}`);
  } catch (error) {
    console.error(`Error writing debug log: ${error.message}`);
  }
}

// Run the conversion if this script is called directly
if (import.meta.url === `file://${__filename}`) {
  convertThemeTokens();
}

export default convertThemeTokens;