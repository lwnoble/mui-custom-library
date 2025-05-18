// src/components/FontLoader.jsx
import React, { useEffect } from 'react';

const FontLoader = () => {
  useEffect(() => {
    // Helper function to extract font family names from CSS font-family values
    const extractFontFamilies = (fontFamilyString) => {
      if (!fontFamilyString) return [];
      
      // Extract font names from the string (handling both quoted and unquoted names)
      const fontNames = [];
      const regex = /'([^']+)'|"([^"]+)"|([^,\s]+)/g;
      let match;
      
      while ((match = regex.exec(fontFamilyString)) !== null) {
        // match[1] or match[2] for quoted names, match[3] for unquoted
        const fontName = match[1] || match[2] || match[3];
        if (fontName && !isSystemFont(fontName)) {
          fontNames.push(fontName);
        }
      }
      
      return fontNames;
    };
    
    // Check if a font is a system font (we don't need to load these)
    const isSystemFont = (fontName) => {
      const systemFonts = [
        '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 
        'sans-serif', 'serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
        'SF Pro Text', 'Helvetica Neue', 'SF Pro Display', 'system-ui'
      ];
      
      return systemFonts.some(sf => 
        fontName.toLowerCase() === sf.toLowerCase()
      );
    };
    
    // Convert font name to Google Fonts URL format
    const getFontUrl = (fontName) => {
      // Special case for OpenDyslexic which is not on Google Fonts
      if (fontName.toLowerCase() === 'open dyslexic') {
        return 'https://fonts.cdnfonts.com/css/open-dyslexic';
      }
      
      // For Google Fonts, format the URL properly
      // Replace spaces with +
      const formattedName = fontName.replace(/\s+/g, '+');
      
      // Most commonly used font weights
      const weights = [300, 400, 500, 700];
      
      // Set the URL (we're requesting both normal and italic styles with common weights)
      return `https://fonts.googleapis.com/css2?family=${formattedName}:ital,wght@0,${weights.join(';0,')};1,${weights.join(';1,')}&display=swap`;
    };
    
    // Function to load a font if not already loaded
    const loadFont = (fontName) => {
      if (!fontName || isSystemFont(fontName)) return;
      
      const url = getFontUrl(fontName);
      
      // Check if already loaded
      const fontAlreadyLoaded = document.querySelector(`link[href*="${encodeURIComponent(fontName)}"]`);
      if (fontAlreadyLoaded) return;
      
      console.log(`Loading font: ${fontName}`);
      
      // Create link element
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      
      // Add to head
      document.head.appendChild(link);
    };
    
    // Function to load fonts based on computed CSS variables
    const loadFontsFromComputedVars = () => {
      // Create a temporary element
      const temp = document.createElement('div');
      document.body.appendChild(temp);
      
      // Get computed styles
      const computedStyle = getComputedStyle(temp);
      
      // Get the platform font families
      const standardFontFamily = computedStyle.getPropertyValue('--Platform-Font-Families-Standard').trim();
      const decorativeFontFamily = computedStyle.getPropertyValue('--Platform-Font-Families-Decorative').trim();
      
      // Get the cognitive font families
      const cognitiveStandardFont = computedStyle.getPropertyValue('--Congnitive-Font-Families-Standard').trim();
      const cognitiveDecorativeFont = computedStyle.getPropertyValue('--Congnitive-Font-Families-Decorative').trim();
      
      // Extract and load fonts
      [standardFontFamily, decorativeFontFamily, cognitiveStandardFont, cognitiveDecorativeFont].forEach(fontString => {
        const fonts = extractFontFamilies(fontString);
        fonts.forEach(loadFont);
      });
      
      // Clean up
      document.body.removeChild(temp);
    };
    
    // Load specific fonts based on cognitive and platform settings
    const loadSpecificFonts = (cognitive, platform) => {
      // Always load these common fonts
      loadFont('Roboto');
      loadFont('Open Sans');
      
      // Load cognitive-specific fonts
      if (cognitive === 'dyslexic') {
        loadFont('Open Dyslexic');
      }
    };
    
    // Handler for theme changes
    const handleThemeChange = (event) => {
      // Get current theme settings from event or attributes
      const cognitive = (event?.detail?.cognitive) || document.documentElement.getAttribute('data-cognitive') || 'none';
      const platform = (event?.detail?.platform) || document.documentElement.getAttribute('data-platform') || 'desktop';
      
      // Load specific fonts based on settings
      loadSpecificFonts(cognitive, platform);
      
      // After a short delay (to allow CSS variables to be applied), load fonts from computed variables
      setTimeout(() => {
        loadFontsFromComputedVars();
      }, 100);
    };
    
    // Listen for theme loaded event
    document.addEventListener('themeLoaded', handleThemeChange);
    
    // Initial font loading
    handleThemeChange();
    
    // Clean up
    return () => {
      document.removeEventListener('themeLoaded', handleThemeChange);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default FontLoader;