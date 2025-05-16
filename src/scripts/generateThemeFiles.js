// src/scripts/generateThemeFiles.js
const fs = require('fs');
const path = require('path');
const JsonToCssSplit = require('../utils/JsonToCssSplit.cjs');

// Parse command line arguments
const args = process.argv.slice(2);
const inputJsonPath = args[0] || path.join(__dirname, '../styles/theme.json');
const outputCssDir = args[1] || path.join(__dirname, '../styles/theme-files');

async function main() {
  try {
    console.log(`Input JSON file: ${inputJsonPath}`);
    console.log(`Output CSS directory: ${outputCssDir}`);
    
    // Ensure output directory exists
    if (!fs.existsSync(outputCssDir)) {
      fs.mkdirSync(outputCssDir, { recursive: true });
    }
    
    // Convert JSON to multiple CSS files
    const results = await JsonToCssSplit.convertJsonFileToCssFiles(inputJsonPath, outputCssDir);
    
    // Generate the loader script
    const loaderScriptPath = await JsonToCssSplit.generateLoaderScript(outputCssDir, results);
    
    console.log(`Successfully generated CSS files in ${outputCssDir}`);
    console.log(`Generated loader script: ${loaderScriptPath}`);
    
    // Copy loader script to public directory for development
    const publicJsDir = path.join(__dirname, '../../public/js');
    if (!fs.existsSync(publicJsDir)) {
      fs.mkdirSync(publicJsDir, { recursive: true });
    }
    
    fs.copyFileSync(
      loaderScriptPath,
      path.join(publicJsDir, 'theme-loader.js')
    );
    
    console.log(`Copied loader script to public/js/theme-loader.js for development use`);
    
    // Create a simple index HTML for the generated styles directory
    const indexHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Theme CSS Files</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; padding: 20px; max-width: 800px; margin: 0 auto; }
    h1 { border-bottom: 1px solid #eee; padding-bottom: 10px; }
    ul { padding-left: 20px; }
    li { margin-bottom: 10px; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .file-list { background: #f6f8fa; padding: 15px; border-radius: 5px; }
  </style>
</head>
<body>
  <h1>Generated Theme CSS Files</h1>
  <p>These files were automatically generated from the theme JSON file.</p>
  
  <div class="file-list">
    <h2>Available Files:</h2>
    <ul>
      ${fs.readdirSync(outputCssDir)
        .map(file => `<li><a href="${file}">${file}</a></li>`)
        .join('\n      ')}
    </ul>
  </div>
  
  <h2>How to Use</h2>
  <p>Include the base CSS files and theme-loader.js in your HTML:</p>
  <pre><code>&lt;link rel="stylesheet" href="base.css"&gt;
&lt;link rel="stylesheet" href="system.css"&gt;
&lt;script src="theme-loader.js"&gt;&lt;/script&gt;</code></pre>
  
  <p>The theme-loader will automatically load the appropriate mode and platform CSS files based on the data attributes you set:</p>
  <pre><code>&lt;html data-mode="aa-light" data-platform="desktop"&gt;</code></pre>
  
  <p>You can also change the theme programmatically using the ThemeProvider component in your React app:</p>
  <pre><code>import { ThemeProvider } from 'custom-mui-library';

function App() {
  return (
    &lt;ThemeProvider mode="aa-dark" platform="mobile"&gt;
      {/* Your app content */}
    &lt;/ThemeProvider&gt;
  );
}</code></pre>

  <p>Or directly using the loadTheme utility in non-React environments:</p>
  <pre><code>import { loadTheme } from 'custom-mui-library';

// Switch to dark mode on mobile
loadTheme({
  mode: 'aa-dark',
  platform: 'mobile'
});</code></pre>
</body>
</html>
    `;
    
    fs.writeFileSync(path.join(outputCssDir, 'index.html'), indexHtmlContent);
    console.log(`Created index.html in the generated styles directory`);
    
    return 0; // Success
  } catch (error) {
    console.error('Error generating CSS files:', error);
    return 1; // Error
  }
}

// Run the main function
main()
  .then(exitCode => {
    process.exit(exitCode);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });