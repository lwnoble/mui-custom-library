/**
 * Specialized JSON to CSS transformer for design tokens
 * This converts the given JSON format to CSS custom properties (variables)
 * with data-attribute selectors
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * Main function to convert JSON to CSS
 * @param {Object} jsonContent - The parsed JSON content
 * @returns {string} - The generated CSS
 */
function convertToCss(jsonContent) {
    let css = '';
    
    // Process each mode
    for (const [modeName, modeContent] of Object.entries(jsonContent)) {
      if (modeName.startsWith('Modes/')) {
        // Get the mode name (e.g., AA-light from Modes/AA-light)
        const mode = modeName.split('/')[1];
        
        // Process backgrounds
        if (modeContent.Backgrounds) {
          for (const [bgName, bgContent] of Object.entries(modeContent.Backgrounds)) {
            const bgNameLower = bgName.toLowerCase();
            
            // Create the root background variables
            const rootVars = extractRootVariables(bgContent);
            if (rootVars.length > 0) {
              css += `/* ${mode} mode specific backgrounds */\n`;
              css += `[data-mode] [data-background="${bgNameLower}"] {\n`;
              rootVars.forEach(variable => {
                css += variable;
              });
              css += '}\n\n';
            }
            
            // Create the surface component variables
            const surfaceVars = extractSurfaceVariables(bgContent);
            if (surfaceVars.length > 0) {
              css += `[data-mode] [data-background="${bgNameLower}"] [data-compnent="surface"] {\n`;
              surfaceVars.forEach(variable => {
                css += variable;
              });
              css += '}\n\n';
            }
            
            // Create the container component variables
            const containerVars = extractContainerVariables(bgContent);
            if (containerVars.length > 0) {
              css += `[data-mode] [data-background="${bgNameLower}"] [data-compnent="container"] {\n`;
              containerVars.forEach(variable => {
                css += variable;
              });
              css += '}\n\n';
            }
          }
        }
        
        // Process charts
        if (modeContent.Charts) {
          // First, create the default charts section
          css += `/* ${mode} mode default chart colors */\n`;
          css += `[data-mode] [charts] {\n`;
          
          // Add default variables that should be available to all charts
          css += `  --Chart-Background: #ffffff;\n`;
          css += `  --Chart-Axis-Color: rgba(0,0,0,0.75);\n`;
          css += `  --Chart-Grid-Color: rgba(0,0,0,0.15);\n`;
          css += `}\n\n`;
          
          // Then process each chart type
          for (const [chartType, chartContent] of Object.entries(modeContent.Charts)) {
            css += `/* ${mode} mode ${chartType} chart */\n`;
            css += `[data-mode] [charts="${chartType}"] {\n`;
            
            // Extract chart color variables
            const chartVars = extractChartVariables(chartContent);
            chartVars.forEach(variable => {
              css += variable;
            });
            
            css += `}\n\n`;
          }
        }
      } else if (modeName.startsWith('Platform/')) {
        // Get the platform name (e.g., Desktop from Platform/Desktop)
        const platform = modeName.split('/')[1];
        
        // Process platform typography
        css += `/* ${platform} platform specific typography */\n`;
        css += `[Platform="${platform}"] {\n`;
        
        // Extract platform variables
        const platformVars = extractPlatformVariables(modeContent, platform);
        platformVars.forEach(variable => {
          css += variable;
        });
        
        css += '}\n\n';
      } else if (modeName.startsWith('Cognitive/')) {
        // Get the cognitive name (e.g., None from Cognitive/None)
        const cognitive = modeName.split('/')[1];
        
        // Process cognitive typography
        css += `/* ${cognitive} cognitive specific typography */\n`;
        css += `[Cognitive="${cognitive}"] {\n`;
        
        // Extract cognitive variables
        const cognitiveVars = extractCognitiveVariables(modeContent, cognitive);
        cognitiveVars.forEach(variable => {
          css += variable;
        });
        
        css += '}\n\n';
      } else if (modeName.startsWith('Sizing & Spacing/')) {
        // Process sizing and spacing in separate function
        // The output from processSizingSpacing is already complete CSS sections
        // so we don't need to add anything here
      }
    }
    
    // Add sizing and spacing section
    css += processSizingSpacing(jsonContent);
    
    return css;
  }

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
    if (value.includes('.Standard')) {
      return "var(--System-Font-Families-Standard)";
    } else if (value.includes('.Decorative')) {
      return "var(--System-Font-Families-Decorative)";
    } else {
      // Generic fallback for other references
      const refName = value.substring(1, value.length - 1);
      const parts = refName.split('.');
      return `var(--System-${parts.join('-')})`;
    }
  }
  
  // If not a reference, return as is
  return value;
}

