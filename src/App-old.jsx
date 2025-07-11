import React, { useState, useEffect, useCallback } from 'react';
import SettingsPanel from './components/SettingsPanel';
import LeftNavigation from './components/LeftNavigation/LeftNavigation.jsx';
import Button from './components/Button/Button.jsx';
import ButtonDemo from './ComponentDemo/Button/ButtonDemo.jsx';
import CardDemo from './ComponentDemo/Card/CardDemo.jsx';
//import IconDemo from './ComponentDemo/Icon/IconDemo.jsx';
import InputDemo from './ComponentDemo/Input/InputDemo.jsx';
import CheckboxDemo from './ComponentDemo/Checkbox/CheckboxDemo.jsx';
import RadioDemo from './ComponentDemo/Radio/RadioDemo.jsx';
import SwitchDemo from './ComponentDemo/Switch/SwitchDemo.jsx';
import SliderDemo from './ComponentDemo/Slider/SliderDemo.jsx';
// import FormElementDemo from './ComponentDemo/FormElement/FormElementsDemo.jsx';
//import MenuItemDemo from './ComponentDemo/MenuItem/MenuItemDemo';
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
    
    // Apply data-spacing attribute to the document element
    const spacingMap = {
      'default': '',
      'standard': 'standard',
      'expanded': 'expanded',
      'reduced': 'reduced'
    };
    
    const dataSpacingValue = spacingMap[themeSettings.spacing] || '';
    
    if (dataSpacingValue === '') {
      document.documentElement.removeAttribute('data-spacing');
    } else {
      document.documentElement.setAttribute('data-spacing', dataSpacingValue);
    }
    
    // Save user preferences
    try {
      localStorage.setItem('userThemePreferences', JSON.stringify(themeSettings));
    } catch (e) {
      console.error('Error saving preferences:', e);
    }
  }, [themeSettings]);
  
  // Update settings - handle both regular settings and dataSpacing
  const updateThemeSettings = (newSettings) => {
    setThemeSettings(prev => {
      const updatedSettings = { ...prev, ...newSettings };
      
      // Handle dataSpacing if provided (but don't store it)
      if (newSettings.dataSpacing !== undefined) {
        // Apply the data-spacing attribute immediately
        if (newSettings.dataSpacing === '') {
          document.documentElement.removeAttribute('data-spacing');
        } else {
          document.documentElement.setAttribute('data-spacing', newSettings.dataSpacing);
        }
        
        // Remove dataSpacing from the settings object since we don't want to store it
        const { dataSpacing, ...settingsToStore } = updatedSettings;
        return settingsToStore;
      }
      
      return updatedSettings;
    });
  };

  // Handle settings button click
  const handleSettingsClick = () => {
    setSettingsPanelOpen(true);
  };

  // Generate data attributes for background and surface
  const getMainContentDataAttributes = () => {
    const attributes = {};
    
    // Add background data attribute if not default
    if (themeSettings.background && themeSettings.background !== 'default') {
      attributes['data-background'] = themeSettings.background;
    }
    
    // Add surface data attribute
    if (themeSettings.surface) {
      attributes['data-surface'] = themeSettings.surface;
    }
    
    return attributes;
  };

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
      case 'typography':
        return <TypographyDemo />;
      // case 'form':
        //r eturn <FormElementDemo />;
      //case 'icon':
        //return <IconDemo />;
      case 'checkbox':
        return <CheckboxDemo />;
      //case 'menu-item':
        //return <MenuItemDemo />;    
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
      {/* Include the FontLoader component */}
      <FontLoader />
      
      {/* Left Navigation */}
      <LeftNavigation 
        activeComponent={activeComponent}
        onComponentChange={setActiveComponent}
        isCollapsed={navCollapsed}
        onToggleCollapse={() => setNavCollapsed(!navCollapsed)}
        onSettings={handleSettingsClick}
      />
      
      {/* Settings Toggle Button */}
      <Button
        type="icon-only"
        variant="text"
        size="small"
        leftIcon="gear"
        onClick={handleSettingsClick}
        aria-label="Toggle Theme Settings"
        className="settings-toggle-button"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: '1000'
        }}
      />
      
      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={settingsPanelOpen}
        onClose={() => setSettingsPanelOpen(false)}
        settings={themeSettings}
        onSettingsChange={updateThemeSettings}
      />
      
      {/* Main Content */}
      <div 
        className="main-content" 
        {...getMainContentDataAttributes()}
        style={{
          marginLeft: navCollapsed ? '60px' : '250px',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          padding: '20px'
        }}
      >
        
        {/* Active Component */}
        {renderActiveComponent()}
      </div>
    </div>
  );
}

export default App;