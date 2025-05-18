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
function convertSystemToCss(jsonContent) {
  const systemDefaults = jsonContent['System/Default'];
  
  // Start building CSS
  let css = `:root, ::after, ::before {\n`;
  
  // Minimum Target calculation
  css += ` /* System Variables */\n`;
  css += ` --Min-Target: min(min(var(--Desktop-Target), var(--PlatformTarget)), var(--Cognitive-Target));\n`;
  
  // Buttons
  if (systemDefaults && systemDefaults.Buttons) {
    const buttons = systemDefaults.Buttons;
    const buttonProps = [
      ['Button-Height', buttons['Button-Height']],
      ['Button-Minimum-Width', buttons['Button-Minimum-Width']],
      ['Button-Border-Radius', buttons['Button-Border-Radius']],
      ['Button-Focus-Radius', buttons['Button-Focus-Radius']],
      ['Button-Horizontal-Padding', buttons['Button-Horizontal-Padding']],
      ['Button-Horizontal-Padding-With-Icon', buttons['Button-Horizontal-Padding-With-Icon']],
      ['Button-Small-Height', buttons['Button-Small-Height']],
      ['Button-Small-Horizontal-Padding', buttons['Button-Small-Horizontal-Padding']],
      ['Button-Small-Horizontal-Padding-With-Icon', buttons['Button-Small-Horizontal-Padding-With-Icon']],
      ['Button-Border', {value: 2, type: 'number'}]
    ];
    
    buttonProps.forEach(([prop, propObj]) => {
      if (propObj) {
        const value = typeof propObj.value === 'string' && propObj.value.startsWith('{') 
          ? propObj.value.replace(/[{}]/g, '').replace(/\./g, '-') 
          : propObj.value;
        
        css += ` --${prop}: ${typeof value === 'number' ? `${value}px` : `var(--${value})`};\n`;
      }
    });
  }
  
  // Breakpoints
  if (systemDefaults && systemDefaults.Breakpoints) {
    const breakpointProps = ['Small', 'Medium', 'Large', 'Extra-Large', 'Extra-Small', 'Extra-Extra-Large'];
    
    breakpointProps.forEach(prop => {
      if (systemDefaults.Breakpoints[prop]) {
        css += ` --Breakpoints-${prop.replace(' ', '-')}: ${systemDefaults.Breakpoints[prop].value}px;\n`;
      }
    });
  }
  
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
        
        css += `  --Box-Shadow-${level.replace('L-', '').replace(/\s+&\s+/g, '-')}: ${generateBoxShadowValue(shadowContent, level)};\n`;
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
function processParagraphSpacing(paragraphSpacing, mode, isDefaultMode = false) {
    let css = '';
    
    // Only process the Default section, ignoring 2x
    if (paragraphSpacing.Default) {
      css += `/* ${mode} mode paragraph spacing */\n`;
      
      // For AA-light, use just [data-mode] without a value
      if (isDefaultMode) {
        css += `[data-mode] {\n`;
      } else {
        css += `[data-mode="${mode}"] {\n`;
      }
      
      // Process all spacing values from the Default section
      for (const [key, valueObj] of Object.entries(paragraphSpacing.Default)) {
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
      
      css += '}\n\n';
    }
    
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
* Extract platform typography variables
* @param {Object} platformContent - The platform content object
* @param {String} platformName - The platform name
* @returns {Array} - Array of CSS variable declarations
*/
function extractPlatformVariables(platformContent, platformName) {
    const variables = [];
    
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
            // Special handling for font families to match the exact output
            if (cssValue.includes('Congnitive-Font-Families')) {
              cssValue = cssValue.replace('{Congnitive-Font-Families', 'var(--Congnitive-Font-Families');
            } else {
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

function extractCognitiveVariables(cognitiveContent) {
    const variables = [];
    
    // Add Cognitive Font Families
    if (cognitiveContent['Congnitive-Font-Families']) {
      const fontFamilies = cognitiveContent['Congnitive-Font-Families'];
      variables.push(`  --Congnitive-Font-Families-Standard: "${fontFamilies.Standard.value}";\n`);
      variables.push(`  --Congnitive-Font-Families-Decorative: "${fontFamilies.Decorative.value}";\n`);
    }
    
    // Process Cognitive Default section
    const defaultContent = cognitiveContent['Cognitive-Default'];
    
    // Define sections to process
    const sections = [
      'Body', 'Buttons', 'Captions', 'Subtitles', 'Legal', 
      'Labels', 'Overline', 'Display', 'Headers', 'Number'
    ];
    
    sections.forEach(section => {
      if (defaultContent[section]) {
        Object.entries(defaultContent[section]).forEach(([typeName, typeProps]) => {
          Object.entries(typeProps).forEach(([propName, propObj]) => {
            // Skip if value is undefined
            if (propObj.value === undefined) return;
            
            // Handle font family references
            let value = propObj.value;
            if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
              // Remove braces and convert periods to dashes in CSS variable reference
              value = `var(--${value.substring(1, value.length - 1).replace(/\./g, '-')})`;
            }
            
            // Format numeric values
            if (typeof value === 'number') {
              value = `${value}px`;
            }
            
            // Create variable name
            const variableName = `--Cognitive-${section}-${typeName.replace('-', '')}-${propName}`;
            
            variables.push(`  ${variableName}: ${value};\n`);
          });
        });
      }
    });
    
    // Process Spacing values
    if (defaultContent?.Spacing) {
      Object.entries(defaultContent.Spacing).forEach(([spacingName, spacingObj]) => {
        // Skip entries without a value
        if (spacingObj.value === undefined) return;
        
        // Convert reference or use direct value
        let value = spacingObj.value;
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
          value = `var(--${value.substring(1, value.length - 1).replace(/\./g, '-')})`;
        }
        
        // Create spacing variable
        variables.push(`  --Cognitive-Spacing-${spacingName}: ${value};\n`);
      });
    }
    
    // Add Target if exists
    if (defaultContent?.Target) {
      const targetValue = defaultContent.Target.value;
      variables.push(`  --Cognitive-Target: var(--Platform-Default-Target);\n`);
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
      const cognitiveCss = `[data-cognitive-profile] {\n${
        extractCognitiveVariables(jsonContent[profileKey]).join('')
      }}\n`;
      
      const cognitiveFilename = `cognitive-${profileKey.split('/')[1].toLowerCase()}.css`;
      const cognitiveFilePath = path.join(outputDir, cognitiveFilename);
      
      await fs.promises.writeFile(cognitiveFilePath, cognitiveCss, 'utf8');
      results.cognitive.push({
        profile: profileKey.split('/')[1],
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
  processShadowLevels 
};