/**
 * Main function to convert a JSON file to CSS
 * @param {string} inputPath - Path to the input JSON file
 * @param {string} outputPath - Path for the output CSS file
 */
async function convertJsonFileToCss(inputPath, outputPath) {
  try {
    // Read the JSON file
    const data = await fs.promises.readFile(inputPath, 'utf8');
    const jsonContent = JSON.parse(data);
    
    // Transform to CSS
    const css = convertToCss(jsonContent);
    
    // Write the CSS file
    await fs.promises.writeFile(outputPath, css, 'utf8');
    
    console.log(`Successfully generated CSS at ${outputPath}`);
  } catch (error) {
    console.error('Error converting JSON to CSS:', error);
    process.exit(1);
  }
}

/**
 * Extract the root variables from the background content
 * @param {Object} bgContent - The background content object
 * @returns {Array} - Array of CSS variable declarations
 */
function extractRootVariables(bgContent) {
  const variables = [];
  
  // Add Dropdown colors
  for (let i = 1; i <= 5; i++) {
    const key = `Dropdown-Color-${i}`;
    if (bgContent[key] && bgContent[key].value) {
      variables.push(`  --${key}: ${bgContent[key].value};\n`);
    }
  }
  
  // Add Surface variables
  const surfaceKeys = ['Surface', 'Surface-Dim', 'Surface-Bright', 'Surface-Quiet', 
                      'Surface-Dim-Quiet', 'Surface-Bright-Quiet'];
  surfaceKeys.forEach(key => {
    if (bgContent[key] && bgContent[key].value) {
      variables.push(`  --${key}: ${bgContent[key].value};\n`);
    }
  });
  
  // Add Container variables
  const containerKeys = ['Container', 'Container-Low', 'Container-Lowest', 'Container-High', 
                        'Container-Highest', 'Container-Quiet', 'Container-Low-Quiet', 
                        'Container-Lowest-Quiet', 'Container-High-Quiet', 'Container-Highest-Quiet'];
  containerKeys.forEach(key => {
    if (bgContent[key] && bgContent[key].value) {
      // Special case for Container-Quiet to match your desired output
      if (key === 'Container-Quiet') {
        variables.push(`  --Container-On-Quiet: ${bgContent[key].value};\n`);
      } else {
        variables.push(`  --${key}: ${bgContent[key].value};\n`);
      }
    }
  });
  
  return variables;
}

/**
 * Extract the surface-specific variables
 * @param {Object} bgContent - The background content object
 * @returns {Array} - Array of CSS variable declarations
 */
function extractSurfaceVariables(bgContent) {
  const variables = [];
  
  // Map JSON keys to CSS variable names
  const mappings = {
    'Surface-Icon-Primary': 'Icon-Primary',
    'Surface-Icon-Secondary': 'Icon-Secondary',
    'Surface-Icon-Tertiary': 'Icon-Tertiary',
    'Surface-Icon-Success': 'Icon-Success',
    'Surface-Icon-Error': 'Icon-Error',
    'Surface-Icon-Warning': 'Icon-Warning',
    'Surface-Icon-Info': 'Icon-Info',
    'Surface-Border': 'Surface-Border',
    'On-Surface': 'On-Color',
    'Surface-Button': 'Button',
    'Surface-On-Button': 'On-Button',
    'Surface-Button-Half': 'Button-Half',
    'Surface-Hotlink': 'Hotlink',
    'Surface-Icon-BG': 'Icon-BG',
    'Surface-Message-Padding': 'Message-Padding'
  };
  
  // Add mapped variables
  Object.entries(mappings).forEach(([jsonKey, cssVar]) => {
    if (bgContent[jsonKey] && bgContent[jsonKey].value !== undefined) {
      // Special case for message padding
      if (jsonKey === 'Surface-Message-Padding') {
        variables.push(`  --${cssVar}: ${bgContent[jsonKey].value || 0};\n`);
      } else if (jsonKey === 'Surface-Button-Half' || jsonKey === 'Surface-Icon-BG') {
        // Don't add backticks for these values
        variables.push(`  --${cssVar}: ${bgContent[jsonKey].value};\n`);
      } else {
        variables.push(`  --${cssVar}: ${bgContent[jsonKey].value};\n`);
      }
    }
  });
  
  // Handle boolean underline values
  if (bgContent['Surface-Hotlink-Default-Underline'] && 
      bgContent['Surface-Hotlink-Default-Underline'].value !== undefined) {
    const value = bgContent['Surface-Hotlink-Default-Underline'].value.toString() === 'true' ? 'underline' : 'none';
    variables.push(`  --Hotlink-Default-Underline: ${value};\n`);
  }
  
  if (bgContent['Surface-Hotlink-Hover-Underline'] && 
      bgContent['Surface-Hotlink-Hover-Underline'].value !== undefined) {
    const value = bgContent['Surface-Hotlink-Hover-Underline'].value.toString() === 'true' ? 'underline' : 'none';
    variables.push(`  --Hotlink-Hover-Underline: ${value};\n`);
  }
  
  return variables;
}

