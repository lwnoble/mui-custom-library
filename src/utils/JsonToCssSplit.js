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
 * Extract system tokens for base.css in the desired format
 * @param {Object} jsonContent - The complete JSON content
 * @returns {string} - Generated CSS for base system tokens
 */
function extractBaseSystemTokens(jsonContent) {
    // Specifically look for 'System-Styles/Default' for base.css
    const systemDefault = jsonContent['System-Styles/Default'];
    
    if (!systemDefault) {
      console.error('System-Styles/Default section not found in JSON content');
      return '';
    }
  
    // Start building the CSS
    let css = '';
    
    // List of system properties to include in base.css
    const baseSystemProperties = [
      'Transparent',
      'Name',
      'Color-Theory',
      'Surface-Style',
      'Desktop-Target',
      'Grid'
    ];
    
    // Process the selected system properties
    for (const key of baseSystemProperties) {
      if (systemDefault[key] && systemDefault[key].value !== undefined) {
        // Format the value based on its type
        let cssValue = systemDefault[key].value;
        if (typeof cssValue === 'number') {
          // Add 'px' to numeric values
          cssValue = `${cssValue}px`;
        } else if (typeof cssValue === 'string') {
          // Check if it's a reference
          if (cssValue.startsWith('{') && cssValue.endsWith('}')) {
            // Convert reference to var() format
            cssValue = `var(--${cssValue.substring(1, cssValue.length - 1).replace(/\./g, '-')})`;
          } else if (cssValue.startsWith('#') || cssValue.startsWith('rgb') || cssValue.startsWith('hsl')) {
            // Color values don't need quotes
          } else {
            // Add quotes to string values
            cssValue = `"${cssValue}"`;
          }
        }
        
        // Add the variable to the CSS with proper indentation
        css += `  --${key}: ${cssValue};\n`;
      }
    }
    
    return css;
}

/**
 * Convert System tokens to CSS custom properties
 * @param {Object} jsonContent - The complete JSON content
 * @param {string} outputDir - The directory to save the file
 * @returns {Promise<Object>} - Information about the generated file
 */
