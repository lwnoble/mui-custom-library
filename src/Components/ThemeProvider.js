import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ThemeProvider handles loading the appropriate CSS theme files
 * based on the selected mode and platform
 */
const ThemeProvider = ({ 
  children, 
  mode = 'aa-light', 
  platform = 'desktop', 
  onChange = null 
}) => {
  const [themeLoaded, setThemeLoaded] = useState(false);
  
  useEffect(() => {
    // Set data attributes on the html element
    document.documentElement.setAttribute('data-mode', mode);
    document.documentElement.setAttribute('data-platform', platform);
    
    // Load theme if the themeLoader is available
    if (window.themeLoader) {
      window.themeLoader.loadTheme({ mode, platform })
        .then(() => {
          setThemeLoaded(true);
          if (onChange) {
            onChange({ mode, platform });
          }
        })
        .catch(error => {
          console.error('Error loading theme:', error);
        });
    } else {
      // Mark as loaded even if themeLoader isn't available
      setThemeLoaded(true);
      console.warn('Theme loader not found. Make sure to include theme-loader.js in your HTML.');
    }
  }, [mode, platform, onChange]);
  
  return (
    <>
      {children}
    </>
  );
};

ThemeProvider.propTypes = {
  /** Child components to render */
  children: PropTypes.node,
  /** The theme mode to use (e.g. 'aa-light', 'aa-dark') */
  mode: PropTypes.string,
  /** The platform to use (e.g. 'desktop', 'mobile') */
  platform: PropTypes.string,
  /** Callback when theme changes complete */
  onChange: PropTypes.func
};

export default ThemeProvider;