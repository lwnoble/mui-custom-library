/**
 * Specialized JSON to CSS transformer for design tokens
 * This converts the given JSON format to CSS custom properties (variables)
 * with data-attribute selectors and splits the output into multiple files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert font family references to the proper format
 * @param {string} value - The font family value
 * @returns {string} - The converted value
 */
function convertFontFamilyReference(value) {
    // First check if value is a string
    if (typeof value !== 'string') {
      return value;
    }
    
    // Check if it's a reference (enclosed in braces)
    if (value.startsWith('{') && value.endsWith('}')) {
      // Replace periods with dashes in variable references
      const varName = value.substring(1, value.length - 1).replace(/\./g, '-');
      
      // Special handling for font families
      if (varName.includes('Congnitive-Font-Families')) {
        return `var(--${varName})`;
      } else if (varName.includes('System-Font-Families')) {
        return `var(--${varName})`;
      } else {
        // Generic handling for other references
        return `var(--${varName})`;
      }
    }
    
    // If not a reference, return as is
    return value;
  }

/**
 * Convert System tokens to CSS custom properties
 * @param {Object} jsonContent - The parsed JSON content
 * @returns {string} - Generated CSS for system tokens
 */
/**
 * Convert System tokens to CSS custom properties
 * @param {Object} jsonContent - The complete JSON content
 * @param {string} outputDir - The directory to save the file
 * @returns {Promise<Object>} - Information about the generated file
 */
async function convertSystemToCss(jsonContent, outputDir) {
    // Find the system styles section - could be 'System-Styles/Default' or 'System/Default'
    const systemDefault = jsonContent['System-Styles/Default'] || jsonContent['System/Default'];
    
    if (!systemDefault) {
      console.error('System styles section not found in JSON content');
      return null;
    }
  
    // Start building the CSS
    let css = `:root {\n`;
    
    // Process all properties in the system default section
    for (const [key, value] of Object.entries(systemDefault)) {
      if (value && value.value !== undefined) {
        // Format the CSS variable name (convert camelCase or PascalCase to kebab-case with prefix)
        const varName = `--${key}`;
        
        // Format the value based on its type
        let cssValue = value.value;
        if (typeof cssValue === 'number') {
          // Add 'px' to numeric values
          cssValue = `${cssValue}px`;
        } else if (typeof cssValue === 'string') {
          // Check if it's a color or needs quotes
          if (cssValue.startsWith('#') || cssValue.startsWith('rgb') || cssValue.startsWith('hsl')) {
            // Color values don't need quotes
          } else if (cssValue.startsWith('{') && cssValue.endsWith('}')) {
            // Reference to another variable, convert to CSS var() format
            cssValue = `var(--${cssValue.substring(1, cssValue.length - 1).replace(/\./g, '-')})`;
          } else {
            // Add quotes to string values that aren't colors or references
            cssValue = `"${cssValue}"`;
          }
        }
        
        // Add the variable to the CSS
        css += `  ${varName}: ${cssValue};\n`;
      }
    }
    
    // Find common system variables that might be in other sections
    const systemSections = [
      'Sizing', 'Buttons', 'Focus', 'Cards', 'Inputs', 'Handles', 
      'Avatars', 'Accordian', 'Breakpoints', 'Modals', 'Navigation',
      'Spacing', 'Columns', 'Border', 'StatusBar', 'HoverOverlay'
    ];
    
    // Function to extract variables from a section
    const extractSectionVariables = (section, prefix) => {
      const sectionData = jsonContent[section] || 
                          jsonContent[`${section}/Default`] ||
                          systemDefault[section];
      
      if (!sectionData) return;
      
      // Process each property in the section
      for (const [key, value] of Object.entries(sectionData)) {
        if (value && (value.value !== undefined || typeof value === 'object')) {
          // For nested objects
          if (typeof value === 'object' && !value.value && !value.type) {
            // Process nested properties
            for (const [nestedKey, nestedValue] of Object.entries(value)) {
              if (nestedValue && nestedValue.value !== undefined) {
                const nestedVarName = `--${prefix}-${key}-${nestedKey}`;
                let nestedCssValue = nestedValue.value;
                
                // Format the value based on its type
                if (typeof nestedCssValue === 'number') {
                  nestedCssValue = `${nestedCssValue}px`;
                } else if (typeof nestedCssValue === 'string' && nestedCssValue.startsWith('{') && nestedCssValue.endsWith('}')) {
                  nestedCssValue = `var(--${nestedCssValue.substring(1, nestedCssValue.length - 1).replace(/\./g, '-')})`;
                }
                
                css += `  ${nestedVarName}: ${nestedCssValue};\n`;
              }
            }
          } else {
            // For direct properties
            const varName = `--${prefix}-${key}`;
            let cssValue = value.value;
            
            // Format the value based on its type
            if (typeof cssValue === 'number') {
              cssValue = `${cssValue}px`;
            } else if (typeof cssValue === 'string' && cssValue.startsWith('{') && cssValue.endsWith('}')) {
              cssValue = `var(--${cssValue.substring(1, cssValue.length - 1).replace(/\./g, '-')})`;
            }
            
            css += `  ${varName}: ${cssValue};\n`;
          }
        }
      }
    };
    
    // Extract variables from each section
    systemSections.forEach(section => {
      extractSectionVariables(section, section);
    });
    
    // Add additional variables from your example (if not already included)
    const additionalVariables = [
      { name: "--Sizing-Sizing-1", value: "var(--Sizing-1)" },
      { name: "--Sizing-Sizing-2", value: "var(--Sizing-2)" },
      { name: "--Sizing-Sizing-3", value: "var(--Sizing-3)" },
      { name: "--Sizing-Sizing-4", value: "var(--Sizing-4)" },
      { name: "--Sizing-Sizing-5", value: "var(--Sizing-5)" },
      { name: "--Sizing-Sizing-6", value: "var(--Sizing-6)" },
      { name: "--Sizing-Sizing-7", value: "var(--Sizing-7)" },
      { name: "--Sizing-Sizing-8", value: "var(--Sizing-8)" },
      { name: "--Sizing-Sizing-9", value: "var(--Sizing-9)" },
      { name: "--Sizing-Sizing-10", value: "var(--Sizing-10)" },
      { name: "--Sizing-Sizing-Half", value: "var(--Sizing-Half)" },
      { name: "--Sizing-Sizing-Quarter", value: "var(--Sizing-Quarter)" },
      { name: "--Sizing-Sizing-20", value: "var(--Sizing-20)" },
      { name: "--Sizing-Sizing-30", value: "var(--Sizing-30)" },
      { name: "--Sizing-Negative-Size-1", value: "var(--Negative-Size-1)" },
      { name: "--Sizing-Negative-Size-Quarter", value: "var(--Negative-Quarter)" },
      { name: "--Sizing-Negative-Size-Half", value: "var(--Negative-Half)" },
      { name: "--Sizing-Sizing-One-And-Half", value: "var(--Sizing-One-And-Half)" },
      { name: "--Sizing-Negative-Size-2", value: "var(--Negative-Size-2)" },
      { name: "--Sizing-Sizing-40", value: "var(--Sizing-40)" },
      { name: "--Sizing-Sizing-24", value: "var(--Sizing-24)" },
      { name: "--Sizing-Sizing-50", value: "var(--Sizing-50)" },
      { name: "--Sizing-Minimum Target", value: "var(--Cognitive-Default-Target)" },
      // More variables can be added here
    ];
    
    // Add any additional variables that weren't extracted from the JSON
    const existingVars = new Set(css.match(/--[\w-]+/g) || []);
    additionalVariables.forEach(variable => {
      if (!existingVars.has(variable.name)) {
        css += `  ${variable.name}: ${variable.value};\n`;
      }
    });
    
    // Close the CSS block
    css += `}\n`;
    
    // Save the file
    const systemFilename = 'system.css';
    const systemFilePath = path.join(outputDir, systemFilename);
    
    await fs.promises.writeFile(systemFilePath, css, 'utf8');
    
    return {
      file: systemFilename,
      path: systemFilePath
    };
  }