function convertSystemToCss(jsonContent) {
    const systemDefaults = jsonContent['System/Default'];
    
    // Helper function to clean up variable names
    const cleanVariableName = (name) => {
        // Remove redundant repeated prefixes and section names
        return name
        .replace(/^Sizing-Sizing-/, 'Sizing-')
        .replace(/^Focus-Focus-/, 'Focus-')
        .replace(/^Buttons-Buttons-/, '')
        .replace(/^Buttons-Button-/, '')
        .replace(/^Card-Card-/, '')
        .replace(/^Cards-Card-/, '')
        .replace(/^Input-Input-/, '')
        .replace(/^Inputs-Input-/, '')
        .replace(/^Handle-Handle-/, '')
        .replace(/^Handles-Handle-/, '')
        .replace(/^Avatars-Small-/, 'Small-')
        .replace(/^Modals-Modal-/, '')
        .replace(/^Navigation-LeftNav-/, 'LeftNav-')
        // Replace references to 'Default-' with direct reference
        .replace(/^Default-/, '');
    };

  
    // Start building CSS
    let css = `:root {\n`;
    
    // Mode Target calculation with dynamic handling
    if (systemDefaults['Mode-Target']) {
      if (typeof systemDefaults['Mode-Target'].value === 'string') {
        if (systemDefaults['Mode-Target'].value.startsWith('{') && systemDefaults['Mode-Target'].value.endsWith('}')) {
          const refValue = systemDefaults['Mode-Target'].value.substring(1, systemDefaults['Mode-Target'].value.length - 1).replace(/\./g, '-');
          css += `  --Mode-Target: var(--${refValue});\n\n`;
        } else {
          css += `  --Mode-Target: ${systemDefaults['Mode-Target'].value}px;\n\n`;
        }
      } else if (typeof systemDefaults['Mode-Target'] === 'object' && systemDefaults['Mode-Target'].Desktop) {
        const platforms = ['Desktop', 'Android', 'IOS-Mobile', 'IOS-Tablet'];
        platforms.forEach(platform => {
          if (systemDefaults['Mode-Target'][platform]) {
            css += `  --Mode-Target-${platform.replace(/-/g, '-')}: ${systemDefaults['Mode-Target'][platform].value}px;\n`;
          }
        });
        css += '\n';
      }
    }
    
    // Minimum Target calculation
    css += `  --Minimum-Target: min(var(--Cognitive-Target), var(--Platform-Target), var(--Mode-Target));\n`;
    css += `  --Min-Target: min(var(--Desktop-Target), var(--Platform-Target), var(--Cognitive-Target));\n\n`;
    
    // Hotlinks and ListItem with calc() using Sizing-1
    css += `  --Hotlinks-Minimum-Hotlink-Area: calc(var(--Minimum-Target) - var(--Sizing-1));\n`;
    css += `  --ListItem-Minimum-List-Item: calc(var(--Minimum-Target) - var(--Sizing-1));\n\n`;


  
    // Recursive function to process nested objects
    const processSection = (section, sectionName = '') => {
        Object.entries(section).forEach(([key, valueObj]) => {
        // Skip label or non-value entries
        if (key === 'SurfaceContainer-Label' || !valueObj || valueObj.value === undefined) return;

        // Skip Buttons-Button-Overlay-Radius
        if (sectionName === 'Buttons' && key === 'Button Overlay Radius') return;

        // Create full property name with cleaned-up section and key
        const prop = cleanVariableName(sectionName ? `${sectionName}-${key.replace(/ /g, '-')}` : key.replace(/ /g, '-'));
        
        if (typeof valueObj.value === 'string' && valueObj.value.startsWith('{') && valueObj.value.endsWith('}')) {
            // Reference value
            const refValue = valueObj.value.substring(1, valueObj.value.length - 1).replace(/\./g, '-');
            css += `  --${prop}: var(--${cleanVariableName(refValue)});\n`;
        } else if (typeof valueObj.value === 'number' || (typeof valueObj.value === 'string' && !isNaN(Number(valueObj.value)))) {
            // Numeric value
            css += `  --${prop}: ${Number(valueObj.value)}px;\n`;
        } else {
            // Direct value
            css += `  --${prop}: ${valueObj.value};\n`;
        }
        });
        css += '\n';
    };

    // List of sections to process
const sectionsToProcess = [
    'Buttons', 
    'Focus', 
    'Cards', 
    'Inputs', 
    'Handles', 
    'Avatars', 
    'Breakpoints', 
    'Modals', 
    'Navigation', 
    'StatusBar'
  ];
  
  // Border section - hardcode the values
  css += `  --Border-Standard: 1px;\n`;
  css += `  --Border-Thick: 2px;\n\n`;
  
  // Process each section
  sectionsToProcess.forEach(sectionName => {
    if (systemDefaults[sectionName]) {
      processSection(systemDefaults[sectionName], sectionName);
    }
  });
    // Close the CSS block
    css += `}\n`;
    
    return css;
  }

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
function processBackgrounds(backgrounds, mode) {
    let css = '';
    
    // Process default background
    if (backgrounds.Default) {
      css += `/* ${mode} mode default background */\n`;
      // Drop the data-mode attribute, just use data-background
      css += `[data-background] {\n`;
      
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
        // Drop the data-mode attribute, just use data-background with specific value
        css += `[data-background="${bgNameLower}"] {\n`;
        
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
            const statusBarLabel = bgContent['StatusBar-Label']?.value || bgName.split('/')[1];
            const colorLower = colorKey.toLowerCase();
            
            css += `/* ${mode} mode ${statusBarLabel} background */\n`;
            // Drop the data-mode attribute, just use data-background with specific values
            css += `[data-background="${statusBarLabel}"],\n`;
            css += `[data-background="${colorLower}"] {\n`;
            
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
    css += `/* Box Shadow Variables */\n:root {\n`;
    
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
    
    // Always start with root selector
    css += `:root {\n`;
    
    // Check if Mode-Target is present
    if (modeTarget && modeTarget.value !== undefined) {
        // Single value scenario
        if (typeof modeTarget.value === 'string') {
            // Check if it's a reference or direct value
            if (modeTarget.value.startsWith('{') && modeTarget.value.endsWith('}')) {
                // Reference case (e.g., "{Desktop-Target}")
                const refValue = modeTarget.value.substring(1, modeTarget.value.length - 1).replace(/\./g, '-');
                css += `  --Mode-Target: var(--${refValue});\n`;
            } else {
                // Direct numeric value case
                css += `  --Mode-Target: ${modeTarget.value}px;\n`;
            }
        } else if (typeof modeTarget.value === 'number') {
            // Direct numeric value
            css += `  --Mode-Target: ${modeTarget.value}px;\n`;
        }
    }
    
    // Add paragraph spacing multiplier based on mode
    if (mode.startsWith('AA')) {
        css += `  --Mode-PS-multiplier: 2em;\n`;
    } else if (mode.startsWith('AAA')) {
        css += `  --Mode-PS-multiplier: 3em;\n`;
    }
    
    css += `}\n\n`;
    
    return css;
}
  
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
    
    // Remove selector entirely, just output the variables
    
    // Add the PS multiplier based on the mode (AA vs AAA)
    if (mode.startsWith('AA')) {
      css += `--Mode-PS-multiplier: 2em;\n`;
    } else if (mode.startsWith('AAA')) {
      css += `--Mode-PS-multiplier: 3em;\n`;
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
          
          css += `--${key}: ${value};\n`;
        }
      }
    }
    
    css += '\n';
    
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
        // Filter out unwanted properties before processing
        if (key.includes('SR-Character-Spacing') || 
            key.includes('AAA-Paragraph-Spacing') || 
            key.includes('Paragraph-Spacing')) {
          console.log(`Skipping platform property: ${key}`);
          continue;
        }
        
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
 * Extract cognitive variables - updated to match the exact desired output format
 * @param {Object} cognitiveContent - The cognitive profile content
 * @param {string} cognitiveType - The cognitive type ('none', 'adhd', 'dyslexia')
 * @returns {Array} - Array of CSS variable declarations
 */
