import React, { useState } from 'react';
import Radio from '../../components/Radio/Radio.jsx';
import ComponentPlayground from '../ComponentPlayground/ComponentPlayground.jsx';

const RadioDemo = () => {
  // Initial configuration
  const initialConfig = {
    size: 'standard',
    disabled: false,
    groupType: 'options', // 'options', 'single', 'custom'
    name: 'demo-radio-group',
    className: '',
    selectedValue: 'option1'
  };

  // Enhanced demo component that handles Radio-specific logic
  const DemoRadio = (config) => {
    const [selectedValue, setSelectedValue] = useState(config.selectedValue);

    const handleChange = (value) => {
      setSelectedValue(value);
      console.log('Radio selected:', value);
    };

    // Generate radio options based on groupType
    const getRadioOptions = () => {
      switch (config.groupType) {
        case 'single':
          return [
            { value: 'single', label: 'Single Radio Option' }
          ];
        case 'custom':
          return [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'maybe', label: 'Maybe' }
          ];
        default: // 'options'
          return [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
          ];
      }
    };

    const radioOptions = getRadioOptions();

    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-start', 
        justifyContent: 'center',
        padding: '40px',
        minHeight: '120px',
        width: '100%',
        gap: '16px'
      }}>
        <div style={{ 
          fontSize: '14px', 
          color: '#666', 
          marginBottom: '8px',
          fontWeight: '500'
        }}>
          Radio Group: {config.name}
        </div>
        
        {radioOptions.map((option) => (
          <label 
            key={option.value}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              cursor: config.disabled ? 'not-allowed' : 'pointer',
              opacity: config.disabled ? 0.6 : 1
            }}
          >
            <Radio
              checked={selectedValue === option.value}
              onChange={handleChange}
              value={option.value}
              name={config.name}
              size={config.size}
              disabled={config.disabled}
              className={config.className}
              aria-label={option.label}
            />
            <span style={{ 
              fontSize: '14px',
              color: config.disabled ? '#999' : '#333'
            }}>
              {option.label}
            </span>
          </label>
        ))}
        
        <div style={{ 
          marginTop: '16px',
          fontSize: '12px', 
          color: '#888',
          fontStyle: 'italic'
        }}>
          Selected: {selectedValue || 'None'}
        </div>
      </div>
    );
  };

  // Controls configuration
  const controls = [
    {
      title: 'Radio Properties',
      controls: [
        {
          key: 'size',
          label: 'Size',
          type: 'select',
          options: [
            { value: 'standard', label: 'Standard' },
            { value: 'large', label: 'Large' }
          ]
        },
        {
          key: 'groupType',
          label: 'Group Type',
          type: 'select',
          options: [
            { value: 'options', label: 'Options (3 choices)' },
            { value: 'single', label: 'Single Radio' },
            { value: 'custom', label: 'Yes/No/Maybe' }
          ]
        },
        {
          key: 'selectedValue',
          label: 'Initially Selected',
          type: 'select',
          options: (config) => {
            switch (config.groupType) {
              case 'single':
                return [
                  { value: '', label: 'None' },
                  { value: 'single', label: 'Single' }
                ];
              case 'custom':
                return [
                  { value: '', label: 'None' },
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'maybe', label: 'Maybe' }
                ];
              default:
                return [
                  { value: '', label: 'None' },
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3' }
                ];
            }
          }
        }
      ]
    },
    {
      title: 'Configuration',
      controls: [
        {
          key: 'name',
          label: 'Group Name',
          type: 'text',
          placeholder: 'Enter radio group name (for form submission)'
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
    const getRadioOptions = () => {
      switch (config.groupType) {
        case 'single':
          return [{ value: 'single', label: 'Single Radio Option' }];
        case 'custom':
          return [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'maybe', label: 'Maybe' }
          ];
        default:
          return [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
          ];
      }
    };

    const radioOptions = getRadioOptions();
    const props = [];
    
    // Add size if not default
    if (config.size !== 'standard') {
      props.push(`size="${config.size}"`);
    }
    
    // Add disabled state
    if (config.disabled) props.push('disabled');
    
    // Add className if provided
    if (config.className) {
      props.push(`className="${config.className}"`);
    }
    
    const baseProps = [
      'onChange={handleChange}',
      `name="${config.name || 'radio-group'}"`,
      ...props
    ];
    
    const propsString = baseProps.length > 0 ? `\n      ${baseProps.join('\n      ')}` : '';
    
    // Generate the full radio group code
    const radioElements = radioOptions.map(option => {
      const checkedProp = config.selectedValue === option.value ? '\n      checked={true}' : '';
      return `    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Radio${checkedProp}
      value="${option.value}"${propsString}
      />
      <span>${option.label}</span>
    </label>`;
    }).join('\n    ');

    return `// Radio group with state management
const [selectedValue, setSelectedValue] = useState('${config.selectedValue || ''}');

const handleChange = (value) => {
  setSelectedValue(value);
};

<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
${radioElements}
</div>`;
  };

  // Example configurations
  const examples = [
    {
      props: {
        size: 'standard',
        groupType: 'options',
        selectedValue: 'option1'
      },
      code: `const [selectedValue, setSelectedValue] = useState('option1');

<Radio 
  checked={selectedValue === 'option1'}
  onChange={setSelectedValue}
  value="option1"
  name="example-group"
/>
<Radio 
  checked={selectedValue === 'option2'}
  onChange={setSelectedValue}
  value="option2"
  name="example-group"
/>`
    },
    {
      props: {
        size: 'large',
        groupType: 'custom',
        selectedValue: 'yes'
      },
      code: `<Radio 
  size="large"
  checked={selectedValue === 'yes'}
  onChange={setSelectedValue}
  value="yes"
  name="confirmation"
/>`
    },
    {
      props: {
        size: 'standard',
        disabled: true,
        groupType: 'options',
        selectedValue: 'option2'
      },
      code: `<Radio 
  checked={true}
  disabled
  value="option2"
  name="disabled-group"
/>`
    },
    {
      props: {
        size: 'large',
        groupType: 'single',
        selectedValue: ''
      },
      code: `<Radio 
  size="large"
  checked={selectedValue === 'single'}
  onChange={setSelectedValue}
  value="single"
  name="single-option"
/>`
    },
    {
      props: {
        size: 'standard',
        groupType: 'custom',
        selectedValue: 'no'
      },
      code: `// Yes/No/Maybe radio group
<Radio 
  checked={selectedValue === 'yes'}
  onChange={setSelectedValue}
  value="yes"
  name="decision"
/>
<Radio 
  checked={selectedValue === 'no'}
  onChange={setSelectedValue}
  value="no"
  name="decision"
/>
<Radio 
  checked={selectedValue === 'maybe'}
  onChange={setSelectedValue}
  value="maybe"
  name="decision"
/>`
    }
  ];

  return (
    <ComponentPlayground
      title="Radio Playground"
      description="Customize radio button properties and see different sizes, states, and grouping behaviors. Radio buttons are typically used in groups where only one option can be selected at a time."
      component={DemoRadio}
      controls={controls}
      examples={examples}
      generateCode={generateCode}
      initialConfig={initialConfig}
    />
  );
};

export default RadioDemo;