/**
 * Extract all mode variables from the background content
 * @param {Object} bgContent - The background content object
 * @param {string} mode - The mode name (e.g., "AA-dark")
 * @param {string} backgroundType - The background type (e.g., "Default", "Primary")
 * @returns {Array} - Array of CSS variable declarations
 */
/**
 * Extract all mode variables from the background content
 * @param {Object} bgContent - The background content object
 * @param {string} mode - The mode name (e.g., "AA-dark")
 * @param {string} backgroundType - The background type (e.g., "Default", "Primary")
 * @returns {Array} - Array of CSS variable declarations
 */
function extractModeVariables(bgContent, mode, backgroundType = 'default') {
    const variables = [];
    
    // Process all properties in the background content
    for (const [propName, propObj] of Object.entries(bgContent)) {
      // Skip label properties or properties without values
      if (propName === 'SurfaceContainer-Label' || !propObj || propObj.value === undefined) {
        continue;
      }
      
      // Add the variable with its value
      variables.push(`  --${propName}: ${propObj.value};\n`);
    }
    
    // Order is important, so sort the variables in a logical sequence
    // Here we can define a specific ordering for important properties
    const orderedVariables = [
      // Surface properties
      ...variables.filter(v => v.includes('--Surface:')),
      ...variables.filter(v => v.includes('--Surface-Dim:')),
      ...variables.filter(v => v.includes('--Surface-Bright:')),
      ...variables.filter(v => v.includes('--Surface-Quiet:')),
      ...variables.filter(v => v.includes('--Surface-Dim-Quiet:')),
      ...variables.filter(v => v.includes('--Surface-Bright-Quiet:')),
      
      // Container properties
      ...variables.filter(v => v.includes('--Container:')),
      ...variables.filter(v => v.includes('--Container-Low:')),
      ...variables.filter(v => v.includes('--Container-Lowest:')),
      ...variables.filter(v => v.includes('--Container-High:')),
      ...variables.filter(v => v.includes('--Container-Highest:')),
      ...variables.filter(v => v.includes('--Container-On-Quiet:')),
      ...variables.filter(v => v.includes('--Container-Low-Quiet:')),
      ...variables.filter(v => v.includes('--Container-Lowest-Quiet:')),
      ...variables.filter(v => v.includes('--Container-High-Quiet:')),
      ...variables.filter(v => v.includes('--Container-Highest-Quiet:')),
      
      // Dropdown colors
      ...variables.filter(v => v.includes('--Dropdown-Color-')),
      
      // Icon properties
      ...variables.filter(v => v.includes('--Surface-Icon-')),
      ...variables.filter(v => v.includes('--Container-Icon-')),
      
      // Border properties
      ...variables.filter(v => v.includes('--Surface-Border')),
      ...variables.filter(v => v.includes('--Container-Border')),
      
      // Button properties
      ...variables.filter(v => v.includes('--Surface-Button')),
      ...variables.filter(v => v.includes('--Container-Button')),
      ...variables.filter(v => v.includes('--Surface-On-Button')),
      ...variables.filter(v => v.includes('--Container-On-Button')),
      ...variables.filter(v => v.includes('--Surface-Light-Button')),
      ...variables.filter(v => v.includes('--Container-Light-Button')),
      ...variables.filter(v => v.includes('--Surface-On-Light-Button')),
      ...variables.filter(v => v.includes('--Container-On-Light-Button')),
      
      // Hotlink properties
      ...variables.filter(v => v.includes('--Surface-Hotlink')),
      ...variables.filter(v => v.includes('--Container-Hotlink')),
      
      // Any remaining properties not captured by the filters above
      ...variables.filter(v => 
        !v.includes('--Surface-Icon-') && 
        !v.includes('--Container-Icon-') && 
        !v.includes('--Surface-Border') && 
        !v.includes('--Container-Border') && 
        !v.includes('--Surface-Button') && 
        !v.includes('--Container-Button') && 
        !v.includes('--Surface-On-Button') && 
        !v.includes('--Container-On-Button') && 
        !v.includes('--Surface-Light-Button') && 
        !v.includes('--Container-Light-Button') && 
        !v.includes('--Surface-On-Light-Button') && 
        !v.includes('--Container-On-Light-Button') && 
        !v.includes('--Surface-Hotlink') && 
        !v.includes('--Container-Hotlink')
      )
    ];
    
    return orderedVariables;
  }

  /**
 * Process each background in the mode
 * @param {Object} backgrounds - The backgrounds object
 * @param {string} mode - The mode name
 * @returns {string} - Generated CSS for backgrounds
 */
/**
 * Process each background in the mode
 * @param {Object} backgrounds - The backgrounds object
 * @param {string} mode - The mode name
 * @returns {string} - Generated CSS for backgrounds
 */