function extractCognitiveVariables(cognitiveContent, cognitiveType = 'none') {
  const variables = [];
  
  // Add Typography Font Families - handle both "Congnitive" and "Cognitive" spellings
  const fontFamiliesKey = cognitiveContent['Congnitive-Font-Families'] || cognitiveContent['Cognitive-Font-Families'];
  if (fontFamiliesKey) {
      if (fontFamiliesKey.Standard && fontFamiliesKey.Standard.value) {
          let value = fontFamiliesKey.Standard.value;
          // Handle different cognitive types differently
          if (cognitiveType === 'none') {
              // For 'none' profile, convert reference to var() format if it's a reference
              if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
                  const varName = value.substring(1, value.length - 1).replace(/\./g, '-');
                  value = `var(--${varName})`;
              }
          } else {
              // For 'adhd' and 'dyslexia' profiles, add quotes around font names
              if (typeof value === 'string' && !value.startsWith('"') && !value.endsWith('"')) {
                  value = `"${value}"`;
              }
          }
          variables.push(`  --Typography-Font-Families-Standard: ${value};\n`);
      }
      if (fontFamiliesKey.Decorative && fontFamiliesKey.Decorative.value) {
          let value = fontFamiliesKey.Decorative.value;
          // Handle different cognitive types differently
          if (cognitiveType === 'none') {
              // For 'none' profile, convert reference to var() format if it's a reference
              if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
                  const varName = value.substring(1, value.length - 1).replace(/\./g, '-');
                  value = `var(--${varName})`;
              }
          } else {
              // For 'adhd' and 'dyslexia' profiles, add quotes around font names
              if (typeof value === 'string' && !value.startsWith('"') && !value.endsWith('"')) {
                  value = `"${value}"`;
              }
          }
          variables.push(`  --Typography-Font-Families-Decorative: ${value};\n`);
      }
  }
  
  // Process Cognitive Default or Cognitive-Default section
  const defaultContent = cognitiveContent['Cognitive-Default'] || cognitiveContent['Default'];
  
  if (defaultContent) {
      // Define sections to process in the correct order
      const sections = [
          'Body', 'Buttons', 'Captions', 'Subtitles', 'Legal', 
          'Labels', 'Overline', 'Display', 'Headers', 'Number'
      ];
      
      sections.forEach(section => {
          if (defaultContent[section]) {
              Object.entries(defaultContent[section]).forEach(([typeName, typeProps]) => {
                  // Skip 2x variants
                  if (typeName.includes('-2x') || typeName.includes('2x')) {
                      console.log(`Skipping 2x variant: ${typeName}`);
                      return;
                  }
                  
                  Object.entries(typeProps).forEach(([propName, propObj]) => {
                      // Skip if value is undefined
                      if (!propObj || propObj.value === undefined) return;
                      
                      // Skip properties with AA, SR, or AAA in the name - more comprehensive check
                      if (propName.includes('AA') || propName.includes('SR') || propName.includes('AAA')) {
                          console.log(`Skipping AA/SR/AAA property: ${propName}`);
                          return;
                      }
                      
                      // Skip paragraph spacing variables
                      if (propName.includes('Paragraph-Spacing')) {
                          console.log(`Skipping paragraph spacing property: ${propName}`);
                          return;
                      }
                      
                      // Handle different value types
                      let value = propObj.value;
                      
                      // Handle reference values - keep some as references, convert others to var()
                      if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
                          // Convert all references to var() format
                          let varName = value.substring(1, value.length - 1).replace(/\./g, '-');
                          
                          // For Congnitive/Cognitive font family references, change to Typography
                          if (varName.includes('Congnitive-Font-Families') || varName.includes('Cognitive-Font-Families')) {
                              const correctedVarName = varName.replace('Congnitive-Font-Families', 'Typography-Font-Families').replace('Cognitive-Font-Families', 'Typography-Font-Families');
                              value = `var(--${correctedVarName})`;
                          }
                          // For Platform-Default references, remove the "Default" part
                          else if (varName.includes('Platform-Default-')) {
                              varName = varName.replace('Platform-Default-', 'Platform-');
                              value = `var(--${varName})`;
                          }
                          // For all other references, convert to var()
                          else {
                              value = `var(--${varName})`;
                          }
                      }
                      
                      // Add px to specific numeric properties
                      if (typeof value === 'number') {
                          // Properties that should have px units
                          const pxProperties = ['Font-Size', 'Line-Height', 'Character-Spacing', 'Paragraph-Spacing'];
                          const shouldAddPx = pxProperties.some(prop => propName.includes(prop));
                          if (shouldAddPx) {
                              value = `${value}px`;
                          }
                      }
                      
                      // Create variable name in the format --Typography-Section-Type-Property
                      // Handle special type name formatting to match your desired output
                      let cleanTypeName = typeName;
                      
                      // Handle specific naming patterns with proper dashes
                      if (typeName.includes('Small-Semibold')) {
                          cleanTypeName = 'Small-Semibold';
                      } else if (typeName.includes('Medium-Semibold')) {
                          cleanTypeName = 'Medium-Semibold';
                      } else if (typeName.includes('Large-Semibold')) {
                          cleanTypeName = 'Large-Semibold';
                      } else if (typeName.includes('Extra-Small')) {
                          cleanTypeName = 'Extra-Small';
                      } else if (typeName.includes('Semibold')) {
                          // Handle any other Semibold variants by adding dash before Semibold
                          cleanTypeName = typeName.replace('Semibold', '-Semibold');
                      } else if (typeName.includes('ExtraSmall')) {
                          cleanTypeName = 'Extra-Small';
                      } else {
                          // Keep original formatting for other cases
                          cleanTypeName = typeName;
                      }
                      
                      const variableName = `--Typography-${section}-${cleanTypeName}-${propName.replace(/\s+/g, '-')}`;
                      
                      variables.push(`  ${variableName}: ${value};\n`);
                  });
              });
          }
      });
      
      // Add Cognitive Multiplier if it exists
      if (defaultContent.Spacing && defaultContent.Spacing['Cognitive-Multiplier']) {
          const multiplierValue = defaultContent.Spacing['Cognitive-Multiplier'].value || 1;
          variables.push(`  --Cognitive-Multiplier: ${multiplierValue};\n`);
      } else {
          // Default multiplier
          variables.push(`  --Cognitive-Multiplier: 1;\n`);
      }
      
      // Add Cognitive Target
      if (defaultContent.Target) {
          let targetValue = defaultContent.Target.value;
          if (typeof targetValue === 'string' && targetValue.startsWith('{') && targetValue.endsWith('}')) {
              let varName = targetValue.substring(1, targetValue.length - 1).replace(/\./g, '-');
              // Remove Platform-Default- and replace with Platform-
              if (varName.includes('Platform-Default-')) {
                  varName = varName.replace('Platform-Default-', 'Platform-');
              }
              targetValue = `var(--${varName})`;
          } else if (typeof targetValue === 'number') {
              // Add px to numeric target values
              targetValue = `${targetValue}px`;
          }
          variables.push(`  --Cognitive-Target: ${targetValue};\n`);
      } else {
          // For 'none' cognitive type, use Mode-Target; others use Platform-Target
          if (cognitiveType === 'none') {
              variables.push(`  --Cognitive-Target: var(--Mode-Target);\n`);
          } else {
              variables.push(`  --Cognitive-Target: var(--Platform-Target);\n`);
          }
      }
  }
  
  // Final cleanup: replace any remaining Platform-Default- with Platform- in all variables
  const cleanedVariables = variables.map(variable => {
      return variable.replace(/--Platform-Default-/g, '--Platform-');
  });
  
  return cleanedVariables;
}

