import React, { useState } from 'react';
import Switch from '../../components/Switch/Switch.jsx';
import ComponentPlayground from '../ComponentPlayground/ComponentPlayground.jsx';

const SwitchDemo = () => {
  // Initial configuration
  const initialConfig = {
    variant: 'small',
    checked: false,
    disabled: false,
    name: 'demo-switch',
    value: 'switch-value',
    className: '',
    ariaLabel: 'Toggle switch'
  };

  // Enhanced demo component that handles Switch-specific logic
  const DemoSwitch = (config) => {
    const [isChecked, setIsChecked] = useState(config.checked);

    const handleChange = (checked) => {
      setIsChecked(checked);
      console.log('Switch toggled:', checked ? 'ON' : 'OFF');
    };

    // Get variant description for display
    const getVariantDescription = () => {
      switch (config.variant) {
        case 'small': return 'Small - Compact switch for tight spaces';
        case 'large': return 'Large - Standard size switch';
        case 'icon': return 'Icon - Shows check/times icons in thumb';
        case 'ios': return 'iOS - Apple-style switch design';
        case 'android': return 'Android - Material Design switch';
        default: return '';
      }
    };

    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px',
        minHeight: '120px',
        width: '100%',
        gap: '16px'
      }}>
        <div style={{ 
          fontSize: '14px', 
          color: '#666', 
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          <div style={{ fontWeight: '500', marginBottom: '4px' }}>
            {config.variant.charAt(0).toUpperCase() + config.variant.slice(1)} Variant
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {getVariantDescription()}
          </div>
        </div>
        
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          cursor: config.disabled ? 'not-allowed' : 'pointer',
          opacity: config.disabled ? 0.6 : 1
        }}>
          <span style={{ 
            fontSize: '14px',
            color: config.disabled ? '#999' : '#333',
            minWidth: '30px',
            textAlign: 'right'
          }}>
            {isChecked ? 'ON' : 'OFF'}
          </span>
          
          <Switch
            checked={isChecked}
            onChange={handleChange}
            variant={config.variant}
            disabled={config.disabled}
            name={config.name}
            value={config.value}
            className={config.className}
            aria-label={config.ariaLabel}
          />
          
          <span style={{ 
            fontSize: '14px',
            color: config.disabled ? '#999' : '#333',
            fontWeight: '500'
          }}>
            Toggle Me
          </span>
        </label>
        
        <div style={{ 
          marginTop: '8px',
          fontSize: '12px', 
          color: '#888',
          textAlign: 'center'
        }}>
          <div>Current State: <strong>{isChecked ? 'Checked' : 'Unchecked'}</strong></div>
          <div style={{ marginTop: '4px' }}>
            Form Value: "{config.name}" = {isChecked ? config.value || 'true' : 'false'}
          </div>
        </div>
      </div>
    );
  };

  // Controls configuration
  const controls = [
    {
      title: 'Switch Properties',
      controls: [
        {
          key: 'variant',
          label: 'Variant',
          type: 'select',
          options: [
            { value: 'small', label: 'Small' },
            { value: 'large', label: 'Large' },
            { value: 'icon', label: 'Icon (with check/times)' },
            { value: 'ios', label: 'iOS Style' },
            { value: 'android', label: 'Android Style' }
          ]
        },
        {
          key: 'checked',
          label: 'Initial State',
          type: 'select',
          options: [
            { value: false, label: 'Off (unchecked)' },
            { value: true, label: 'On (checked)' }
          ]
        }
      ]
    },
    {
      title: 'Form Configuration',
      controls: [
        {
          key: 'name',
          label: 'Name Attribute',
          type: 'text',
          placeholder: 'Enter name for form submission'
        },
        {
          key: 'value',
          label: 'Value Attribute',
          type: 'text',
          placeholder: 'Enter value when checked'
        },
        {
          key: 'ariaLabel',
          label: 'Aria Label',
          type: 'text',
          placeholder: 'Enter accessible label for screen readers'
        },
        {
          key: 'className',
          label: 'Additional CSS Classes',
          type: 'text',
          placeholder: 'Enter additional CSS classes'
        }
      ]
    },
    {
      title: 'States',
      toggles: [
        { key: 'disabled', label: 'Disabled' }
      ]
    }
  ];

  // Generate code function
  const generateCode = (config) => {
    const props = [];
    
    // Add variant if not default
    if (config.variant !== 'small') {
      props.push(`variant="${config.variant}"`);
    }
    
    // Always show checked and onChange for clarity
    props.push('checked={isChecked}');
    props.push('onChange={setIsChecked}');
    
    // Add form attributes if provided
    if (config.name && config.name !== 'demo-switch') {
      props.push(`name="${config.name}"`);
    }
    
    if (config.value && config.value !== 'switch-value') {
      props.push(`value="${config.value}"`);
    }
    
    if (config.ariaLabel && config.ariaLabel !== 'Toggle switch') {
      props.push(`aria-label="${config.ariaLabel}"`);
    }
    
    // Add disabled state
    if (config.disabled) props.push('disabled');
    
    // Add className if provided
    if (config.className) {
      props.push(`className="${config.className}"`);
    }
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';
    
    return `// Switch with state management
const [isChecked, setIsChecked] = useState(${config.checked});

<Switch${propsString}/>`;
  };

  // Example configurations
  const examples = [
    {
      props: {
        variant: 'small',
        checked: false
      },
      code: `const [isChecked, setIsChecked] = useState(false);

<Switch 
  checked={isChecked}
  onChange={setIsChecked}
/>`
    },
    {
      props: {
        variant: 'large',
        checked: true
      },
      code: `<Switch 
  variant="large"
  checked={isChecked}
  onChange={setIsChecked}
/>`
    },
    {
      props: {
        variant: 'icon',
        checked: false
      },
      code: `<Switch 
  variant="icon"
  checked={isChecked}
  onChange={setIsChecked}
/>`
    },
    {
      props: {
        variant: 'ios',
        checked: true
      },
      code: `<Switch 
  variant="ios"
  checked={isChecked}
  onChange={setIsChecked}
/>`
    },
    {
      props: {
        variant: 'android',
        checked: false
      },
      code: `<Switch 
  variant="android"
  checked={isChecked}
  onChange={setIsChecked}
/>`
    },
    {
      props: {
        variant: 'large',
        disabled: true,
        checked: true
      },
      code: `<Switch 
  variant="large"
  checked={true}
  disabled
  onChange={setIsChecked}
/>`
    },
    {
      props: {
        variant: 'small',
        name: 'notifications',
        value: 'enabled',
        ariaLabel: 'Enable notifications',
        checked: false
      },
      code: `// Form-ready switch with proper attributes
<Switch 
  checked={isChecked}
  onChange={setIsChecked}
  name="notifications"
  value="enabled"
  aria-label="Enable notifications"
/>`
    },
    {
      props: {
        variant: 'icon',
        name: 'darkMode',
        value: 'on',
        checked: true
      },
      code: `// Dark mode toggle with icon variant
<Switch 
  variant="icon"
  checked={isDarkMode}
  onChange={setIsDarkMode}
  name="darkMode"
  value="on"
/>`
    }
  ];

  return (
    <ComponentPlayground
      title="Switch Playground"
      description="Customize switch properties and see all variants, sizes, and states. Switches are toggle controls for binary settings like on/off, enabled/disabled, or true/false states. The icon variant displays check/times icons for clearer visual feedback."
      component={DemoSwitch}
      controls={controls}
      examples={examples}
      generateCode={generateCode}
      initialConfig={initialConfig}
    />
  );
};

export default SwitchDemo;