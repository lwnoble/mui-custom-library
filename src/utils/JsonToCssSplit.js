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
function extractModeVariables(bgContent, mode, backgroundType = 'default') {
    const variables = [];
    
    // Define properties in the desired order
    const surfaceProps = [
      'Surface', 'Surface-Dim', 'Surface-Bright', 
      'Surface-Quiet', 'Surface-Dim-Quiet', 'Surface-Bright-Quiet'
    ];
    
    const containerProps = [
      'Container', 'Container-Low', 'Container-Lowest', 
      'Container-High', 'Container-Highest', 
      'Container-On-Quiet', 'Container-Low-Quiet', 
      'Container-Lowest-Quiet', 'Container-High-Quiet', 
      'Container-Highest-Quiet'
    ];
    
    const dropdownProps = [
      'Dropdown-Color-1', 'Dropdown-Color-2', 'Dropdown-Color-3', 
      'Dropdown-Color-4', 'Dropdown-Color-5'
    ];
    
    // Process surface properties
    surfaceProps.forEach(prop => {
      const fullProp = prop.includes('Surface-') ? prop : `Surface-${prop}`;
      if (bgContent[fullProp] && bgContent[fullProp].value !== undefined) {
        variables.push(`  --${prop}: ${bgContent[fullProp].value};\n`);
      }
    });
    
    // Process container properties
    containerProps.forEach(prop => {
      const fullProp = prop.replace('On-Quiet', '-Quiet');
      if (bgContent[fullProp] && bgContent[fullProp].value !== undefined) {
        // Special handling for Container-Quiet
        const variableName = prop === 'Container-On-Quiet' ? 'Container-Quiet' : prop;
        variables.push(`  --${prop}: ${bgContent[fullProp].value};\n`);
      }
    });
    
    // Process dropdown colors
    dropdownProps.forEach(prop => {
      if (bgContent[prop] && bgContent[prop].value !== undefined) {
        variables.push(`  --${prop}: ${bgContent[prop].value};\n`);
      }
    });
    
    return variables;
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
      css += `/* ${mode} mode specific backgrounds */\n`;
      css += `[data-mode="${mode}"] [data-background] {\n`;
      
      const variables = extractModeVariables(backgrounds.Default, mode);
      variables.forEach(variable => {
        css += variable;
      });
      
      css += '}\n\n';
    }
    
    // Process other named backgrounds
    for (const [bgName, bgContent] of Object.entries(backgrounds)) {
      if (bgName !== 'Default') {
        const bgNameLower = bgName.toLowerCase();
        
        css += `/* ${mode} mode specific backgrounds */\n`;
        css += `[data-mode="${mode}"] [data-background="${bgNameLower}"] {\n`;
        
        const variables = extractModeVariables(bgContent, mode, bgNameLower);
        variables.forEach(variable => {
          css += variable;
        });
        
        css += '}\n\n';
      }
    }
    
    return css;
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
    
    // Additional typography sections would be processed similarly
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
  const results = {
    base: null,
    modes: [],
    platforms: [],
    cognitive: [],
    sizingSpacing: [],
    surfaceContainers: null,
    system: null
  };
  
  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
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
  await fs.promises.writeFile(baseFilePath, baseCSS, 'utf8');
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
    this.initialized = false;
  }

  /**
   * Detect the current platform
   * @returns {string} - Detected platform (desktop, mobile, etc.)
   */
  detectPlatform() {
    // Basic platform detection logic
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return isMobile ? 'mobile' : 'desktop';
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
   * Initialize the theme by loading base CSS
   * @returns {Promise} - Promise that resolves when base CSS is loaded
   */
  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      // Load base CSS first
      await this.loadStylesheet('base.css', 'theme-base');
      
      // Load system CSS
      await this.loadStylesheet('system.css', 'theme-system');
      
      // Load sizing and spacing CSS
      await this.loadStylesheet('sizing-spacing.css', 'theme-sizing-spacing');
      
      // Load surface containers CSS
      await this.loadStylesheet('surface-containers.css', 'theme-surface-containers');
      
      this.initialized = true;
    } catch (err) {
      console.error('Error initializing theme:', err);
    }
  }

  /**
   * Set the current theme data attributes on the document
   * @param {string} mode - The mode to set
   * @param {string} platform - The platform to set
   */
  setThemeAttributes(mode, platform) {
    document.documentElement.setAttribute('data-mode', mode);
    document.documentElement.setAttribute('data-platform', platform);
  }

  /**
   * Load the appropriate CSS files based on settings
   * @param {Object} options - Configuration options
   * @param {string} [options.mode] - The mode to load (aa-light, dark, etc.)
   * @param {string} [options.platform] - The platform to load (desktop, mobile, etc.)
   * @returns {Promise} - Promise that resolves when all stylesheets are loaded
   */
  async loadTheme(options = {}) {
    // Initialize if not already done
    await this.initialize();
    
    const mode = options.mode || this.defaultMode;
    const platform = options.platform || this.defaultPlatform;

    const promises = [];

    // Load mode CSS
    promises.push(
      this.loadStylesheet(\`mode-\${mode.toLowerCase()}.css\`, \`theme-mode-\${mode}\`)
        .catch(err => console.warn(\`Could not load mode CSS: \${err.message}\`))
    );

    // Load platform CSS
    promises.push(
      this.loadStylesheet(\`platform-\${platform.toLowerCase()}.css\`, \`theme-platform-\${platform}\`)
        .catch(err => console.warn(\`Could not load platform CSS: \${err.message}\`))
    );

    // Set data attributes on the document
    this.setThemeAttributes(mode, platform);

    return Promise.all(promises);
  }
}

// Create a global instance
window.themeLoader = new ThemeLoader();

// Auto-load theme based on default settings
document.addEventListener('DOMContentLoaded', () => {
  window.themeLoader.loadTheme();
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
  processBackgrounds 
 };