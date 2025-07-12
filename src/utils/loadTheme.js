/**
 * Helper function to load theme CSS files
 * @param {Object} options - Theme options (optional overrides)
 * @returns {Promise} - Promise that resolves when all theme CSS files are loaded
 */
const loadTheme = (options = {}) => {
  // Detect preferred color scheme
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Detect device platform
  const detectPlatform = () => {
    if (/Android/i.test(navigator.userAgent)) return 'android';
    if (/iPad/i.test(navigator.userAgent)) return 'ios-tablet';
    if (/iPhone|iPod/i.test(navigator.userAgent)) return 'ios-mobile';
    return 'desktop';
  };
  
  // Default settings
  const settings = {
    wcag: options.wcag || 'aa',
    colorScheme: options.colorScheme || (prefersDarkMode ? 'dark' : 'light'),
    platform: options.platform || detectPlatform(),
    cognitive: options.cognitive || 'none',
    background: options.background || 'default',
    surface: options.surface || 'surface',
    spacing: options.spacing || 'default',
    reader: options.reader || 'default',
    ...options
  };
  
  // Construct mode value (e.g., 'aa-light')
  const mode = `${settings.wcag}-${settings.colorScheme}`;
  
  // Set data attributes that CSS actually uses
  
  // Set background attribute - use actual value, empty string only for 'default'
  if (settings.background === 'default') {
    document.documentElement.setAttribute('data-background', '');
  } else {
    document.documentElement.setAttribute('data-background', settings.background);
  }
  
  // Set surface attribute - use actual value, empty string only for base 'surface'
  if (settings.surface === 'surface') {
    document.documentElement.setAttribute('data-surface', '');
  } else {
    document.documentElement.setAttribute('data-surface', settings.surface);
  }
  
  // Also update main-content-container with surface attribute
  const mainContent = document.querySelector('.main-content-container');
  if (mainContent) {
    if (settings.surface === 'surface') {
      mainContent.setAttribute('data-surface', '');
    } else {
      mainContent.setAttribute('data-surface', settings.surface);
    }
  }
  
  // Set spacing attribute - always set the attribute to match CSS selectors
  if (settings.spacing === 'default') {
    // For default, set empty value to match [data-spacing] selector
    document.documentElement.setAttribute('data-spacing', '');
  } else {
    // For other values, set the actual value to match [data-spacing="value"] selectors
    document.documentElement.setAttribute('data-spacing', settings.spacing);
  }
  
  // Set reader attribute - always set the attribute to match CSS selectors
  if (settings.reader === 'default') {
    // For default, set empty value to match [data-reader] selector
    document.documentElement.setAttribute('data-reader', '');
  } else {
    // For other values, set the actual value to match [data-reader="value"] selectors
    document.documentElement.setAttribute('data-reader', settings.reader);
  }
  
  // Set shadow attribute (if needed)
  document.documentElement.setAttribute('data-shadow', '');
  
  // Helper function to load a CSS file
  const loadCssFile = (href) => {
    return new Promise((resolve) => {
      // Check if already loaded
      const existingLink = document.querySelector(`link[href="${href}"]`);
      if (existingLink) {
        console.log(`CSS already loaded: ${href}`);
        resolve();
        return;
      }
      
      console.log(`Loading CSS: ${href}`);
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      
      link.onload = () => {
        console.log(`Successfully loaded: ${href}`);
        resolve();
      };
      
      link.onerror = () => {
        console.warn(`Failed to load CSS: ${href}`);
        // Resolve anyway to not block other CSS files
        resolve();
      };
      
      document.head.appendChild(link);
    });
  };
  
  // Helper to remove previously loaded CSS files for a category
  const removeOldCssFiles = (pattern, except) => {
    const links = document.querySelectorAll(`link[href*="${pattern}"]`);
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href.includes(except)) {
        console.log(`Removing: ${href}`);
        link.parentNode.removeChild(link);
      }
    });
  };
  
  // Clean up old CSS files
  removeOldCssFiles('mode-', `mode-${mode}`);
  removeOldCssFiles('cognitive-', `cognitive-${settings.cognitive}`);
  removeOldCssFiles('platform-', `platform-${settings.platform}`);
  
  console.log(`Loading theme: mode=${mode}, platform=${settings.platform}, cognitive=${settings.cognitive}`);
  
  // Load CSS files in the correct order - ALL in one Promise chain
  return Promise.resolve()
    // 1. Load core CSS first
    .then(() => loadCssFile('/styles/theme-files/static/core.css'))
    // 2. Load base CSS (contains common variables and Animation-Speed)
    .then(() => loadCssFile('/styles/theme-files/base.css'))
    // 3. Load system CSS (contains system tokens)
    .then(() => loadCssFile('/styles/theme-files/system.css'))
    // 4. Load sizing and spacing CSS
    .then(() => loadCssFile('/styles/theme-files/sizing-spacing.css'))
    // 5. Load platform CSS
    .then(() => loadCssFile(`/styles/theme-files/platform-${settings.platform.toLowerCase()}.css`))
    // 6. Load cognitive CSS
    .then(() => loadCssFile(`/styles/theme-files/cognitive-${settings.cognitive.toLowerCase()}.css`))
    // 7. Load surface containers CSS
    .then(() => loadCssFile('/styles/theme-files/surface-containers.css'))
    // 8. Load shadow levels CSS
    .then(() => loadCssFile('/styles/theme-files/shadow-levels.css'))
    // 9. Load typography CSS
    .then(() => loadCssFile('/styles/theme-files/static/typography.css'))
    // 10. Load theme CSS
    .then(() => loadCssFile('/styles/theme-files/static/theme.css'))
    // 11. Load mode CSS LAST to override other styles
    .then(() => loadCssFile(`/styles/theme-files/mode-${mode.toLowerCase()}.css`))
    .then(() => {
      console.log(`Theme successfully applied: mode=${mode}, platform=${settings.platform}`);
      
      // Add a custom event that others can listen for
      const event = new CustomEvent('themeLoaded', { 
        detail: { 
          mode, 
          platform: settings.platform,
          cognitive: settings.cognitive,
          background: settings.background,
          surface: settings.surface,
          spacing: settings.spacing,
          reader: settings.reader
        } 
      });
      document.dispatchEvent(event);
      
      // Optional: Add a class to indicate that all theme files are loaded
      document.documentElement.classList.add('theme-loaded');
    })
    .catch(error => {
      console.error('Error loading theme CSS files:', error);
    });
};

export default loadTheme;