function processBackgrounds(backgrounds, mode) {
  let css = '';
  
  // Process default background
  if (backgrounds.Default) {
    css += `/* ${mode} mode default background */\n`;
    css += `[data-mode="${mode}"] [data-background] {\n`;
    
    const variables = extractModeVariables(backgrounds.Default, mode);
    variables.forEach(variable => {
      css += variable;
    });
    
    css += '}\n\n';
  }
  
  // Process other named backgrounds
  for (const [bgName, bgContent] of Object.entries(backgrounds)) {
    // Handle standard backgrounds
    if (bgName !== 'Default' && !bgName.startsWith('StatusBar/')) {
      const bgNameLower = bgName.toLowerCase();
      
      css += `/* ${mode} mode specific background */\n`;
      css += `[data-mode="${mode}"] [data-background="${bgNameLower}"] {\n`;
      
      const variables = extractModeVariables(bgContent, mode, bgNameLower);
      variables.forEach(variable => {
        css += variable;
      });
      
      css += '}\n\n';
    }
    
    // Handle StatusBar backgrounds
    if (bgName.startsWith('StatusBar/')) {
      // Find which color/variant is set to "true"
      for (const [colorKey, colorValue] of Object.entries(bgContent)) {
        if (colorValue.value === 'true' && colorKey !== 'StatusBar-Label') {
          const statusBarLabel = bgContent['StatusBar-Label'].value;
          const colorLower = colorKey.toLowerCase();
          
          css += `/* ${mode} mode ${statusBarLabel} background */\n`;
          css += `[data-mode="${mode}"] [data-background="${statusBarLabel}"],\n`;
          css += `[data-mode="${mode}"] [data-background="${colorLower}"] {\n`;
          
          // You can add specific styles for these backgrounds here if needed
          css += `  /* ${statusBarLabel} ${colorKey} background styles */\n`;
          
          css += '}\n\n';
        }
      }
    }
  }
  
  return css;
}

function processShadowLevels(shadowLevels) {
    let css = '';
    
    // Start a :root block for the shadow variables
    css += `/* Box Shadow Variables */\n:root, ::after, ::before {\n`;
    
    // Add the default shadow
    css += `  --Box-Shadow-0: none;\n`;
    
    // Process each Shadow Level
    for (const [shadowKey, shadowContent] of Object.entries(shadowLevels)) {
        if (shadowKey.startsWith('Shadow-Level/')) {
          const level = shadowKey.split('/')[1];
          
          // Properly sanitize level names by replacing spaces and ampersands with hyphens
          const sanitizedLevel = level.replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
          
          css += `  --Box-Shadow-${sanitizedLevel}: ${generateBoxShadowValue(shadowContent, sanitizedLevel)};\n`;
        }
      }
    
    // Close the :root block
    css += `}\n\n`;
    
    // Default shadow (no attribute)
    css += `[data-shadow] {\n`;
    css += `  --Box-Shadow: var(--Box-Shadow-0);\n`;
    css += `}\n\n`;
    
    // Shadow Levels
    for (let i = 1; i <= 5; i++) {
      css += `[data-shadow="${i}"] {\n`;
      css += `  --Box-Shadow: var(--Box-Shadow-${i});\n`;
      css += `}\n\n`;
    }
    
    // Specific Shadow Use Cases
    const shadowUseCases = [
      { selector: 'Buttons', level: '0' },
      { selector: 'Buttons-Hover', level: '2' },
      { selector: 'Buttons-Raised', level: '3' },
      { selector: 'Buttons-Raised-Hover', level: '4' },
      { selector: 'Cards', level: '2' },
      { selector: 'Cards-Hover', level: '3' },
      { selector: 'Cards-Bottom-Sheet', level: '4' },  // Renamed from "Cards & Bottom Sheet"
      { selector: 'Navigation', level: '5' },
      { selector: 'Floating-Action', level: '5' },
      { selector: 'Floating-Action-Hover', level: '5' }
    ];
    
    shadowUseCases.forEach(useCase => {
      css += `[data-shadow="${useCase.selector}"] {\n`;
      css += `  --Box-Shadow: var(--Box-Shadow-${useCase.selector});\n`;
      css += `}\n\n`;
    });
    
    return css;
}
  
/**
 * Generate a proper box shadow value from the shadow level configuration
 * @param {Object} shadowLevel - The shadow level configuration
 * @param {string} level - The level name/identifier
 * @returns {string} - The generated box shadow value
 */
function generateBoxShadowValue(shadowLevel, level) {
    let shadowValue = '';
    
    // Replace any spaces and ampersands in the level name for variable references
    const sanitizedLevel = level.replace(/\s+&\s+/g, '-');
    
    // Find and process drop shadows
    const dropShadows = Object.keys(shadowLevel)
      .filter(key => key.startsWith('Drop'));
    
    dropShadows.forEach((dropKey, index) => {
      // External shadow
      shadowValue += `var(--Shadows-Level-${sanitizedLevel}-${dropKey}-Horizontal) `;
      shadowValue += `var(--Shadows-Level-${sanitizedLevel}-${dropKey}-Vertical) `;
      shadowValue += `var(--Shadows-Level-${sanitizedLevel}-${dropKey}-Blur) `;
      shadowValue += `var(--Shadows-Level-${sanitizedLevel}-${dropKey}-Spread) `;
      shadowValue += `var(--Shadows-Level-${sanitizedLevel}-${dropKey}-Color)`;
      
      // Inset shadow
      shadowValue += `, inset var(--Inner-Shadows-Level-${sanitizedLevel}-${dropKey}-Horizontal) `;
      shadowValue += `var(--Inner-Shadows-Level-${sanitizedLevel}-${dropKey}-Vertical) `;
      shadowValue += `var(--Inner-Shadows-Level-${sanitizedLevel}-${dropKey}-Blur) `;
      shadowValue += `var(--Inner-Shadows-Level-${sanitizedLevel}-${dropKey}-Spread) `;
      shadowValue += `var(--Inner-Shadows-Level-${sanitizedLevel}-${dropKey}-Color)`;
      
      // Add comma between drops, except for the last one
      if (index < dropShadows.length - 1) {
        shadowValue += ', ';
      }
    });
    
    return shadowValue;
  }
  
/**
 * Process mode target JSON structure into CSS
 * @param {Object} modeTarget - The mode target object
 * @param {string} mode - The mode name (e.g., "AA-dark")
 * @param {boolean} isDefaultMode - Whether this is the default mode (AA-light)
 * @returns {string} - Generated CSS for mode targets
 */
function processModeTarget(modeTarget, mode, isDefaultMode = false) {
    let css = `/* ${mode} mode targets */\n`;
    
    // Determine the appropriate selector
    const selector = isDefaultMode ? `[data-mode]` : `[data-mode="${mode}"]`;
    
    css += `${selector} {\n`;
    
    // Process all target values
    for (const [platform, valueObj] of Object.entries(modeTarget)) {
      if (valueObj.value !== undefined) {
        // Convert reference format {Desktop-Target}
        // to CSS variable format --Desktop-Target
        let value = valueObj.value;
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
          // Remove braces and convert dot notation to variable notation
          value = `var(--${value.substring(1, value.length - 1).replace(/\./g, '-')})`;
        } else if (typeof value === 'number') {
          value = `${value}px`;
        }
        
        css += `  --Mode-Target-${platform}: ${value};\n`;
      }
    }
    
    css += '}\n\n';
    
    return css;
  }
  

/**
 * Process paragraph spacing JSON structure into CSS
 * @param {Object} paragraphSpacing - The paragraph spacing object
 * @param {string} mode - The mode name (e.g., "AA-light")
 * @param {boolean} isDefaultMode - Whether this is the default mode (AA-light)
 * @returns {string} - Generated CSS for paragraph spacing
 */
/**
 * Process paragraph spacing JSON structure into CSS
 * @param {Object} paragraphSpacing - The paragraph spacing object
 * @param {string} mode - The mode name (e.g., "AA-light")
 * @param {boolean} isDefaultMode - Whether this is the default mode (AA-light)
 * @returns {string} - Generated CSS for paragraph spacing
 */
function processParagraphSpacing(paragraphSpacing, mode, isDefaultMode = false) {
    let css = '';
    
    // Add the appropriate PS multiplier for this mode
    css += `/* ${mode} mode paragraph spacing */\n`;
    
    // For AA-light, use just [data-mode] without a value
    if (isDefaultMode) {
      css += `[data-mode] {\n`;
    } else {
      css += `[data-mode="${mode}"] {\n`;
    }
    
    // Add the PS multiplier based on the mode (AA vs AAA)
    if (mode.startsWith('AA')) {
      css += `  --Mode-PS-multiplier: 200%;\n`;
    } else if (mode.startsWith('AAA')) {
      css += `  --Mode-PS-multiplier: 300%;\n`;
    }
    
    // Process other spacing values from the Default section but skip the specific ones to be removed
    if (paragraphSpacing.Default) {
      // List of variables to exclude
      const excludedVariables = [
        'Body-Medium',
        'Body-Small',
        'Body-Large',
        'Legal',
        'Caption'
      ];
      
      for (const [key, valueObj] of Object.entries(paragraphSpacing.Default)) {
        // Skip the excluded variables
        if (excludedVariables.includes(key)) {
          continue;
        }
        
        if (valueObj.value !== undefined) {
          // Convert reference format {Cognitive-Default.Body.Medium.AA-Paragraph-Spacing}
          // to CSS variable format --Cognitive-Default-Body-Medium-AA-Paragraph-Spacing
          let value = valueObj.value;
          if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            value = `var(--${value.substring(1, value.length - 1).replace(/\./g, '-')})`;
          } else if (typeof value === 'number') {
            value = `${value}px`;
          }
          
          css += `  --${key}: ${value};\n`;
        }
      }
    }
    
    css += `}\n\n`;
    
    return css;
}

/**
 * Extract chart-specific variables
 * @param {Object} chartContent - The chart content object
 * @returns {Array} - Array of CSS variable declarations
 */
function extractChartVariables(chartContent) {
  const variables = [];
  
  // Process all chart color variables
  for (const [key, valueObj] of Object.entries(chartContent)) {
    if (valueObj.value !== undefined) {
      variables.push(`  --${key}: ${valueObj.value};\n`);
    }
  }
  
  return variables;
}

/**
 * Extract platform typography variables with corrected font family references
 * @param {Object} platformContent - The platform content object
 * @param {String} platformName - The platform name
 * @returns {Array} - Array of CSS variable declarations
 */
function extractPlatformVariables(platformContent, platformName) {
    const variables = [];
    
    // Add platform-specific font family variables explicitly
    if (platformContent['Platform-Font-Families']) {
      const fontFamilies = platformContent['Platform-Font-Families'];
      
      // Standard font family
      if (fontFamilies.Standard && fontFamilies.Standard.value) {
        variables.push(`  --Platform-Font-Families-Standard: "${fontFamilies.Standard.value}";\n`);
      }
      
      // Decorative font family
      if (fontFamilies.Decorative && fontFamilies.Decorative.value) {
        variables.push(`  --Platform-Font-Families-Decorative: "${fontFamilies.Decorative.value}";\n`);
      }
    }
    
    // Add platform visibility variables
    const platforms = ['Android', 'IOS', 'Desktop'];
    platforms.forEach(platform => {
      // Check if the platform exists in the content and has a boolean value
      const platformValue = platformContent[platform] && platformContent[platform].value;
      variables.push(`  --${platform}: ${platformValue === 'true' ? 'block' : 'none'};\n`);
    });
    
    // Determine the correct section to process platform-specific variables
    const defaultContent = platformContent['Platform-Default'] || platformContent['Default'] || platformContent;
    
    // Recursive function to flatten nested objects into CSS variables
    const processPlatformVariables = (obj, prefix = 'Platform') => {
      for (const [key, value] of Object.entries(obj)) {
        // Skip non-object or null values
        if (value === null || typeof value !== 'object') continue;
        
        // Handle reference values
        if (value.value !== undefined) {
          let cssValue = value.value;
          
          // Convert reference format {Something.Something} to var(--Something-Something)
          if (typeof cssValue === 'string' && cssValue.startsWith('{') && cssValue.endsWith('}')) {
            // Special handling for font families with consistent formatting
            if (cssValue.includes('Cognitive-Font-Families') || cssValue.includes('Congnitive-Font-Families')) {
              // Fix the spelling if needed (Congnitive → Cognitive)
              cssValue = cssValue
                .replace('Congnitive-Font-Families', 'Cognitive-Font-Families')
                .replace(/[{}]/g, '') // Remove both braces
                .replace(/\./g, '-'); // Replace dots with dashes
              
              cssValue = `var(--${cssValue})`;
            } else {
              // Generic handling for other references
              cssValue = cssValue.replace(/[{}]/g, '').replace(/\./g, '-');
              cssValue = `var(--${cssValue})`;
            }
          }
          
          // Add px for numeric values
          if (typeof cssValue === 'number') {
            cssValue = `${cssValue}px`;
          }
          
          // Create variable name, replacing dots and handling special cases
          const variableName = `--${prefix}-${key.replace(/\./g, '-')}`;
          variables.push(`  ${variableName}: ${cssValue};\n`);
        }
        
        // Recursively process nested objects
        if (typeof value === 'object' && value !== null) {
          processPlatformVariables(value, `${prefix}-${key}`);
        }
      }
    };
    
    // Start processing from the default content
    processPlatformVariables(defaultContent);
    
    return variables;
}

/**
 * Generate a typography CSS file that works with all JSON cognitive profiles
 * @param {Object} jsonContent - The complete JSON content
 * @param {string} outputDir - The directory to save the file
 * @returns {Promise<Object>} - Information about the generated file
 */
