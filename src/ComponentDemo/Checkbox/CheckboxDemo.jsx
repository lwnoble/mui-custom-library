import React, { useState } from 'react';
import Checkbox from '../../components/Checkbox'; // Default import
import ComponentPlayground from '../ComponentPlayground/ComponentPlayground.jsx';

const CheckboxDemo = () => {
  // Initial configuration
  const initialConfig = {
    size: 'default',
    checked: false,
    state: undefined,
    disabled: false,
    label: 'Accept terms and conditions'
  };

  // Enhanced demo component that handles Checkbox-specific logic
  const DemoCheckbox = (config) => {
    const [isChecked, setIsChecked] = useState(config.checked);

    const handleClick = () => {
      if (!config.disabled) {
        setIsChecked(!isChecked);
        console.log('Checkbox toggled:', !isChecked);
      }
    };

    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '60px',
        minHeight: '200px',
        width: '100%',
        gap: '12px'
      }}>
        <div 
          onClick={handleClick}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            cursor: config.disabled ? 'not-allowed' : 'pointer',
            opacity: config.disabled ? 0.6 : 1
          }}
        >
          <Checkbox
            size={config.size}
            checked={isChecked}
            state={config.state}
          />
          {config.label && (
            <label 
              style={{ 
                fontSize: config.size === 'small' ? '14px' : '16px',
                color: config.disabled ? '#9ca3af' : '#374151',
                cursor: config.disabled ? 'not-allowed' : 'pointer',
                userSelect: 'none'
              }}
            >
              {config.label}
            </label>
          )}
        </div>
      </div>
    );
  };

  // Controls configuration
  const controls = [
    {
      title: 'Checkbox Properties',
      controls: [
        {
          key: 'size',
          label: 'Size',
          type: 'select',
          options: [
            { value: 'default', label: 'Default' },
            { value: 'small', label: 'Small' }
          ]
        },
        {
          key: 'state',
          label: 'State',
          type: 'select',
          options: [
            { value: undefined, label: 'Normal' },
            { value: 'focus', label: 'Focus' }
          ]
        }
      ]
    },
    {
      title: 'Content',
      controls: [
        {
          key: 'label',
          label: 'Label Text',
          type: 'text',
          placeholder: 'Enter checkbox label'
        }
      ]
    },
    {
      title: 'States & Options',
      toggles: [
        { 
          key: 'checked', 
          label: 'Initially Checked',
          description: 'Set the initial checked state'
        },
        { 
          key: 'disabled', 
          label: 'Disabled',
          description: 'Disable checkbox interaction'
        }
      ]
    }
  ];

  // Generate code function
  const generateCode = (config) => {
    const props = [];
    
    // Add size if not default
    if (config.size !== 'default') {
      props.push(`size="${config.size}"`);
    }
    
    // Add checked state
    if (config.checked) {
      props.push('checked={true}');
    }
    
    // Add state if not normal
    if (config.state) {
      props.push(`state="${config.state}"`);
    }
    
    // Add onClick handler
    props.push('onClick={handleCheckboxChange}');
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';
    
    let jsxContent = `<Checkbox${propsString}/>`;
    
    // If there's a label, wrap in a clickable container
    if (config.label) {
      jsxContent = `<div onClick={handleCheckboxChange} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
  <Checkbox${propsString}/>
  <label style={{ cursor: 'pointer' }}>
    ${config.label}
  </label>
</div>`;
    }
    
    return jsxContent;
  };

  // Example configurations
  const examples = [
    {
      props: {
        size: 'default',
        checked: false,
        label: 'Basic checkbox'
      },
      code: `<Checkbox 
  onClick={handleCheckboxChange}
/>
<label>Basic checkbox</label>`
    },
    {
      props: {
        size: 'small',
        checked: true,
        label: 'Small checked'
      },
      code: `<Checkbox 
  size="small"
  checked={true}
  onClick={handleCheckboxChange}
/>
<label>Small checked</label>`
    },
    {
      props: {
        size: 'default',
        checked: false,
        state: 'focus',
        label: 'Focused state'
      },
      code: `<Checkbox 
  state="focus"
  onClick={handleCheckboxChange}
/>
<label>Focused state</label>`
    },
    {
      props: {
        size: 'default',
        checked: true,
        label: 'I agree to the terms and conditions'
      },
      code: `<Checkbox 
  checked={true}
  onClick={handleCheckboxChange}
/>
<label>I agree to the terms and conditions</label>`
    },
    {
      props: {
        size: 'small',
        checked: false,
        label: 'Subscribe to newsletter'
      },
      code: `<Checkbox 
  size="small"
  onClick={handleCheckboxChange}
/>
<label>Subscribe to newsletter</label>`
    },
    {
      props: {
        size: 'default',
        checked: true,
        label: 'Remember me'
      },
      code: `<Checkbox 
  checked={true}
  onClick={handleCheckboxChange}
/>
<label>Remember me</label>`
    }
  ];

  return (
    <ComponentPlayground
      title="Checkbox Playground"
      description="Customize checkbox properties and see different sizes, states, and interactive behaviors. Test with labels and various configurations for forms and user interfaces."
      component={DemoCheckbox}
      controls={controls}
      examples={examples}
      generateCode={generateCode}
      initialConfig={initialConfig}
    />
  );
};

export default CheckboxDemo;