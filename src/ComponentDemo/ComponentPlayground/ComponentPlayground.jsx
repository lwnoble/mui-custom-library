import React, { useState } from 'react';
import { Typography } from '../../components/Typography'; // Named export
import Checkbox from '../../components/Checkbox'; // Default export
import Radio from '../../components/Radio'; // Default export  
import Button from '../../components/Button'; // Default export
import './ComponentPlayground.css';

/**
 * Component Playground
 * Provides the shared structure and functionality for all component playgrounds
 */
const ComponentPlayground = ({
  title,
  description,
  component: Component,
  controls,
  examples,
  generateCode,
  initialConfig = {},
  className = ''
}) => {
  const [config, setConfig] = useState(initialConfig);
  const [activeTab, setActiveTab] = useState('preview');

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const copyCode = () => {
    const code = generateCode(config);
    navigator.clipboard.writeText(code).then(() => {
      console.log('Code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className={`component-playground ${className}`}>
      <div className="playground-header">
        <Typography variant="display-small" element="h1">
          {title}
        </Typography>
        <Typography variant="body-large" element="p">
          {description}
        </Typography>
      </div>

      {/* Controls Panel */}
      <div className="controls-panel" data-surface="container">
        {controls && controls.map((section, index) => (
          <div key={index} className="control-section">
            <Typography variant="h3" element="h3">{section.title}</Typography>
            
            {section.controls && (
              <div className="controls-grid">
                {section.controls.map((control, controlIndex) => (
                  <div key={controlIndex} className="control-group">
                    <Typography variant="labels-medium" element="label">
                      {control.label}
                    </Typography>
                    
                    {control.type === 'select' && (
                      <select 
                        value={config[control.key]} 
                        onChange={(e) => updateConfig(control.key, e.target.value)}
                        className="control-select"
                      >
                        {(typeof control.options === 'function' 
                        ? control.options(config) 
                        : control.options
                        ).map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                        ))}
                      </select>
                    )}
                    
                    {control.type === 'text' && (
                      <input 
                        type="text"
                        value={config[control.key]} 
                        onChange={(e) => updateConfig(control.key, e.target.value)}
                        className="control-input"
                        placeholder={control.placeholder}
                      />
                    )}
                    
                    {control.type === 'textarea' && (
                      <textarea 
                        value={config[control.key]} 
                        onChange={(e) => updateConfig(control.key, e.target.value)}
                        className="control-textarea"
                        placeholder={control.placeholder}
                      />
                    )}
                    
                    {control.type === 'number' && (
                      <input 
                        type="number"
                        value={config[control.key]} 
                        onChange={(e) => updateConfig(control.key, e.target.value)}
                        className="control-input"
                        min={control.min}
                        max={control.max}
                        step={control.step}
                      />
                    )}
                    
                    {control.type === 'radio' && (
                      <div className="radio-group">
                        {(typeof control.options === 'function' 
                          ? control.options(config) 
                          : control.options
                        ).map(option => (
                          <label key={option.value} className="radio-option">
                            <Radio
                              checked={config[control.key] === option.value}
                              onChange={() => updateConfig(control.key, option.value)}
                              value={option.value}
                              name={control.key}
                              size="standard"
                            />
                            <Typography variant="body-medium" element="span">
                              {option.label}
                            </Typography>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {section.toggles && (
              <div className="toggle-controls">
                {section.toggles.map((toggle, toggleIndex) => (
                  <div key={toggleIndex} className="toggle-control">
                    <label 
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Checkbox 
                        checked={config[toggle.key] || false}
                        onChange={() => updateConfig(toggle.key, !config[toggle.key])}
                        size="default"
                      />
                      <Typography variant="body-medium" element="span">
                        {toggle.label}
                      </Typography>
                    </label>
                    {toggle.description && (
                      <Typography variant="body-small" element="p" className="toggle-description">
                        {toggle.description}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="demo-tabs">
        <Button
          type="text"
          variant={activeTab === 'preview' ? 'filled' : 'text'}
          size="standard"
          onClick={() => setActiveTab('preview')}
          className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
        >
          Preview
        </Button>
        <Button
          type="text" 
          variant={activeTab === 'code' ? 'filled' : 'text'}
          size="standard"
          onClick={() => setActiveTab('code')}
          className={`tab ${activeTab === 'code' ? 'active' : ''}`}
        >
          Code
        </Button>
        {examples && (
          <Button
            type="text"
            variant={activeTab === 'examples' ? 'filled' : 'text'}
            size="standard"
            onClick={() => setActiveTab('examples')}
            className={`tab ${activeTab === 'examples' ? 'active' : ''}`}
          >
            Examples
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div className="demo-content">
        {activeTab === 'preview' && (
          <div className="preview-section">
            <Typography variant="h3" element="h3">Live Preview</Typography>
            <div className="preview-container">
              <div className="component-preview">
                <Component {...config} />
              </div>
              <div className="preview-info">
                {Object.entries(config).map(([key, value]) => (
                  <Typography key={key} variant="body-small" element="p">
                    {key}: <strong>{String(value)}</strong>
                  </Typography>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="code-section">
            <div className="code-header">
              <Typography variant="h3" element="h3">Generated Code</Typography>
              <Button
                type="text"
                variant="outlined"
                size="small"
                leftIcon="copy"
                onClick={copyCode}
                className="copy-button"
              >
                Copy
              </Button>
            </div>
            <pre className="code-block">
              <code>{generateCode(config)}</code>
            </pre>
            
            <div className="import-section">
              <Typography variant="h4" element="h4">Import</Typography>
              <pre className="code-block">
                <code>{`import ${Component.name || 'Component'} from './components/${Component.name || 'Component'}/${Component.name || 'Component'}';`}</code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'examples' && examples && (
          <div className="examples-section">
            <Typography variant="h3" element="h3">Common Examples</Typography>
            
            <div className="example-grid">
              {examples.map((example, index) => (
                <div key={index} className="example-item">
                  <div className="example-preview">
                    <Component {...example.props} />
                  </div>
                  <pre className="example-code">
                    <code>{example.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentPlayground;