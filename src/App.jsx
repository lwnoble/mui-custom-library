import React, { useState, useEffect, useCallback } from 'react';
import SettingsPanel from './components/SettingsPanel';
import ThemeButtonDemo from './components/ThemeButtonDemo';
import loadTheme from './utils/loadTheme';
import FontLoader from './components/FontLoader'; // Import the FontLoader
import './App.css';

function App() {
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  
  // Helper to detect platform
  const detectPlatform = useCallback(() => {
    if (/Android/i.test(navigator.userAgent)) return 'android';
    if (/iPad/i.test(navigator.userAgent)) return 'ios-tablet';
    if (/iPhone|iPod/i.test(navigator.userAgent)) return 'ios-mobile';
    return 'desktop';
  }, []);
  
  // Detect color scheme
  const detectColorScheme = useCallback(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);
  
  // Theme state with defaults from system detection
  const [themeSettings, setThemeSettings] = useState({
    wcag: 'aa',
    colorScheme: detectColorScheme(),
    platform: detectPlatform(),
    cognitive: 'none',
    background: '',
  });
  
  // Load stored preferences or initialize with system defaults
  useEffect(() => {
    // Try to get stored preferences
    let storedSettings = null;
    try {
      const stored = localStorage.getItem('userThemePreferences');
      if (stored) storedSettings = JSON.parse(stored);
    } catch (e) {
      console.error('Error reading stored preferences:', e);
    }
    
    // Apply stored settings or system defaults
    if (storedSettings) {
      setThemeSettings(prev => ({
        ...prev,
        ...storedSettings
      }));
    } else {
      // Set defaults based on system detection
      setThemeSettings(prev => ({
        ...prev,
        colorScheme: detectColorScheme(),
        platform: detectPlatform()
      }));
    }
    
    // Listen for color scheme changes
    const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const handleColorSchemeChange = (e) => {
      // Only update automatically if user hasn't set a manual preference
      if (!localStorage.getItem('userThemePreferences')) {
        setThemeSettings(prev => ({
          ...prev,
          colorScheme: e.matches ? 'dark' : 'light'
        }));
      }
    };
    
    if (colorSchemeMedia.addEventListener) {
      colorSchemeMedia.addEventListener('change', handleColorSchemeChange);
    } else if (colorSchemeMedia.addListener) {
      colorSchemeMedia.addListener(handleColorSchemeChange);
    }
    
    return () => {
      if (colorSchemeMedia.removeEventListener) {
        colorSchemeMedia.removeEventListener('change', handleColorSchemeChange);
      } else if (colorSchemeMedia.removeListener) {
        colorSchemeMedia.removeListener(handleColorSchemeChange);
      }
    };
  }, [detectColorScheme, detectPlatform]);
  
  // Apply theme settings and load CSS files
  useEffect(() => {
    console.log('Applying theme settings:', themeSettings);
    
    // Load theme CSS files
    loadTheme(themeSettings);
    
    // Save user preferences
    try {
      localStorage.setItem('userThemePreferences', JSON.stringify(themeSettings));
    } catch (e) {
      console.error('Error saving preferences:', e);
    }
  }, [themeSettings]);
  
  // Update settings
  const updateThemeSettings = (newSettings) => {
    setThemeSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="App">
      {/* Include the FontLoader component */}
      <FontLoader />
      
      {/* Settings Toggle Button */}
      <button 
        className="settings-toggle-button" 
        onClick={() => setSettingsPanelOpen(true)}
        aria-label="Toggle Theme Settings"
      >
        ⚙️
      </button>
      
      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={settingsPanelOpen}
        onClose={() => setSettingsPanelOpen(false)}
        settings={themeSettings}
        onSettingsChange={updateThemeSettings}
      />
      
      {/* Main Content */}
      <div className="main-content">
        {/* Display current theme settings for debugging */}
        <div className="theme-status">
          <h3>Current Theme Settings:</h3>
          <p>WCAG Level: {themeSettings.wcag.toUpperCase()}</p>
          <p>Color Scheme: {themeSettings.colorScheme}</p>
          <p>Platform: {themeSettings.platform}</p>
          <p>Cognitive Profile: {themeSettings.cognitive}</p>
        </div>
        
        {/* ThemeButtonDemo Component */}
        <ThemeButtonDemo />
      </div>
    </div>
  );
}

export default App;