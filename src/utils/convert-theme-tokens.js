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

// Wrap convertToCssFiles with additional error handling for each stage
async function convertToCssFilesWithErrorHandling(jsonContent, outputDir) {
  const results = {
    base: null,
    modes: [],
    platforms: [],
    cognitive: [],
    sizingSpacing: null,
    surfaceContainers: null,
    system: null,
    shadowLevels: null
  };
  
  try {
    // Process base.css
    if (jsonContent['System-Styles/Default']) {
      try {
        console.log('Processing base.css...');
        
        // Get extracted system tokens
        const { extractBaseSystemTokens } = await import('./JsonToCssSplit.js');
        const systemTokensContent = extractBaseSystemTokens(jsonContent);
        
        const baseCSS = `/**
 * Base CSS variables - Common properties across all themes
 * Generated by JsonToCss
 */
:root {
  /* Other global variables */
  --global-transition-duration: 0.2s;
${systemTokensContent}}`;

        const baseFilename = 'base.css';
        const baseFilePath = path.join(outputDir, baseFilename);
        
        await fs.promises.writeFile(baseFilePath, baseCSS, 'utf8');
        console.log(`Successfully wrote ${baseFilename}`);
        
        results.base = {
          file: baseFilename,
          path: baseFilePath
        };
      } catch (baseError) {
        console.error(`Error creating base.css: ${baseError.message}`);
        // Continue to try other files
      }
    } else {
      console.warn("System-Styles/Default section missing - cannot create base.css");
    }
    
    // Process system.css
    if (jsonContent['System/Default']) {
      try {
        console.log('Processing system.css...');
        const systemCSS = await convertSystemToCss(jsonContent, outputDir);
        results.system = systemCSS;
      } catch (systemError) {
        console.error(`Error creating system.css: ${systemError.message}`);
        // Continue to try other files
      }
    } else {
      console.warn("System/Default section missing - cannot create system.css");
    }
    
    // Process surface-containers.css
    if (Object.keys(jsonContent).some(key => key.startsWith('Surface and Containers/'))) {
      try {
        console.log('Processing surface-containers.css...');
        const { processSurfaceContainers } = await import('./JsonToCssSplit.js');
        const surfaceContainersCSS = processSurfaceContainers(jsonContent);
        const surfaceContainersFilename = 'surface-containers.css';
        const surfaceContainersFilePath = path.join(outputDir, surfaceContainersFilename);
        
        await fs.promises.writeFile(surfaceContainersFilePath, surfaceContainersCSS, 'utf8');
        results.surfaceContainers = {
          file: surfaceContainersFilename,
          path: surfaceContainersFilePath
        };
      } catch (surfaceError) {
        console.error(`Error creating surface-containers.css: ${surfaceError.message}`);
      }
    } else {
      console.warn("Surface and Containers sections missing - cannot create surface-containers.css");
    }
    
    // Process shadow-levels.css
    if (Object.keys(jsonContent).some(key => key.startsWith('Shadow-Level/'))) {
      try {
        console.log('Processing shadow-levels.css...');
        const { processShadowLevels } = await import('./JsonToCssSplit.js');
        const shadowLevelsCSS = processShadowLevels(jsonContent);
        const shadowLevelsFilename = 'shadow-levels.css';
        const shadowLevelsFilePath = path.join(outputDir, shadowLevelsFilename);
        
        await fs.promises.writeFile(shadowLevelsFilePath, shadowLevelsCSS, 'utf8');
        results.shadowLevels = {
          file: shadowLevelsFilename,
          path: shadowLevelsFilePath
        };
      } catch (shadowError) {
        console.error(`Error creating shadow-levels.css: ${shadowError.message}`);
      }
    } else {
      console.warn("Shadow-Level sections missing - cannot create shadow-levels.css");
    }
    
    // Process modes (AA-light, AA-dark, etc.)
    try {
      console.log('Processing mode CSS files...');
      const modeKeys = Object.keys(jsonContent).filter(key => key.startsWith('Modes/'));
      
      for (const modeKey of modeKeys) {
        try {
          const mode = modeKey.split('/')[1];
          console.log(`Processing mode: ${mode}`);
          
          let css = '';
          const modeContent = jsonContent[modeKey];
          
          // Process backgrounds
          if (modeContent.Backgrounds) {
            css += processBackgrounds(modeContent.Backgrounds, mode);
          }
          
          // Process mode targets
          if (modeContent['Mode-Target']) {
            css += processModeTarget(modeContent['Mode-Target'], mode, mode === 'AA-light');
          }
          
          // Process paragraph spacing
          if (modeContent['Mode-Paragraph-Spacing']) {
            css += processParagraphSpacing(modeContent['Mode-Paragraph-Spacing'], mode, mode === 'AA-light');
          }
          
          // Process charts if present
          if (modeContent.Charts) {
            const { extractChartVariables } = await import('./JsonToCssSplit.js');
            
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
          
          // Save mode CSS to file
          const modeFilename = `mode-${mode.toLowerCase()}.css`;
          const modeFilePath = path.join(outputDir, modeFilename);
          
          await fs.promises.writeFile(modeFilePath, css, 'utf8');
          console.log(`Successfully wrote ${modeFilename}`);
          
          results.modes.push({
            mode,
            file: modeFilename,
            path: modeFilePath
          });
        } catch (modeError) {
          console.error(`Error processing mode ${modeKey}: ${modeError.message}`);
          // Continue with other modes
        }
      }
    } catch (modesError) {
      console.error(`Error processing modes: ${modesError.message}`);
    }
    
    // Process platforms (Desktop, IOS, etc.)
    try {
      console.log('Processing platform CSS files...');
      const platformKeys = Object.keys(jsonContent).filter(key => key.startsWith('Platform/'));
      
      for (const platformKey of platformKeys) {
        try {
          const platform = platformKey.split('/')[1];
          console.log(`Processing platform: ${platform}`);
          
          let css = '';
          const platformContent = jsonContent[platformKey];
          
          // Process platform typography
          css += `/* ${platform} platform specific typography */\n`;
          css += `[data-platform="${platform}"] {\n`;
          
          // Extract platform variables
          const platformVars = extractPlatformVariables(platformContent, platform);
          platformVars.forEach(variable => {
            css += variable;
          });
          
          css += '}\n\n';
          
          // Save platform CSS to file
          const platformFilename = `platform-${platform.toLowerCase()}.css`;
          const platformFilePath = path.join(outputDir, platformFilename);
          
          await fs.promises.writeFile(platformFilePath, css, 'utf8');
          console.log(`Successfully wrote ${platformFilename}`);
          
          results.platforms.push({
            platform,
            file: platformFilename,
            path: platformFilePath
          });
        } catch (platformError) {
          console.error(`Error processing platform ${platformKey}: ${platformError.message}`);
          // Continue with other platforms
        }
      }
    } catch (platformsError) {
      console.error(`Error processing platforms: ${platformsError.message}`);
    }
    
    // Process sizing and spacing
    if (Object.keys(jsonContent).some(key => key.startsWith('Sizing & Spacing/'))) {
      try {
        console.log('Processing sizing-spacing.css...');
        const { processSizingSpacing } = await import('./JsonToCssSplit.js');
        const sizingSpacingCSS = processSizingSpacing(jsonContent);
        const sizingSpacingFilename = 'sizing-spacing.css';
        const sizingSpacingFilePath = path.join(outputDir, sizingSpacingFilename);
        
        await fs.promises.writeFile(sizingSpacingFilePath, sizingSpacingCSS, 'utf8');
        console.log(`Successfully wrote ${sizingSpacingFilename}`);
        
        results.sizingSpacing = {
          file: sizingSpacingFilename,
          path: sizingSpacingFilePath
        };
      } catch (sizingError) {
        console.error(`Error creating sizing-spacing.css: ${sizingError.message}`);
      }
    } else {
      console.warn("Sizing & Spacing sections missing - cannot create sizing-spacing.css");
    }
    
    // Process cognitive profiles
    try {
      console.log('Processing cognitive CSS files...');
      const cognitiveProfiles = [
        'Cognitive/None', 
        'Cognitive/ADHD', 
        'Cognitive/Dyslexia'
      ];
      
      for (const profileKey of cognitiveProfiles) {
        if (jsonContent[profileKey]) {
          try {
            // Extract the profile name from the key
            const profileName = profileKey.split('/')[1];
            console.log(`Processing cognitive profile: ${profileName}`);
            
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
            console.log(`Successfully wrote ${cognitiveFilename}`);
            
            results.cognitive.push({
              profile: profileName,
              file: cognitiveFilename,
              path: cognitiveFilePath
            });
          } catch (profileError) {
            console.error(`Error processing cognitive profile ${profileKey}: ${profileError.message}`);
            // Continue with other profiles
          }
        } else {
          console.warn(`Cognitive profile ${profileKey} missing`);
        }
      }
    } catch (cognitiveError) {
      console.error(`Error processing cognitive profiles: ${cognitiveError.message}`);
    }
    
    return results;
  } catch (error) {
    console.error('Error in convertToCssFilesWithErrorHandling:', error.message);
    // Return partial results for debugging
    return results;
  }
}

// Helper to log the results
function logResults(results) {
  // Log base file if created
  if (results.base) {
    console.log(`- ${results.base.file} (base styles)`);
  }
  
  // Log system file if created
  if (results.system) {
    console.log(`- ${results.system.file} (system tokens)`);
  }
  
  // Log surface containers file if created
  if (results.surfaceContainers) {
    console.log(`- ${results.surfaceContainers.file} (surface containers)`);
  }
  
  // Log shadow levels file if created
  if (results.shadowLevels) {
    console.log(`- ${results.shadowLevels.file} (shadow levels)`);
  }
  
  // Log sizing spacing file if created
  if (results.sizingSpacing) {
    console.log(`- ${results.sizingSpacing.file} (sizing and spacing)`);
  }
  
  // Log mode files
  console.log(`- ${results.modes.length} mode files:`);
  results.modes.forEach(mode => {
    console.log(`  * ${mode.file}`);
  });
  
  // Log platform files
  console.log(`- ${results.platforms.length} platform files:`);
  results.platforms.forEach(platform => {
    console.log(`  * ${platform.file}`);
  });
  
  // Log cognitive files
  console.log(`- ${results.cognitive.length} cognitive profile files:`);
  results.cognitive.forEach(cognitive => {
    console.log(`  * ${cognitive.file}`);
  });
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