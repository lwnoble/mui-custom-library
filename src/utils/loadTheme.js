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
      background: options.background || '',
      ...options
    };
    
    // Construct mode value (e.g., 'aa-light')
    const mode = `${settings.wcag}-${settings.colorScheme}`;
    
    // Set data attributes
    document.documentElement.setAttribute('data-wcag', settings.wcag);
    document.documentElement.setAttribute('data-background', settings.background);
    document.documentElement.setAttribute('data-surface-container', 'Surface');
    document.documentElement.setAttribute('data-sizing-spacing', '');
    document.documentElement.setAttribute('data-shadow', '');
    document.documentElement.setAttribute('data-platform', settings.platform);
    document.documentElement.setAttribute('data-cognitive', settings.cognitive);
    
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
    
    // Load CSS files in the specified order
    return Promise.resolve()
      // 1. First load mode CSS
      .then(() => loadCssFile(`/styles/theme-files/mode-${mode.toLowerCase()}.css`))
      
      // 2. Then load platform CSS
      .then(() => loadCssFile(`/styles/theme-files/platform-${settings.platform.toLowerCase()}.css`))
      
      // 3. Then load sizing and spacing CSS
      .then(() => loadCssFile('/styles/theme-files/sizing-spacing.css'))
    
      // 4. Then load cognitive CSS
      .then(() => loadCssFile(`/styles/theme-files/cognitive-${settings.cognitive.toLowerCase()}.css`))
      
      // 5. Then load surface containers CSS
      .then(() => loadCssFile('/styles/theme-files/surface-containers.css'))
      
      // 6. Then load shadow levels CSS
      .then(() => loadCssFile('/styles/theme-files/shadow-levels.css'))
      
      // 7. Load system CSS
      .then(() => loadCssFile('/styles/theme-files/system.css'))
      
      // 8. Finally load theme.css as the last CSS file
      .then(() => loadCssFile('/styles/theme-files/theme.css'))
      
      .then(() => {
        console.log(`Theme successfully applied: mode=${mode}, platform=${settings.platform}`);
        
        // Add a custom event that others can listen for
        const event = new CustomEvent('themeLoaded', { 
          detail: { 
            mode, 
            platform: settings.platform,
            cognitive: settings.cognitive,
            background: settings.background
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