/**
 * Extract the container-specific variables
 * @param {Object} bgContent - The background content object
 * @returns {Array} - Array of CSS variable declarations
 */
function extractContainerVariables(bgContent) {
  const variables = [];
  
  // Map JSON keys to CSS variable names
  const mappings = {
    'Container-Icon-Primary': 'Icon-Primary',
    'Container-Icon-Secondary': 'Icon-Secondary',
    'Container-Icon-Tertiary': 'Icon-Tertiary',
    'Container-Icon-Success': 'Icon-Success',
    'Container-Icon-Error': 'Icon-Error',
    'Container-Icon-Warning': 'Icon-Warning',
    'Container-Icon-Info': 'Icon-Info',
    'Container-Border': 'Border',
    'On-Container': 'On-Color',
    'Container-Button': 'Button',
    'Container-On-Button': 'On-Button',
    'Container-Button-Half': 'Button-Half',
    'Container-Button-Quiet': 'Button-Quiet',
    'Container-Hotlink': 'Hotlink',
    'Container-Icon-BG': 'Icon-BG',
    'Container-Message-Padding': 'Message-Padding'
  };
  
  // Add mapped variables
  Object.entries(mappings).forEach(([jsonKey, cssVar]) => {
    if (bgContent[jsonKey] && bgContent[jsonKey].value !== undefined) {
      // Special case for message padding
      if (jsonKey === 'Container-Message-Padding') {
        variables.push(`  --${cssVar}: ${bgContent[jsonKey].value || 0};\n`);
      } else if (jsonKey === 'Container-Button-Half' || jsonKey === 'Container-Icon-BG') {
        // Don't add backticks for these values
        variables.push(`  --${cssVar}: ${bgContent[jsonKey].value};\n`);
      } else {
        variables.push(`  --${cssVar}: ${bgContent[jsonKey].value};\n`);
      }
    }
  });
  
  // Handle boolean underline values
  if (bgContent['Container-Hotlink-Default-Underline'] && 
      bgContent['Container-Hotlink-Default-Underline'].value !== undefined) {
    const value = bgContent['Container-Hotlink-Default-Underline'].value.toString() === 'true' ? 'underline' : 'none';
    variables.push(`  --Hotlink-Default-Underline: ${value};\n`);
  }
  
  if (bgContent['Container-Hotlink-Hover-Underline'] && 
      bgContent['Container-Hotlink-Hover-Underline'].value !== undefined) {
    const value = bgContent['Container-Hotlink-Hover-Underline'].value.toString() === 'true' ? 'underline' : 'none';
    variables.push(`  --Hotlink-Hover-Underline: ${value};\n`);
  }
  
  return variables;
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
 * Extract platform typography variables
 * @param {Object} platformContent - The platform content object
 * @param {String} platformName - The platform name
 * @returns {Array} - Array of CSS variable declarations
 */
function extractPlatformVariables(platformContent, platformName) {
  const variables = [];
  
  // Process Font-Families
  if (platformContent['Font-Families']) {
    Object.entries(platformContent['Font-Families']).forEach(([fontFamilyName, fontFamily]) => {
      // Replace references to system variables
      let value = fontFamily.value;
      value = convertFontFamilyReference(value);
      
      variables.push(`  --Platform-Font-Families-${fontFamilyName}: ${value};\n`);
    });
  }
  
  // Process Default section (contains typography)
  if (platformContent['Default']) {
    // Process Body typography
    if (platformContent['Default']['Body']) {
      Object.entries(platformContent['Default']['Body']).forEach(([typeName, typeProps]) => {
        // For each typography style (e.g., "Small", "Medium", etc.)
        Object.entries(typeProps).forEach(([propName, propObj]) => {
          let value = propObj.value;
          
          // Skip if value is undefined
          if (value === undefined) {
            // For Character-Spacing and Paragraph-Spacing that might be missing, 
            // add a default value of 0
            if (propName === 'Character-Spacing' || propName === 'Paragraph-Spacing') {
              value = 0;
            } else {
              return;
            }
          }
          
          // Format the value based on property type
          if (propName === 'Font-Family') {
            value = convertFontFamilyReference(value);
          } else if (propName.includes('Font-Size') || 
                     propName.includes('Line-Height') || 
                     propName.includes('Paragraph-Spacing')) {
            // Add 'px' suffix to numeric values that should have units
            value = `${value}px`;
          }
          
          variables.push(`  --Platform-Body-${typeName}-${propName}: ${value};\n`);
        });
      });
    }
    
    // Process Display typography
    if (platformContent['Default']['Display']) {
      Object.entries(platformContent['Default']['Display']).forEach(([typeName, typeProps]) => {
        // For each typography style (e.g., "Small", "Large", etc.)
        Object.entries(typeProps).forEach(([propName, propObj]) => {
          let value = propObj.value;
          
          // Skip if value is undefined
          if (value === undefined) {
            // For Character-Spacing and Paragraph-Spacing that might be missing, 
            // add a default value of 0
            if (propName === 'Character-Spacing' || propName === 'Paragraph-Spacing') {
              value = 0;
            } else {
              return;
            }
          }
          
          // Format the value based on property type
          if (propName === 'Font-Family') {
            value = convertFontFamilyReference(value);
          } else if (propName.includes('Font-Size') || 
                     propName.includes('Line-Height') || 
                     propName.includes('Paragraph-Spacing')) {
            // Add 'px' suffix to numeric values that should have units
            value = `${value}px`;
          }
          
          variables.push(`  --Platform-Display-${typeName}-${propName}: ${value};\n`);
        });
      });
    }
    
    // Process Headers typography
    if (platformContent['Default']['Headers']) {
      Object.entries(platformContent['Default']['Headers']).forEach(([typeName, typeProps]) => {
        // For each header (e.g., "H1", "H2", etc.)
        Object.entries(typeProps).forEach(([propName, propObj]) => {
          let value = propObj.value;
          
          // Skip if value is undefined
          if (value === undefined) {
            // For Character-Spacing and Paragraph-Spacing that might be missing, 
            // add a default value of 0
            if (propName === 'Character-Spacing' || propName === 'Paragraph-Spacing') {
              value = 0;
            } else {
              return;
            }
          }
          
          // Format the value based on property type
          if (propName === 'Font-Family') {
            value = convertFontFamilyReference(value);
          } else if (propName.includes('Font-Size') || 
                     propName.includes('Line-Height') || 
                     propName.includes('Paragraph-Spacing')) {
            // Add 'px' suffix to numeric values that should have units
            value = `${value}px`;
          }
          
          variables.push(`  --Platform-Headers-${typeName}-${propName}: ${value};\n`);
        });
      });
    }
    
    // Process other typography sections that might be in the platform data
    const additionalSections = [
      'Buttons', 'Captions', 'Subtitles', 'Legal', 
      'Labels', 'Overline', 'Number'
    ];
    
    additionalSections.forEach(section => {
      if (platformContent['Default'][section]) {
        Object.entries(platformContent['Default'][section]).forEach(([styleName, styleProps]) => {
          // Skip non-object properties
          if (typeof styleProps !== 'object' || styleProps === null) return;
          
          Object.entries(styleProps).forEach(([propName, propObj]) => {
            // Skip if it's not a property object
            if (typeof propObj !== 'object' || propObj === null) return;
            
            let value = propObj.value;
            
            // Skip if value is undefined
            if (value === undefined) {
              // For Character-Spacing and Paragraph-Spacing that might be missing, 
              // add a default value of 0
              if (propName === 'Character-Spacing' || propName === 'Paragraph-Spacing') {
                value = 0;
              } else {
                return;
              }
            }
            
            // Format the value based on property type
            if (propName === 'Font-Family') {
              value = convertFontFamilyReference(value);
            } else if (propName.includes('Font-Size') || 
                      propName.includes('Line-Height') || 
                      propName.includes('Paragraph-Spacing')) {
              // Add 'px' suffix to numeric values that should have units
              value = `${value}px`;
            }
            
            variables.push(`  --Platform-${section}-${styleName}-${propName}: ${value};\n`);
          });
        });
      }
    });
    
    // Handle any direct properties
    if (platformContent['Default']['Target']) {
      variables.push(`  --Platform-Target: ${platformContent['Default']['Target'].value};\n`);
    }
  }
  
  // Handle platform-specific boolean flags
  if (platformContent['Android']) {
    variables.push(`  --Platform-Android: ${platformContent['Android'].value};\n`);
  }
  
  if (platformContent['IOS']) {
    variables.push(`  --Platform-IOS: ${platformContent['IOS'].value};\n`);
  }
  
  return variables;
}

/**
 * Process sizing and spacing sections from JSON and convert to CSS
 * @param {Object} jsonContent - The parsed JSON content
 * @returns {string} - The generated CSS
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
          css += `/* Default sizing and spacing */\n[SizingSpacing] {\n`;
        } else {
          css += `/* ${mode} sizing and spacing */\n[SizingSpacing="${mode}"] {\n`;
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
 * Extract cognitive typography variables
 * @param {Object} cognitiveContent - The cognitive content object
 * @param {String} cognitiveName - The cognitive name
 * @returns {Array} - Array of CSS variable declarations
 */
function extractCognitiveVariables(cognitiveContent, cognitiveName) {
    const variables = [];
    
    // Process Font-Families
    if (cognitiveContent['Font-Families']) {
      Object.entries(cognitiveContent['Font-Families']).forEach(([fontFamilyName, fontFamily]) => {
        // Replace references to system variables
        let value = fontFamily.value;
        
        // Check if value is a string before doing string operations
        if (typeof value === 'string') {
          if (value.startsWith('{') && value.endsWith('}')) {
            // Handle special references to platform variables
            if (value.includes('Default.Font-Family')) {
              const familyType = value.includes('.Standard') ? 'Standard' : 'Decorative';
              value = `var(--Platform-Font-Families-${familyType})`;
            } else {
              value = convertFontFamilyReference(value);
            }
          }
        }
        
        variables.push(`  --Cognitive-Font-Families-${fontFamilyName}: ${value};\n`);
      });
    }
    
    // Process Default section (contains typography)
    if (cognitiveContent['Default']) {
      // Process all typography sections
      const typographySections = [
        'Body', 'Buttons', 'Captions', 'Subtitles', 'Legal', 
        'Labels', 'Overline', 'Display', 'Headers', 'Number'
      ];
      
      typographySections.forEach(section => {
        if (cognitiveContent['Default'][section]) {
          // Process each style in the section (e.g., Small, Medium, Large)
          Object.entries(cognitiveContent['Default'][section]).forEach(([styleName, styleProps]) => {
            // Skip non-object properties
            if (typeof styleProps !== 'object' || styleProps === null) return;
            
            // For each typography style property
            Object.entries(styleProps).forEach(([propName, propObj]) => {
              // Skip if it's not a property object
              if (typeof propObj !== 'object' || propObj === null) return;
              
              let value = propObj.value;
              
              // Skip if value is undefined
              if (value === undefined) {
                // For Character-Spacing and Paragraph-Spacing that might be missing, 
                // add a default value of 0
                if (propName === 'Character-Spacing' || propName.includes('Character-Spacing') || 
                    propName === 'Paragraph-Spacing' || propName.includes('Paragraph-Spacing')) {
                  value = 0;
                } else {
                  return;
                }
              }
              
              // Format the value based on the reference type
              if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
                // Handle references to Default values (platform variables)
                
                // Special case for direct font family references
                if (value === '{Font-Families.Standard}' || value === '{Font-Families.Decorative}') {
                  const familyType = value.includes('.Standard') ? 'Standard' : 'Decorative';
                  value = `var(--System-Font-Families-${familyType})`;
                }
                // References to platform variables
                else if (value.startsWith('{Default.')) {
                  // Extract the referenced section, style and property
                  const refPath = value.substring(1, value.length - 1);
                  const parts = refPath.split('.');
                  
                  if (parts.length >= 3) {
                    // Create the platform variable reference
                    // e.g., {Default.Body.Small.Font-Size} becomes var(--Platform-Body-Small-Font-Size)
                    const platformVar = `var(--Platform-${parts[1]}-${parts[2]}-${parts[3]})`;
                    value = platformVar;
                  }
                }
              } 
              // Add 'px' suffix to numeric Font-Size, Line-Height, and Paragraph-Spacing values
              else if (
                (typeof value === 'number' || 
                 (!isNaN(parseFloat(value)) && typeof value !== 'object' && !String(value).includes('var(')))
              ) {
                // Check the full property path to determine if px should be added
                const fullPath = `${section}.${styleName}.${propName}`;
                
                if (
                  propName === 'Font-Size' || propName.includes('Font-Size') ||
                  propName === 'Line-Height' || propName.includes('Line-Height') ||
                  propName === 'Paragraph-Spacing' || propName.includes('Paragraph-Spacing') ||
                  fullPath.includes('Font-Size') || fullPath.includes('Line-Height') || fullPath.includes('Paragraph-Spacing')
                ) {
                  value = `${value}px`;
                }
              }
              
              variables.push(`  --Cognitive-${section}-${styleName}-${propName}: ${value};\n`);
            });
          });
        }
      });
      
      // Handle any direct properties in Default
      if (cognitiveContent['Default']['Target']) {
        variables.push(`  --Cognitive-Target: var(--Platform-Target);\n`);
      }
    }
    
    // Process specific Cognitive type if provided
    if (cognitiveName && cognitiveName !== 'None' && cognitiveContent[cognitiveName]) {
      const specificCognitive = cognitiveContent[cognitiveName];
      
      // Process the specific cognitive type using a recursive approach
      processRecursive(specificCognitive, ['Cognitive', cognitiveName], variables);
    }
    
    // Handle Cognitive-Label if present
    if (cognitiveContent['Cognitive-Label']) {
      variables.push(`  --Cognitive-Label: ${cognitiveContent['Cognitive-Label'].value};\n`);
    }
    
    return variables;
  }
  
  /**
   * Process an object recursively to generate CSS variables
   * @param {Object} obj - The object to process
   * @param {Array} path - The current path in the object (used to build variable names)
   * @param {Array} result - Array to store the generated CSS variables
   */
  function processRecursive(obj, path = [], result = []) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key];
      
      if (typeof value === 'object' && value !== null) {
        if (value.hasOwnProperty('value')) {
          // This is a leaf node with a value property
          let finalValue = value.value;
          const fullPathStr = currentPath.join('.');
          
          // Check if this is a property that should have px
          if ((fullPathStr.includes('Font-Size') || 
               fullPathStr.includes('Line-Height') || 
               fullPathStr.includes('Paragraph-Spacing')) && 
              (typeof finalValue === 'number' || 
               (!isNaN(parseFloat(finalValue)) && 
                typeof finalValue !== 'object' && 
                !String(finalValue).includes('var(')))) {
            
            finalValue = `${finalValue}px`;
          }
          
          // Handle string reference values
          if (typeof finalValue === 'string' && finalValue.startsWith('{') && finalValue.endsWith('}')) {
            // Special case for direct font family references
            if (finalValue === '{Font-Families.Standard}' || finalValue === '{Font-Families.Decorative}') {
              const familyType = finalValue.includes('.Standard') ? 'Standard' : 'Decorative';
              finalValue = `var(--System-Font-Families-${familyType})`;
            }
            // References to platform variables
            else if (finalValue.startsWith('{Default.')) {
              // Extract the referenced section, style and property
              const refPath = finalValue.substring(1, finalValue.length - 1);
              const parts = refPath.split('.');
              
              if (parts.length >= 3) {
                // Create the platform variable reference
                const platformVar = `var(--Platform-${parts[1]}-${parts[2]}-${parts[3]})`;
                finalValue = platformVar;
              }
            }
          }
          
          // Create CSS variable name
          const cssVarName = currentPath.join('-');
          result.push(`  --${cssVarName}: ${finalValue};\n`);
        } else {
          // This is an internal node, continue recursion
          processRecursive(value, currentPath, result);
        }
      }
    }
    
    return result;
  }

// Handle command line arguments
// In ES modules, there is no require.main === module equivalent
// We can check if this file is being run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.length < 4) {
    console.error('Usage: node themeJsonToCss.js <inputJsonPath> <outputCssPath>');
    process.exit(1);
  }
  
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  
  convertJsonFileToCss(inputPath, outputPath);
}

// Export the functions
export { convertToCss, convertJsonFileToCss };