/**
* Process cognitive profiles and generate CSS files - Updated selector handling
* Updated to use :root for all profiles
*/
async function processCognitiveProfiles(jsonContent, outputDir) {
  const results = [];
  
  // Process cognitive variables for different profiles
  const cognitiveProfiles = [
      { key: 'Cognitive/None', name: 'none' },
      { key: 'Cognitive/ADHD', name: 'adhd' }, 
      { key: 'Cognitive/Dyslexia', name: 'dyslexia' }
  ];

  for (const profile of cognitiveProfiles) {
      if (jsonContent[profile.key]) {
          console.log(`Processing cognitive profile: ${profile.name}`);
          
          // Generate CSS with proper selector
          const variables = extractCognitiveVariables(jsonContent[profile.key], profile.name);
          
          let css = `/**
* Cognitive Variables - ${profile.name.charAt(0).toUpperCase() + profile.name.slice(1)} Profile
* Generated by JsonToCss
*/
`;
          
          // Use :root for all profiles (not data attributes)
          css += `:root {\n`;
          
          // Add all variables
          variables.forEach(variable => {
              css += variable;
          });
          
          css += `}\n`;
          
          // Save to file
          const cognitiveFilename = `cognitive-${profile.name}.css`;
          const cognitiveFilePath = path.join(outputDir, cognitiveFilename);
          
          await fs.promises.writeFile(cognitiveFilePath, css, 'utf8');
          results.push({
              profile: profile.name,
              file: cognitiveFilename,
              path: cognitiveFilePath
          });
          
          console.log(`Generated ${cognitiveFilename} with ${variables.length} variables`);
      }
  }
  
  return results;
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
          css += `[data-surface-container] {\n`;
        } else {
          css += `[data-surface-container="${labelValue.toLowerCase()}"] {\n`;
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

  function processSizingSpacing(jsonContent) {
    let css = '';
    
    // Start the CSS block
    css += ':root {\n';
    
    // Extract multiplier values from each mode
    const multipliers = {
      Default: 1,
      Standard: 1,
      Expanded: 1.5,
      Reduced: 0.5
    };
    
    // Override multipliers from the JSON if available
    Object.keys(jsonContent).forEach(key => {
      if (key.startsWith('Sizing & Spacing/')) {
        const mode = key.split('/')[1];
        if (jsonContent[key].Multiplier && jsonContent[key].Multiplier.value !== undefined) {
          multipliers[mode] = jsonContent[key].Multiplier.value;
        }
      }
    });
    
    // Add multiplier variables with clean formatting
    css += '  --Default-Spacing-Multiplier: ' + multipliers.Default + ';\n';
    css += '  --Standard-Spacing-Multiplier: ' + multipliers.Standard + ';\n';
    css += '  --Expanded-Spacing-Multiplier: ' + multipliers.Expanded + ';\n';
    css += '  --Reduced-Spacing-Multiplier: ' + multipliers.Reduced + ';\n';
    
    // Use the variable directly without min()
    css += '  --Spacing-multiplier: var(--Default-Spacing-Multiplier);\n';
    
    // Get the default sizing values from the Default mode
    const defaultSection = jsonContent['Sizing & Spacing/Default'];
    if (defaultSection && defaultSection.Default) {
      const defaultValues = defaultSection.Default;
      
      // Process sizing and spacing properties
      const processProp = (prop) => {
        if (defaultValues[prop] && defaultValues[prop].value !== undefined) {
          // Direct numeric value or reference
          let value = defaultValues[prop].value;
          
          // Convert reference format
          if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            value = `var(--${value.substring(1, value.length - 1).replace(/\./g, '-')})`;
          } else if (typeof value === 'number') {
            value = `${value}px`;
          }
          
          // For spacing, use multiplier calculation
          if (prop.startsWith('Spacing-')) {
            css += `  --${prop}: calc(${value} * var(--Spacing-multiplier));\n`;
          } else {
            css += `  --${prop}: ${value};\n`;
          }
        }
      };
      
      // Process various property types
      const propTypes = [
        'Sizing-',
        'Negative-',
        'Spacing-'
      ];
      
      propTypes.forEach(type => {
        Object.keys(defaultValues)
          .filter(prop => prop.startsWith(type))
          .forEach(processProp);
      });
    }
    
    // Close the root block
    css += '}\n\n';
    
    // Add data-spacing selectors for different modes
    css += '/* Spacing mode overrides */\n';
    css += '[data-spacing] {\n';
    css += '  --Spacing-multiplier: min(var(--Cognitive-Multiplier), var(--Default-Spacing-Multiplier));\n';
    css += '}\n\n';
    
    css += '[data-spacing="expanded"] {\n';
    css += '  --Spacing-multiplier: min(var(--Cognitive-Multiplier), var(--Expanded-Spacing-Multiplier));\n';
    css += '}\n\n';
    
    css += '[data-spacing="reduced"] {\n';
    css += '  --Spacing-multiplier: min(var(--Cognitive-Multiplier), var(--Reduced-Spacing-Multiplier));\n';
    css += '}\n\n';
    
    css += '[data-spacing="standard"] {\n';
    css += '  --Spacing-multiplier: min(var(--Cognitive-Multiplier), var(--Standard-Spacing-Multiplier));\n';
    css += '}\n\n';
    
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
  
    // Get system tokens first from System-Styles/Default
    let systemTokensContent = '';
    if (jsonContent['System-Styles/Default']) {
        systemTokensContent = extractBaseSystemTokens(jsonContent);
    }
  
    // Create base CSS with system tokens properly inside :root
    const baseCSS = `/**
    * Base CSS variables - Common properties across all themes
    * Generated by JsonToCss
    */
    :root {
    /* Other global variables */
    --global-transition-duration: 0.2s;
    ${systemTokensContent}}`;

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
  
    // Process system tokens from System/Default

    if (jsonContent['System/Default']) {
        try {
        console.log('Generating system CSS...');
        const systemCSS = convertSystemToCss(jsonContent);
        console.log('System CSS generated successfully');
        
        const systemFilename = 'system.css';
        const systemFilePath = path.join(outputDir, systemFilename);
        
        await fs.promises.writeFile(systemFilePath, systemCSS, 'utf8');
        console.log(`Successfully wrote ${systemFilename}`);
        
        results.system = {
            file: systemFilename,
            path: systemFilePath
        };
        } catch (err) {
        console.error(`Error generating system CSS:`, err);
        }
    } else {
        console.warn('No System/Default section found in JSON');
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
        
        // Start each mode CSS file with the root selector and common variables
        let css = `/* ${mode} mode CSS */\n`;
        css += `:root {\n`;
        
        // Add Mode-Target based on AA or AAA
        if (mode.toLowerCase().startsWith('aa-') && !mode.toLowerCase().startsWith('aaa-')) {
            // AA modes get Desktop-Target reference
            css += `  --Mode-Target: var(--Desktop-Target);\n`;
        } else if (mode.toLowerCase().startsWith('aaa-')) {
            // AAA modes get 48px
            css += `  --Mode-Target: 48px;\n`;
        }
        
        // Process mode targets if they exist in the JSON (this will override the above if present)
        if (modeContent['Mode-Target']) {
            css += `  /* ${mode} mode targets from JSON */\n`;
            
            // Check if Mode-Target is a single value
            if (modeContent['Mode-Target'].value !== undefined) {
                let value = modeContent['Mode-Target'].value;
                
                // Handle reference values
                if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
                    // Convert reference to var()
                    value = `var(--${value.substring(1, value.length - 1).replace(/\./g, '-')})`;
                } else if (typeof value === 'number') {
                    // Convert numeric values to pixels
                    value = `${value}px`;
                }
                
                // Override the Mode-Target with JSON value
                css += `  --Mode-Target: ${value};\n`;
            }
        }
        
        // Add paragraph spacing multiplier if needed
        if (mode.startsWith('AA')) {
            css += `  --Mode-PS-multiplier: 2em;\n`;
        } else if (mode.startsWith('AAA')) {
            css += `  --Mode-PS-multiplier: 3em;\n`;
        }
        
        // Process paragraph spacing variables if present
        if (modeContent['Mode-Paragraph-Spacing'] && modeContent['Mode-Paragraph-Spacing'].Default) {
            // List of variables to exclude
            const excludedVariables = [
                'Body-Medium',
                'Body-Small',
                'Body-Large',
                'Legal',
                'Caption'
            ];
            
            for (const [key, valueObj] of Object.entries(modeContent['Mode-Paragraph-Spacing'].Default)) {
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
        
        // Close the root selector
        css += `}\n\n`;
        
        // Process backgrounds with separate selectors per background type
        if (modeContent.Backgrounds) {
            // Process default background (no specific background attribute)
            if (modeContent.Backgrounds.Default) {
                css += `/* ${mode} mode specific backgrounds */\n`;
                // Drop the data-mode attribute, just use data-background
                css += `[data-background] {\n`;
      
                const variables = extractModeVariables(modeContent.Backgrounds.Default);
                variables.forEach(variable => {
                    css += variable;
                });
      
                css += '}\n\n';
            }
    
            // Process other named backgrounds
            for (const [bgName, bgContent] of Object.entries(modeContent.Backgrounds)) {
                if (bgName !== 'Default' && !bgName.startsWith('StatusBar/')) {
                    const bgNameLower = bgName.toLowerCase();
        
                    css += `/* ${mode} mode specific backgrounds */\n`;
                    // Drop the data-mode attribute, just use data-background with value
                    css += `[data-background="${bgNameLower}"] {\n`;
        
                    const variables = extractModeVariables(bgContent);
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
                            const statusBarLabel = bgContent['StatusBar-Label']?.value || bgName.split('/')[1];
                            const colorLower = colorKey.toLowerCase();
                            
                            css += `/* ${mode} mode ${statusBarLabel} background */\n`;
                            // Drop the data-mode attribute
                            css += `[data-background="${statusBarLabel}"],\n`;
                            css += `[data-background="${colorLower}"] {\n`;
                            
                            // Add specific styles for these backgrounds if needed
                            css += `  /* ${statusBarLabel} ${colorKey} background styles */\n`;
                            
                            css += '}\n\n';
                        }
                    }
                }
            }
        }
  
        // Process charts
        if (modeContent.Charts) {
            for (const [chartType, chartContent] of Object.entries(modeContent.Charts)) {
                css += `/* ${mode} mode ${chartType} chart */\n`;
      
                // Drop the data-mode attribute, just use charts attribute
                css += `[charts="${chartType}"] {\n`;
      
                // Extract chart color variables
                const chartVars = extractChartVariables(chartContent);
                chartVars.forEach(variable => {
                    css += variable;
                });
      
                css += `}\n\n`;
            }
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
        // Use :root selector instead of data-platform
        css += `:root {\n`;
        
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
  
    // Use the new cognitive processing function
    results.cognitive = await processCognitiveProfiles(jsonContent, outputDir);
    


  
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
  extractBaseSystemTokens,  // Add this  
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
  processCognitiveProfiles,
  convertJsonFileToCssFiles,
  processShadowLevels
};