async function generateTypographyCSS(jsonContent, outputDir) {
    // Start building the CSS
    let css = `:root, ::after, ::before {\n`;
    
    // Add font families first (from the Platform section)
    css += `  --Typography-Font-Families-Standard: var(--Platform-Font-Families-Standard);\n`;
    css += `  --Typogrpahy--Font-Families-Decorative: var(--Platform-Font-Families-Decorative);\n`;
    
    // Process each cognitive profile to extract typography variables
    const cognitiveProfiles = [
      'Cognitive/None', 
      'Cognitive/ADHD', 
      'Cognitive/Dyslexia'
    ];
    
    // We'll primarily use the "None" profile for typography variables
    const noneProfile = jsonContent['Cognitive/None'];
    if (noneProfile) {
      // Process the Cognitive-Default section
      const defaultContent = noneProfile['Cognitive-Default'];
      
      if (defaultContent) {
        // Process each typography section (Body, Buttons, etc.)
        const sections = [
          'Body', 'Buttons', 'Captions', 'Subtitles', 'Legal', 
          'Labels', 'Overline', 'Display', 'Headers', 'Number'
        ];
        
        // Process each section
        for (const section of sections) {
          if (defaultContent[section]) {
            for (const [typeName, typeProps] of Object.entries(defaultContent[section])) {
              // Format the type name (e.g., "Small-Semibold" to "SmallSemibold")
              const formattedTypeName = typeName.replace(/-/g, '');
              
              // Process each property
              for (const [propName, propObj] of Object.entries(typeProps)) {
                if (propObj && propObj.value !== undefined) {
                  // Create the CSS variable name
                  const varName = `--Typography-${section}-${formattedTypeName}-${propName}`;
                  
                  // Format the value (handle reference format)
                  let value = propObj.value;
                  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
                    // Extract the reference path
                    const refPath = value.substring(1, value.length - 1);
                    
                    // Handle different reference formats
                    if (refPath.startsWith('Platform-Default.')) {
                      value = `var(--${refPath.replace(/\./g, '-')})`;
                    } else if (refPath.startsWith('Platform-Font-Families.')) {
                      value = `var(--Platform-Font-Families-${refPath.split('.')[1]})`;
                    } else if (refPath.startsWith('Congnitive-Font-Families.')) {
                      value = `var(--Congnitive-Font-Families-${refPath.split('.')[1]})`;
                    } else if (refPath.startsWith('Platform-2x.')) {
                      value = `var(--${refPath.replace(/\./g, '-')})`;
                    } else {
                      value = `var(--${refPath.replace(/\./g, '-')})`;
                    }
                  } else if (typeof value === 'number') {
                    value = `${value}px`;
                  }
                  
                  // Add the variable to the CSS
                  css += `  ${varName}: ${value};\n`;
                }
              }
            }
          }
        }
      }
      
      // Special case for Cognitive font families
      if (noneProfile['Congnitive-Font-Families']) {
        const fontFamilies = noneProfile['Congnitive-Font-Families'];
        if (fontFamilies.Standard && fontFamilies.Standard.value) {
          // Extract the value (removing quotes if needed)
          let value = fontFamilies.Standard.value;
          if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            value = `var(--${value.substring(1, value.length - 1).replace(/\./g, '-')})`;
          } else {
            value = `"${value}"`;
          }
          css += `  --Congnitive-Font-Families-Standard: ${value};\n`;
        }
        
        if (fontFamilies.Decorative && fontFamilies.Decorative.value) {
          // Extract the value (removing quotes if needed)
          let value = fontFamilies.Decorative.value;
          if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            value = `var(--${value.substring(1, value.length - 1).replace(/\./g, '-')})`;
          } else {
            value = `"${value}"`;
          }
          css += `  --Congnitive-Font-Families-Decorative: ${value};\n`;
        }
      }
    }
    
    // Add cognitive target and multiplier
    css += `  --Cognitive-Target: var(--Platform-Default-Target);\n`;
    css += `  --Cognitive-Multiplier: 1;\n`;
    
    // Close the CSS block
    css += `}\n`;
    
    // Save the file
    const typographyFilename = 'typography.css';
    const typographyFilePath = path.join(outputDir, typographyFilename);
    
    await fs.promises.writeFile(typographyFilePath, css, 'utf8');
    
    return {
      file: typographyFilename,
      path: typographyFilePath
    };
  }

/**
 * Extract cognitive variables - simplified to only include the multiplier
 * This is a direct replacement for the existing function
 * @param {Object} cognitiveContent - The cognitive profile content
 * @returns {Array} - Array of CSS variable declarations
 */
function extractCognitiveVariables(cognitiveContent) {
    const variables = [];
    
    // Get the profile name from either Cognitive-Profile or Cognitive-Label
    const profileName = cognitiveContent['Cognitive-Profile']?.value || 
                        cognitiveContent['Cognitive-Label']?.value || 
                        'None';
    
    // Add Cognitive Multiplier based on profile type - this is the only variable we're keeping
    if (profileName.toLowerCase() === 'none') {
      variables.push(`  --Cognitive-Multiplier: 1;\n`);
    } else if (profileName.toLowerCase() === 'adhd' || profileName.toLowerCase() === 'dyslexia') {
      variables.push(`  --Cognitive-Multiplier: 1.5;\n`);
    }
    
    return variables;
}

/**
 * Process surface containers JSON structure into CSS
 * @param {Object} jsonContent - The complete JSON content
 * @returns {string} - Generated CSS for surface containers
 */
function processSurfaceContainers(jsonContent) {
  let css = `/**
 * Surface and Container variables
 * Generated by JsonToCss
 */\n\n`;
  
  // Process each surface/container entry
  for (const [key, content] of Object.entries(jsonContent)) {
    if (key.startsWith('Surface and Containers/')) {
      // Extract the container name (e.g., Surface, Surface-Dim, etc.)
      const containerName = key.split('/')[1];
      
      // Get the label value if available, otherwise use the container name
      const labelValue = content['SurfaceContainer-Label'] && content['SurfaceContainer-Label'].value 
        ? content['SurfaceContainer-Label'].value 
        : containerName;
      
      // Create the CSS selector, default is without value
      if (containerName === 'Surface') {
        css += `[data-surfaceContainer] {\n`;
      } else {
        css += `[data-surfaceContainer="${labelValue}"] {\n`;
      }
      
      // Process all properties
      for (const [propName, propObj] of Object.entries(content)) {
        // Skip the label property as it's used for the selector
        if (propName === 'SurfaceContainer-Label') {
          continue;
        }
        
        if (propObj.value !== undefined) {
          // Handle different value types
          let value = propObj.value;
          
          // Convert reference format {Something} to var(--Something)
          if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            value = `var(--${value.substring(1, value.length - 1)})`;
          } else if (typeof value === 'number') {
            value = `${value}px`;
          } else if (typeof value === 'boolean') {
            value = value ? 'true' : 'false';
          }
          
          css += `--${propName}: ${value};\n`;
        }
      }
      
      css += `}\n\n`;
    }
  }
  
  return css;
}

/**
 * Process sizing and spacing sections from JSON and convert to CSS
 * @param {Object} jsonContent - The parsed JSON content
 * @returns {string} - The generated CSS for sizing and spacing
 */
