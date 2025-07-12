import React from 'react';
import Button from './Button';
import './SettingsPanel.css';

function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }) {
  // Reset to system defaults function
  const resetToDefaults = () => {
    // Clear stored preferences
    try {
      localStorage.removeItem('userThemePreferences');
    } catch (e) {
      console.error('Error clearing preferences:', e);
    }
    
    // Reset to system defaults - detect platform and color scheme
    const detectPlatform = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      if (isMobile) {
        if (/Android/i.test(navigator.userAgent)) return 'android';
        if (/iPad/i.test(navigator.userAgent)) return 'ios-tablet';
        if (/iPhone|iPod/i.test(navigator.userAgent)) return 'ios-mobile';
      }
      
      return 'desktop';
    };
    
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    onSettingsChange({
      wcag: 'aa',
      colorScheme: prefersDarkMode ? 'dark' : 'light',
      platform: detectPlatform(),
      cognitive: 'none',
      spacing: 'default',
      background: 'default',
      surface: 'surface',
      reader: 'default'
    });
  };

  // Handle spacing change with proper mapping
  const handleSpacingChange = (spacingValue) => {
    onSettingsChange({ spacing: spacingValue });
  };

  // Background color options
  const backgroundOptions = [
    { value: 'default', label: 'Default' },
    { value: 'primary', label: 'Primary' },
    { value: 'primary-light', label: 'Primary Light' },
    { value: 'primary-dark', label: 'Primary Dark' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'secondary-light', label: 'Secondary Light' },
    { value: 'secondary-dark', label: 'Secondary Dark' },
    { value: 'tertiary', label: 'Tertiary' },
    { value: 'tertiary-light', label: 'Tertiary Light' },
    { value: 'tertiary-dark', label: 'Tertiary Dark' },
    { value: 'white', label: 'White' },
    { value: 'black', label: 'Black' },
    { value: 'grey', label: 'Grey' }
  ];

  // Surface type options
  const surfaceOptions = [
    { value: 'surface', label: 'Surface' },
    { value: 'surface-dim', label: 'Surface Dim' },
    { value: 'surface-bright', label: 'Surface Bright' },
    { value: 'container', label: 'Container' },
    { value: 'container-low', label: 'Container Low' },
    { value: 'container-lowest', label: 'Container Lowest' },
    { value: 'container-high', label: 'Container High' },
    { value: 'container-highest', label: 'Container Highest' }
  ];

  // Reader mode options
  const readerOptions = [
    { value: 'default', label: 'Default' },
    { value: 'enhanced', label: 'Enhanced' },
    { value: 'focus', label: 'Focus Mode' },
    { value: 'night', label: 'Night Reading' },
    { value: 'high-contrast', label: 'High Contrast' }
  ];

  return (
    <div data-surface="surface-bright" className={`settings-panel ${isOpen ? 'open' : ''}`}>
      <div className="settings-panel-content">
        <div className="settings-header">
          <h2>Theme Settings</h2>
          <Button 
            type="icon-only" 
            leftIcon="times" 
            variant="text" 
            size="small"
            className="close-button" 
            onClick={onClose}
          />
        </div>

        <div className="settings-section">
          <h3>WCAG Settings</h3>
          
          <div className="setting-group">
            <label>WCAG Level</label>
            <div className="toggle-group">
              <Button 
                variant={settings.wcag === 'aa' ? 'solid' : 'outline'}
                size="small"
                onClick={() => onSettingsChange({ wcag: 'aa' })}
              >
                AA
              </Button>
              <Button 
                variant={settings.wcag === 'aaa' ? 'solid' : 'outline'}
                size="small"
                onClick={() => onSettingsChange({ wcag: 'aaa' })}
              >
                AAA
              </Button>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Device Settings</h3>
          
          <div className="setting-group">
            <label>WCAG Level</label>
            <div className="toggle-group">
              <Button 
                variant={settings.wcag === 'aa' ? 'solid' : 'outline'}
                size="small"
                onClick={() => onSettingsChange({ wcag: 'aa' })}
              >
                AA
              </Button>
              <Button 
                variant={settings.wcag === 'aaa' ? 'solid' : 'outline'}
                size="small"
                onClick={() => onSettingsChange({ wcag: 'aaa' })}
              >
                AAA
              </Button>
            </div>
          </div>
          
          <div className="setting-group">
            <label>Color Mode</label>
            <div className="toggle-group">
              <Button 
                variant={settings.colorScheme === 'light' ? 'solid' : 'outline'}
                size="small"
                onClick={() => onSettingsChange({ colorScheme: 'light' })}
              >
                Light
              </Button>
              <Button 
                variant={settings.colorScheme === 'dark' ? 'solid' : 'outline'}
                size="small"
                onClick={() => onSettingsChange({ colorScheme: 'dark' })}
              >
                Dark
              </Button>
            </div>
          </div>
          
          <div className="setting-group">
            <label>Platform</label>
            <div className="select-wrapper">
              <select 
                value={settings.platform}
                onChange={(e) => onSettingsChange({ platform: e.target.value })}
              >
                <option value="desktop">Desktop</option>
                <option value="android">Android</option>
                <option value="ios-mobile">iOS Mobile</option>
                <option value="ios-tablet">iOS Tablet</option>
              </select>
            </div>
          </div>
        </div>

        
        <div className="settings-section">
          <h3>Component Settings</h3>

          <div className="setting-group">
            <label>Background Color</label>
            <div className="select-wrapper">
              <select 
                value={settings.background || 'default'}
                onChange={(e) => onSettingsChange({ background: e.target.value })}
              >
                {backgroundOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="setting-group">
            <label>Surface Type</label>
            <div className="select-wrapper">
              <select 
                value={settings.surface || 'surface'}
                onChange={(e) => onSettingsChange({ surface: e.target.value })}
              >
                {surfaceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>End User Settings</h3>
          
          <div className="setting-group">
            <label>Cognitive</label>
            <div className="select-wrapper">
              <select 
                value={settings.cognitive}
                onChange={(e) => onSettingsChange({ cognitive: e.target.value })}
              >
                <option value="none">None</option>
                <option value="adhd">ADHD</option>
                <option value="dyslexia">Dyslexia</option>
              </select>
            </div>
          </div>
          
          <div className="setting-group">
            <label>Spacing</label>
            <div className="select-wrapper">
              <select 
                value={settings.spacing}
                onChange={(e) => handleSpacingChange(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="standard">Standard</option>
                <option value="expanded">Expanded</option>
                <option value="reduced">Reduced</option>
              </select>
            </div>
          </div>

          <div className="setting-group">
            <label>Reader Mode</label>
            <div className="select-wrapper">
              <select 
                value={settings.reader || 'default'}
                onChange={(e) => onSettingsChange({ reader: e.target.value })}
              >
                {readerOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="settings-actions">
          <Button 
            variant="outline"
            onClick={resetToDefaults}
          >
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;