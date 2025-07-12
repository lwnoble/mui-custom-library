import React, { useState, useEffect, useCallback } from 'react';
import SettingsPanel from './components/SettingsPanel';
import LeftNavigation from './components/LeftNavigation/LeftNavigation.jsx';
import Button from './components/Button/Button.jsx';
import ButtonDemo from './ComponentDemo/Button/ButtonDemo.jsx';
import CardDemo from './ComponentDemo/Card/CardDemo.jsx';
import IconDemo from './ComponentDemo/Icon/IconDemo.jsx';
import InputDemo from './ComponentDemo/Input/InputDemo.jsx';
import CheckboxDemo from './ComponentDemo/Checkbox/CheckboxDemo.jsx';
import RadioDemo from './ComponentDemo/Radio/RadioDemo.jsx';
import SwitchDemo from './ComponentDemo/Switch/SwitchDemo.jsx';
import SliderDemo from './ComponentDemo/Slider/SliderDemo.jsx';
// import FormElementDemo from './ComponentDemo/FormElement/FormElementsDemo.jsx';
import MenuDemo from './ComponentDemo/MenuItem/MenuItemDemo';
import StateMessageDemo from './ComponentDemo/StateMessage/StateMessageDemo.jsx';
import AvatarDemo from './ComponentDemo/Avatar/AvatarDemo.jsx';
import BadgeDemo from './ComponentDemo/Badge/BadgeDemo.jsx';
import TypographyDemo from './ComponentDemo/Typography/TypographyDemo.jsx';

import loadTheme from './utils/loadTheme';
import FontLoader from './components/FontLoader';
import './App.css';

function App() {
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState('button');
  const [navCollapsed, setNavCollapsed] = useState(false);
  
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
    background: 'default',
    surface: 'surface',
    spacing: 'default',
    reader: 'default',
  });
  
  // Load stored preferences or initialize with system defaults
  useEffect(() => {
    let storedSettings = null;
    try {
      const stored = localStorage.getItem('userThemePreferences');
      if (stored) storedSettings = JSON.parse(stored);
    } catch (e) {
      console.error('Error reading stored preferences:', e);
    }
    
    if (storedSettings) {
      setThemeSettings(prev => ({
        ...prev,
        ...storedSettings
      }));
    } else {
      setThemeSettings(prev => ({
        ...prev,
        colorScheme: detectColorScheme(),
        platform: detectPlatform()
      }));
    }
    
    const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const handleColorSchemeChange = (e) => {
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
    
    // Load theme - this handles all data attributes and CSS loading
    loadTheme(themeSettings);
    
    // Save to localStorage
    try {
      localStorage.setItem('userThemePreferences', JSON.stringify(themeSettings));
    } catch (e) {
      console.error('Error saving preferences:', e);
    }
  }, [themeSettings]);
  
  // Update settings
  const updateThemeSettings = (newSettings) => {
    setThemeSettings(prev => {
      const updatedSettings = { ...prev, ...newSettings };
      
      // Handle special dataSpacing case if present
      if (newSettings.dataSpacing !== undefined) {
        // Remove dataSpacing from the settings object before storing
        const { dataSpacing, ...settingsToStore } = updatedSettings;
        return settingsToStore;
      }
      
      return updatedSettings;
    });
  };

  // Handle settings button click with debugging
  const handleSettingsClick = () => {
    console.log('Settings button clicked! Current state:', settingsPanelOpen);
    setSettingsPanelOpen(true);
    console.log('Settings panel should now be open');
  };

  // Generate data attributes for main content - removed since loadTheme handles this
  // The loadTheme function now updates both html element and main-content-container

  // Render the active component
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'avatar':
        return <AvatarDemo />;
      case 'badge':
        return <BadgeDemo />;  
      case 'button':
        return <ButtonDemo />;
      case 'card':
        return <CardDemo />;
      case 'icon':
        return <IconDemo />;
      case 'menu-item':
          return <MenuDemo />;  
      case 'typography':
        return <TypographyDemo />;
      case 'checkbox':
        return <CheckboxDemo />;
      case 'radio':
        return <RadioDemo />;
      case 'switch':
        return <SwitchDemo />;    
      case 'slider':
        return <SliderDemo />;        
      case 'state-message':
        return <StateMessageDemo />;           
      case 'input':
        return <InputDemo />;
      case 'colors':
        return <div className="component-placeholder">Colors Component - Coming Soon</div>;
      default:
        return <ButtonDemo />;
    }
  };

  return (
    <div className="App" id="dds">
      <FontLoader />
      
      {/* App Container with Flexbox Layout */}
      <div className="app-container">
        {/* Left Navigation */}
        <LeftNavigation 
          activeComponent={activeComponent}
          onComponentChange={setActiveComponent}
          isCollapsed={navCollapsed}
          onToggleCollapse={() => setNavCollapsed(!navCollapsed)}
          onSettings={handleSettingsClick}
        />
        
        {/* Main Content Container - data attributes handled by loadTheme */}
        <div className="main-content-container">
          {/* Settings Toggle Button */}
          <Button
            type="icon-only"
            variant="text"
            size="small"
            leftIcon="gear"
            onClick={handleSettingsClick}
            aria-label="Toggle Theme Settings"
            className="settings-toggle-button"
          />
          
          {/* Active Component */}
          <div className="component-content">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
      
      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={settingsPanelOpen}
        onClose={() => setSettingsPanelOpen(false)}
        settings={themeSettings}
        onSettingsChange={updateThemeSettings}
      />
    </div>
  );
}

export default App;