function processSizingSpacing(jsonContent) {
  let css = '';
  
  // Process each mode (Default, Expanded, Reduced)
  for (const [modeName, modeContent] of Object.entries(jsonContent)) {
    if (modeName.startsWith('Sizing & Spacing/')) {
      // Extract the mode name (e.g., Default, Expanded, Reduced)
      const mode = modeName.split('/')[1];
      
      // Create the CSS selector
      if (mode === 'Default') {
        css += `/* Default sizing and spacing */\n[data-sizing-spacing] {\n`;
      } else {
        css += `/* ${mode} sizing and spacing */\n[data-sizing-spacing="${mode.toLowerCase()}"] {\n`;
      }
      
      // Process all sizing and spacing properties
      if (modeContent.Default) {
        for (const [propName, propContent] of Object.entries(modeContent.Default)) {
          if (propContent.value !== undefined) {
            // Add px suffix to all numeric values
            css += `  --${propName}: ${propContent.value}px;\n`;
          }
        }
      }
      
      // Close the CSS block
      css += `}\n\n`;
    }
  }
  
  return css;
}

/**
 * Convert the given JSON content to multiple CSS files with a base file
 * @param {Object} jsonContent - The parsed JSON content
 * @param {string} outputDir - The directory to save output files
 * @returns {Object} - Object with information about generated files
 */
async function convertToCssFiles(jsonContent, outputDir) {
    console.log(`Attempting to create output directory: ${outputDir}`);
    
    const results = {
        base: null,
        typography: null, // <-- Add this line
        modes: [],
        platforms: [],
        cognitive: [],
        sizingSpacing: [],
        surfaceContainers: null,
        system: null,
        shadowLevels: null
    };
  
  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    try {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`Successfully created output directory: ${outputDir}`);
    } catch (mkdirError) {
      console.error(`Error creating output directory: ${mkdirError}`);
      throw mkdirError;
    }
  }
  
  // Extract common variables for the base CSS file
  let baseCSS = `/**
 * Base CSS variables - Common properties across all themes
 * Generated by JsonToCss
 */

:root {
  /* System font families */
  --System-Font-Families-Standard: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --System-Font-Families-Decorative: "Georgia", "Times New Roman", serif;
  
  /* Other global variables */
  --global-border-radius: 4px;
  --global-transition-duration: 0.2s;
}\n\n`;
  
  // Save base CSS file
  const baseFilename = 'base.css';
  const baseFilePath = path.join(outputDir, baseFilename);
  await fs.promises.writeFile(baseFilePath, baseCSS, 'utf8')
    .then(() => console.log(`Successfully wrote ${baseFilename}`))
    .catch(err => console.error(`Error writing ${baseFilename}:`, err));

  results.base = {
    file: baseFilename,
    path: baseFilePath
  };

  try {
    results.typography = await generateTypographyCSS(jsonContent, outputDir);
    console.log(`Successfully wrote ${results.typography.file}`);
  } catch (err) {
    console.error(`Error writing typography CSS:`, err);
  }
  
  // Process system tokens
  if (jsonContent['System/Default']) {
    const systemCSS = convertSystemToCss(jsonContent);
    const systemFilename = 'system.css';
    const systemFilePath = path.join(outputDir, systemFilename);
    
    await fs.promises.writeFile(systemFilePath, systemCSS, 'utf8');
    results.system = {
      file: systemFilename,
      path: systemFilePath
    };
  }
  
  // Process surface containers
  if (Object.keys(jsonContent).some(key => key.startsWith('Surface and Containers/'))) {
    const surfaceContainersCSS = processSurfaceContainers(jsonContent);
    const surfaceContainersFilename = 'surface-containers.css';
    const surfaceContainersFilePath = path.join(outputDir, surfaceContainersFilename);
    
    await fs.promises.writeFile(surfaceContainersFilePath, surfaceContainersCSS, 'utf8');
    results.surfaceContainers = {
      file: surfaceContainersFilename,
      path: surfaceContainersFilePath
    };
  }
  // Process shadow levels
  if (Object.keys(jsonContent).some(key => key.startsWith('Shadow-Level/'))) {
    const shadowLevelsCSS = processShadowLevels(jsonContent);
    const shadowLevelsFilename = 'shadow-levels.css';
    const shadowLevelsFilePath = path.join(outputDir, shadowLevelsFilename);
    
    await fs.promises.writeFile(shadowLevelsFilePath, shadowLevelsCSS, 'utf8');
    results.shadowLevels = {
      file: shadowLevelsFilename,
      path: shadowLevelsFilePath
    };
  }

  // Process each mode
  for (const [modeName, modeContent] of Object.entries(jsonContent)) {
    if (modeName.startsWith('Modes/')) {
      // Get the mode name (e.g., AA-light from Modes/AA-light)
      const mode = modeName.split('/')[1];
      let css = '';
      
      // Process backgrounds with separate selectors per background type
      if (modeContent.Backgrounds) {
        // Determine the selector based on whether it's the default mode (AA-light)
        const isDefaultMode = mode === 'AA-light';
        
        // Process default background (no specific background attribute)
        if (modeContent.Backgrounds.Default) {
          css += `/* ${mode} mode specific backgrounds */\n`;
          // For AA-light, use just [data-mode] without a value
          if (isDefaultMode) {
            css += `[data-mode] [data-background] {\n`;
          } else {
            css += `[data-mode="${mode}"] [data-background] {\n`;
          }
          
          const variables = extractModeVariables(modeContent.Backgrounds.Default);
          variables.forEach(variable => {
            css += variable;
          });
          
          css += '}\n\n';
        }
        
        // Process other named backgrounds
        for (const [bgName, bgContent] of Object.entries(modeContent.Backgrounds)) {
          if (bgName !== 'Default') {
            const bgNameLower = bgName.toLowerCase();
            
            css += `/* ${mode} mode specific backgrounds */\n`;
            // For AA-light, use just [data-mode] without a value
            if (isDefaultMode) {
              css += `[data-mode] [data-background="${bgNameLower}"] {\n`;
            } else {
              css += `[data-mode="${mode}"] [data-background="${bgNameLower}"] {\n`;
            }
            
            const variables = extractModeVariables(bgContent);
            variables.forEach(variable => {
              css += variable;
            });
            
            css += '}\n\n';
          }
        }
      }
      
      // Process mode targets if present
      if (modeContent['Mode-Target']) {
        css += processModeTarget(modeContent['Mode-Target'], mode, mode === 'AA-light');
      }
      
      // Process charts
      if (modeContent.Charts) {
        for (const [chartType, chartContent] of Object.entries(modeContent.Charts)) {
          css += `/* ${mode} mode ${chartType} chart */\n`;
          
          // For AA-light, use just [data-mode] without a value
          if (mode === 'AA-light') {
            css += `[data-mode] [charts="${chartType}"] {\n`;
          } else {
            css += `[data-mode="${mode}"] [charts="${chartType}"] {\n`;
          }
          
          // Extract chart color variables
          const chartVars = extractChartVariables(chartContent);
          chartVars.forEach(variable => {
            css += variable;
          });
          
          css += `}\n\n`;
        }
      }
      
      // Process paragraph spacing if present
      if (modeContent['Mode-Paragraph-Spacing']) {
        css += processParagraphSpacing(modeContent['Mode-Paragraph-Spacing'], mode, mode === 'AA-light');
      }
      
      // Save mode-specific CSS to a file
      const modeFilename = `mode-${mode.toLowerCase()}.css`;
      const modeFilePath = path.join(outputDir, modeFilename);
      
      await fs.promises.writeFile(modeFilePath, css, 'utf8');
      results.modes.push({
        mode,
        file: modeFilename,
        path: modeFilePath
      });
    } else if (modeName.startsWith('Platform/')) {
      // Get the platform name (e.g., Desktop from Platform/Desktop)
      const platform = modeName.split('/')[1];
      let css = '';
      
      // Process platform typography
      css += `/* ${platform} platform specific typography */\n`;
      css += `[data-platform="${platform}"] {\n`;
      
      // Extract platform variables
      const platformVars = extractPlatformVariables(modeContent, platform);
      platformVars.forEach(variable => {
        css += variable;
      });
      
      css += '}\n\n';
      
      // Save platform-specific CSS to a file
      const platformFilename = `platform-${platform.toLowerCase()}.css`;
      const platformFilePath = path.join(outputDir, platformFilename);
      
      await fs.promises.writeFile(platformFilePath, css, 'utf8');
      results.platforms.push({
        platform,
        file: platformFilename,
        path: platformFilePath
      });
    }
  }
  
  // Add sizing and spacing section
  const sizingSpacingCSS = processSizingSpacing(jsonContent);
  if (sizingSpacingCSS) {
    const sizingSpacingFilename = 'sizing-spacing.css';
    const sizingSpacingFilePath = path.join(outputDir, sizingSpacingFilename);
    
    await fs.promises.writeFile(sizingSpacingFilePath, sizingSpacingCSS, 'utf8');
    results.sizingSpacing = {
      file: sizingSpacingFilename,
      path: sizingSpacingFilePath
    };
  }
  
// Process cognitive variables for different profiles
const cognitiveProfiles = [
    'Cognitive/None', 
    'Cognitive/ADHD', 
    'Cognitive/Dyslexia'
  ];
  
  for (const profileKey of cognitiveProfiles) {
    if (jsonContent[profileKey]) {
      // Extract the profile name from the key (e.g., "None" from "Cognitive/None")
      const profileName = profileKey.split('/')[1];
      
      // Start building the CSS
      let cognitiveCss = `/* Cognitive profile: ${profileName} */\n`;
      cognitiveCss += `[data-cognitive-profile="${profileName.toLowerCase()}"] {\n`;
      
      // Add the appropriate cognitive multiplier based on profile
      if (profileName.toLowerCase() === 'none') {
        cognitiveCss += `  --Cognitive-Multiplier: 1;\n`;
      } else {
        cognitiveCss += `  --Cognitive-Multiplier: 1.5;\n`;
      }
      
      // Add the rest of the cognitive variables
      cognitiveCss += extractCognitiveVariables(jsonContent[profileKey]).join('');
      cognitiveCss += `}\n`;
      
      const cognitiveFilename = `cognitive-${profileName.toLowerCase()}.css`;
      const cognitiveFilePath = path.join(outputDir, cognitiveFilename);
      
      await fs.promises.writeFile(cognitiveFilePath, cognitiveCss, 'utf8');
      results.cognitive.push({
        profile: profileName,
        file: cognitiveFilename,
        path: cognitiveFilePath
      });
    }
  }
  
  return results;
}

/**
 * Generate a JavaScript loader script to dynamically load the appropriate CSS files
 * @param {string} outputDir - The directory to save the loader script
 * @param {Object} fileInfo - Information about generated CSS files
 * @returns {Promise<string>} - Path to the generated loader script
 */
