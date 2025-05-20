// utils/theme-debug.js
// This script helps diagnose issues with your theme.json structure

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust paths to work from utils folder
const inputPath = path.join(process.cwd(), 'src', 'styles', 'theme.json');

// Analyze theme structure
async function analyzeThemeStructure() {
  console.log(`Analyzing theme file: ${inputPath}`);
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Theme file not found: ${inputPath}`);
    return;
  }
  
  try {
    const data = await fs.promises.readFile(inputPath, 'utf8');
    const theme = JSON.parse(data);
    
    console.log('\n============ THEME STRUCTURE ANALYSIS ============');
    console.log('Theme root keys:');
    console.log(Object.keys(theme));
    
    // Check for expected sections
    const expectedPrefixes = [
      'System-Styles/',
      'System/',
      'Modes/',
      'Platform/',
      'Cognitive/',
      'Surface and Containers/',
      'Shadow-Level/',
      'Sizing & Spacing/'
    ];
    
    let missingPrefixes = [];
    
    console.log('\n============ EXPECTED SECTION ANALYSIS ============');
    expectedPrefixes.forEach(prefix => {
      const matchingKeys = Object.keys(theme).filter(key => key.startsWith(prefix));
      console.log(`\nKeys starting with '${prefix}': ${matchingKeys.length}`);
      
      if (matchingKeys.length === 0) {
        missingPrefixes.push(prefix);
        
        // Try case-insensitive search as fallback
        const lowerPrefix = prefix.toLowerCase();
        const caseInsensitiveKeys = Object.keys(theme).filter(key => 
          key.toLowerCase().startsWith(lowerPrefix)
        );
        
        if (caseInsensitiveKeys.length > 0) {
          console.log(`  No exact matches, but found similar keys with different case:`);
          console.log(`  ${caseInsensitiveKeys.join(', ')}`);
        } else {
          console.log(`  NOT FOUND - this will prevent generating corresponding CSS files`);
        }
      } else {
        console.log(`  ${matchingKeys.join('\n  ')}`);
        
        // Check if the sections have content
        matchingKeys.forEach(key => {
          const section = theme[key];
          if (!section || Object.keys(section).length === 0) {
            console.log(`    WARNING: '${key}' exists but is empty or null`);
          }
        });
      }
    });
    
    // Summary
    console.log('\n============ ANALYSIS SUMMARY ============');
    if (missingPrefixes.length > 0) {
      console.log('MISSING SECTIONS:');
      missingPrefixes.forEach(prefix => {
        console.log(`  - ${prefix}`);
      });
      console.log('\nThese missing sections explain why some CSS files are not being generated.');
    } else {
      console.log('All expected sections are present in the theme.json file.');
    }
    
    // Check for specific key sections
    const criticalSections = [
      { key: 'System-Styles/Default', file: 'base.css' },
      { key: 'System/Default', file: 'system.css' }
    ];
    
    console.log('\nCRITICAL SECTION CHECK:');
    criticalSections.forEach(section => {
      if (theme[section.key]) {
        console.log(`  ✓ ${section.key} (for ${section.file}) is present`);
      } else {
        console.log(`  ✗ ${section.key} (for ${section.file}) is MISSING`);
      }
    });
    
  } catch (error) {
    console.error(`Error analyzing theme: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

// Run the analysis
analyzeThemeStructure();