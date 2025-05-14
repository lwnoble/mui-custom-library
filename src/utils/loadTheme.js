// File: src/utils/loadTheme.js
/**
 * Helper function to load the theme in non-React environments
 * @param {Object} options - Theme options
 * @param {string} options.mode - The theme mode to use (e.g. 'aa-light', 'aa-dark')
 * @param {string} options.platform - The platform to use (e.g. 'desktop', 'mobile')
 * @returns {Promise} - Promise that resolves when the theme is loaded
 */
const loadTheme = ({ mode = 'aa-light', platform = 'desktop' }) => {
    // Set data attributes on the html element
    document.documentElement.setAttribute('data-mode', mode);
    document.documentElement.setAttribute('data-platform', platform);
    
    // Load theme if the themeLoader is available
    if (window.themeLoader) {
      return window.themeLoader.loadTheme({ mode, platform });
    } else {
      console.warn('Theme loader not found. Make sure to include theme-loader.js in your HTML.');
      return Promise.resolve();
    }
  };
  
  export default loadTheme;