async function generateLoaderScript(outputDir, fileInfo) {
    const loaderContent = `/**
   * Dynamic CSS loader for theme files
   * Auto-generated by JsonToCss
   */
  class ThemeLoader {
    constructor() {
      this.loadedStylesheets = new Map();
      this.defaultMode = 'aa-light';
      this.defaultPlatform = this.detectPlatform();
      this.defaultCognitiveProfile = 'none';
      this.initialized = false;
    }
  
    /**
     * Detect the current platform
     * @returns {string} - Detected platform (desktop, mobile, tablet)
     */
    detectPlatform() {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(navigator.userAgent);
      
      if (isMobile) return 'mobile';
      if (isTablet) return 'tablet';
      return 'desktop';
    }
  
    /**
     * Detect color scheme preference
     * @returns {string} - 'light' or 'dark'
     */
    detectColorScheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  
    /**
     * Load a CSS file dynamically
     * @param {string} fileName - The CSS file to load
     * @param {string} id - Unique identifier for the stylesheet
     * @returns {Promise} - Promise that resolves when the stylesheet is loaded
     */
    loadStylesheet(fileName, id) {
      return new Promise((resolve, reject) => {
        // If already loaded, resolve immediately
        if (this.loadedStylesheets.has(id)) {
          resolve();
          return;
        }
  
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = fileName;
        link.id = id;
  
        link.onload = () => {
          this.loadedStylesheets.set(id, link);
          resolve();
        };
  
        link.onerror = () => {
          reject(new Error(\`Failed to load \${fileName}\`));
        };
  
        document.head.appendChild(link);
      });
    }
  
    /**
     * Initialize the theme by loading base CSS files
     * @returns {Promise} - Promise that resolves when base CSS is loaded
     */
    async initialize() {
      if (this.initialized) {
        return;
      }
  
      try {
        // Load base CSS files
        const baseFiles = [
            { name: 'base.css', id: 'theme-base' },
            { name: 'typography.css', id: 'theme-typography' }, // <-- Add this line
            { name: 'system.css', id: 'theme-system' },
            { name: 'shadow-levels.css', id: 'theme-shadow-levels' },
            { name: 'sizing-spacing.css', id: 'theme-sizing-spacing' },
            { name: 'surface-containers.css', id: 'theme-surface-containers' }
        ];
  
        for (const file of baseFiles) {
          await this.loadStylesheet(file.name, file.id);
        }
        
        this.initialized = true;
      } catch (err) {
        console.error('Error initializing theme:', err);
      }
    }
  
    /**
     * Set the current theme data attributes on the document
     * @param {Object} options - Theme configuration options
     */
    setThemeAttributes(options) {
      const {
        mode = this.defaultMode,
        platform = this.defaultPlatform,
        cognitiveProfile = this.defaultCognitiveProfile
      } = options;
  
      document.documentElement.setAttribute('data-mode', mode);
      document.documentElement.setAttribute('data-platform', platform);
      document.documentElement.setAttribute('data-cognitive-profile', cognitiveProfile);
    }
  
    /**
     * Load the appropriate CSS files based on settings
     * @param {Object} options - Configuration options
     * @returns {Promise} - Promise that resolves when all stylesheets are loaded
     */
    async loadTheme(options = {}) {
      // Initialize if not already done
      await this.initialize();
      
      // Merge provided options with defaults
      const themeOptions = {
        mode: options.mode || this.detectColorScheme() === 'dark' ? 'aa-dark' : this.defaultMode,
        platform: options.platform || this.defaultPlatform,
        cognitiveProfile: options.cognitiveProfile || this.defaultCognitiveProfile
      };
  
      const promises = [];
  
      // Load mode CSS
      promises.push(
        this.loadStylesheet(\`mode-\${themeOptions.mode}.css\`, \`theme-mode-\${themeOptions.mode}\`)
          .catch(err => console.warn(\`Could not load mode CSS: \${err.message}\`))
      );
  
      // Load platform CSS
      promises.push(
        this.loadStylesheet(\`platform-\${themeOptions.platform}.css\`, \`theme-platform-\${themeOptions.platform}\`)
          .catch(err => console.warn(\`Could not load platform CSS: \${err.message}\`))
      );
  
      // Load cognitive profile CSS
      promises.push(
        this.loadStylesheet(\`cognitive-\${themeOptions.cognitiveProfile}.css\`, \`theme-cognitive-\${themeOptions.cognitiveProfile}\`)
          .catch(err => console.warn(\`Could not load cognitive profile CSS: \${err.message}\`))
      );
  
      // Set data attributes on the document
      this.setThemeAttributes(themeOptions);
  
      return Promise.all(promises);
    }
  
    /**
     * Create settings UI for theme customization
     */
    createSettingsUI() {
      const settingsContainer = document.createElement('div');
      settingsContainer.id = 'theme-settings';
      settingsContainer.innerHTML = \`
        <div class="theme-settings-section">
          <h3>Accessibility Mode</h3>
          <select id="accessibility-mode">
            <option value="aa-light">WCAG AA (Light)</option>
            <option value="aa-dark">WCAG AA (Dark)</option>
            <option value="aaa-light">WCAG AAA (Light)</option>
            <option value="aaa-dark">WCAG AAA (Dark)</option>
          </select>
        </div>
        <div class="theme-settings-section">
          <h3>Cognitive Profile</h3>
          <select id="cognitive-profile">
            <option value="none">None</option>
            <option value="adhd">ADHD</option>
            <option value="dyslexia">Dyslexia</option>
          </select>
        </div>
      \`;
  
      // Add event listeners for settings
      const accessibilityModeSelect = settingsContainer.querySelector('#accessibility-mode');
      const cognitiveProfileSelect = settingsContainer.querySelector('#cognitive-profile');
  
      accessibilityModeSelect.addEventListener('change', (e) => {
        this.loadTheme({ mode: e.target.value });
      });
  
      cognitiveProfileSelect.addEventListener('change', (e) => {
        this.loadTheme({ cognitiveProfile: e.target.value });
      });
  
      // Set initial values
      accessibilityModeSelect.value = this.defaultMode;
      cognitiveProfileSelect.value = this.defaultCognitiveProfile;
  
      document.body.appendChild(settingsContainer);
    }
  }
  
  // Create a global instance
  window.themeLoader = new ThemeLoader();
  
  // Auto-load theme based on default settings
  document.addEventListener('DOMContentLoaded', () => {
    // Auto-detect mode and platform
    const initialMode = window.themeLoader.detectColorScheme() === 'dark' 
      ? 'aa-dark' 
      : window.themeLoader.defaultMode;
    
    const initialPlatform = window.themeLoader.detectPlatform();
  
    // Load theme with initial settings
    window.themeLoader.loadTheme({
      mode: initialMode,
      platform: initialPlatform
    });
  
    // Optional: Create settings UI
    window.themeLoader.createSettingsUI();
  });
  `;
  
    const loaderPath = path.join(outputDir, 'theme-loader.js');
    await fs.promises.writeFile(loaderPath, loaderContent, 'utf8');
    
    return loaderPath;
  }

/**
 * Main function to convert a JSON file to multiple CSS files
 * @param {string} inputPath - Path to the input JSON file
 * @param {string} outputDir - Path for the output directory
 */
async function convertJsonFileToCssFiles(inputPath, outputDir) {
    try {
      // Read the JSON file
      const data = await fs.promises.readFile(inputPath, 'utf8');
      const jsonContent = JSON.parse(data);
      
      // Transform to multiple CSS files
      const results = await convertToCssFiles(jsonContent, outputDir);
      
      // Generate the loader script (THIS LINE IS MISSING)
      const loaderPath = await generateLoaderScript(outputDir, results);
      
      console.log(`Successfully generated CSS files in ${outputDir}`);
      console.log(`- base.css (common styles)`);

      if (results.typography) {
        console.log(`- typography.css (typography variables)`);
      }
      
      if (results.system) {
        console.log(`- system.css (system tokens)`);
      }
      
      if (results.surfaceContainers) {
        console.log(`- surface-containers.css (surface containers)`);
      }
      
      if (results.sizingSpacing) {
        console.log(`- sizing-spacing.css (sizing and spacing)`);
      }
      
      console.log(`- ${results.modes.length} mode files`);
      console.log(`- ${results.platforms.length} platform files`);
      
      // Should also log the loader script creation (MISSING)
      console.log(`- theme-loader.js (dynamic CSS loader)`);
      
      return results;
    } catch (error) {
      console.error('Error converting JSON to CSS files:', error);
      process.exit(1);
    }
  }

// Handle command line arguments
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.length < 4) {
    console.error('Usage: node JsonToCssSplit.js <inputJsonPath> <outputDirectory>');
    process.exit(1);
  }
  
  const inputPath = process.argv[2];
  const outputDir = process.argv[3];
  
  convertJsonFileToCssFiles(inputPath, outputDir)
    .then(results => {
      console.log('Conversion completed successfully!');
    })
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}

// Export all functions
export { 
  convertFontFamilyReference,
  convertSystemToCss,
  extractModeVariables,
  extractChartVariables,
  extractPlatformVariables,
  processParagraphSpacing,
  processModeTarget,
  processSurfaceContainers,
  processSizingSpacing,
  convertToCssFiles,
  processBackgrounds,
  extractCognitiveVariables, 
  convertJsonFileToCssFiles,
  processShadowLevels,
  generateTypographyCSS
};
