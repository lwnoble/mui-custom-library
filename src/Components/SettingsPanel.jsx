import React from 'react';
import './SettingsPanel.css';

function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }) {
  // Reset to system defaults function
  const resetToDefaults = () => {
    // Clear stored preferences
    localStorage.removeItem('userThemePreferences');
    
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
      background: ''
    });
  };

  return (
    <div className={`settings-panel ${isOpen ? 'open' : ''}`}>
      <div className="settings-panel-content">
        <div className="settings-header">
          <h2>Theme Settings</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-section">
          <h3>Testing Mode Settings</h3>
          
          <div className="setting-group">
            <label>WCAG Level</label>
            <div className="toggle-group">
              <button 
                className={`toggle-button ${settings.wcag === 'aa' ? 'active' : ''}`}
                onClick={() => onSettingsChange({ wcag: 'aa' })}
              >
                AA
              </button>
              <button 
                className={`toggle-button ${settings.wcag === 'aaa' ? 'active' : ''}`}
                onClick={() => onSettingsChange({ wcag: 'aaa' })}
              >
                AAA
              </button>
            </div>
          </div>
          
          <div className="setting-group">
            <label>Color Mode</label>
            <div className="toggle-group">
              <button 
                className={`toggle-button ${settings.colorScheme === 'light' ? 'active' : ''}`}
                onClick={() => onSettingsChange({ colorScheme: 'light' })}
              >
                Light
              </button>
              <button 
                className={`toggle-button ${settings.colorScheme === 'dark' ? 'active' : ''}`}
                onClick={() => onSettingsChange({ colorScheme: 'dark' })}
              >
                Dark
              </button>
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
                <option value="dyslexic">Dyslexic</option>
              </select>
            </div>
          </div>
          
          <div className="setting-group">
            <label>Spacing</label>
            <div className="select-wrapper">
              <select 
                value={settings.spacing}
                onChange={(e) => onSettingsChange({ spacing: e.target.value })}
              >
                <option value="default">Default</option>
                <option value="standard">Standard</option>
                <option value="extended">Extended</option>
                <option value="reduced">Reduced</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="settings-actions">
          <button 
            className="reset-button"
            onClick={resetToDefaults}
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;