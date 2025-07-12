/**
 * Dynamic CSS loader for theme files
 * Modified version that skips base.css
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

      // For development, prepend the path with /styles/ if needed
      // Adjust this path if your CSS files are stored elsewhere
      const fullPath = fileName.startsWith('/') ? fileName : `/styles/${fileName}`;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fullPath;
      link.id = id;

      link.onload = () => {
        this.loadedStylesheets.set(id, link);
        resolve();
      };

      link.onerror = () => {
        console.warn(`Failed to load ${fullPath}`);
        reject(new Error(`Failed to load ${fullPath}`));
      };

      document.head.appendChild(link);
    });
  }

  /**
   * Initialize the theme by loading required CSS
   * @returns {Promise} - Promise that resolves when CSS is loaded
   */
  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      // We're skipping base.css as it's not needed
      
      // Load system CSS if it exists
      await this.loadStylesheet('system.css', 'theme-system')
        .catch(err => console.warn(`System CSS not loaded: ${err.message}`));
      
      // Load sizing and spacing CSS if it exists
      await this.loadStylesheet('sizing-spacing.css', 'theme-sizing-spacing')
        .catch(err => console.warn(`Sizing CSS not loaded: ${err.message}`));
      
      // Load surface containers CSS
      await this.loadStylesheet('surface-containers.css', 'theme-surface-containers')
        .catch(err => console.warn(`Surface containers CSS not loaded: ${err.message}`));
      
      this.initialized = true;
    } catch (err) {
      console.error('Error initializing theme:', err);
      // Continue anyway, as we want to at least attempt to load mode and platform CSS
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
   * @param {string} [options.cognitive] - The cognitive setting (none, adhd, dyslexic)
   * @param {string} [options.spacing] - The spacing setting (default, standard, etc.)
   * @returns {Promise} - Promise that resolves when all stylesheets are loaded
   */
  async loadTheme(options = {}) {
    // Initialize if not already done
    await this.initialize();
    
    const mode = options.mode || this.defaultMode;
    const platform = options.platform || this.defaultPlatform;
    const cognitive = options.cognitive || 'none';
    const spacing = options.spacing || 'default';

    const promises = [];

    // Load mode CSS
    promises.push(
      this.loadStylesheet(`mode-${mode.toLowerCase()}.css`, `theme-mode-${mode}`)
        .catch(err => console.warn(`Could not load mode CSS: ${err.message}`))
    );

    // Load platform CSS
    promises.push(
      this.loadStylesheet(`platform-${platform.toLowerCase()}.css`, `theme-platform-${platform}`)
        .catch(err => console.warn(`Could not load platform CSS: ${err.message}`))
    );

    // Load cognitive CSS
    promises.push(
      this.loadStylesheet(`cognitive-${cognitive.toLowerCase()}.css`, `theme-cognitive-${cognitive}`)
        .catch(err => console.warn(`Could not load cognitive CSS: ${err.message}`))
    );

    // Load spacing CSS if it's not default
    if (spacing !== 'default') {
      promises.push(
        this.loadStylesheet(`spacing-${spacing.toLowerCase()}.css`, `theme-spacing-${spacing}`)
          .catch(err => console.warn(`Could not load spacing CSS: ${err.message}`))
      );
    }

    // Set data attributes on the document
    this.setThemeAttributes(mode, platform);
    document.documentElement.setAttribute('data-cognitive', cognitive);
    document.documentElement.setAttribute('data-spacing', spacing);
    
    // These attributes are needed for certain CSS variables
    document.documentElement.setAttribute('data-background', '');
    document.documentElement.setAttribute('data-surface', '');
    document.documentElement.setAttribute('data-sizing-spacing', '');
    document.documentElement.setAttribute('data-shadow', '');

    return Promise.all(promises);
  }
}

// Create a global instance
window.themeLoader = new ThemeLoader();

// Auto-load theme based on default settings
document.addEventListener('DOMContentLoaded', () => {
  window.themeLoader.loadTheme();
});

// Log that theme-loader.js is loaded
console.log('Theme loader initialized');