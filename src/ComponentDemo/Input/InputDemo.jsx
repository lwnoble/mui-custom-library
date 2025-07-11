import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import ComponentPlayground from '../ComponentPlayground/ComponentPlayground';

const InputDemo = () => {
  // Initial configuration
  const initialConfig = {
    type: 'text',
    variant: 'standard',
    value: '',
    placeholder: 'Enter text...',
    label: 'Input Label',
    helperText: '',
    error: false,
    required: false,
    disabled: false,
    autoFocus: false,
    name: '',
    id: '',
    autoComplete: ''
  };

  // Demo component that handles Input-specific logic
  const DemoInput = (config) => {
    const [inputValue, setInputValue] = useState(config.value);

    const handleChange = (event) => {
      setInputValue(event.target.value);
    };

    return (
      <Input
        type={config.type}
        variant={config.variant}
        value={inputValue}
        onChange={handleChange}
        placeholder={config.placeholder}
        label={config.label}
        helperText={config.helperText}
        error={config.error}
        required={config.required}
        disabled={config.disabled}
        autoFocus={config.autoFocus}
        name={config.name || undefined}
        id={config.id || undefined}
        autoComplete={config.autoComplete || undefined}
      />
    );
  };

  // Controls configuration
  const controls = [
    {
      title: 'Basic Properties',
      controls: [
        {
          key: 'type',
          label: 'Input Type',
          type: 'select',
          options: [
            { value: 'text', label: 'Text' },
            { value: 'number', label: 'Number' },
            { value: 'currency', label: 'Currency' },
            { value: 'percentage', label: 'Percentage' },
            { value: 'pixels', label: 'Pixels' },
            { value: 'email', label: 'Email' },
            { value: 'color', label: 'Color' }
          ]
        },
        {
          key: 'variant',
          label: 'Variant',
          type: 'select',
          options: [
            { value: 'standard', label: 'Standard' },
            { value: 'floating', label: 'Floating Label' }
          ]
        },
        {
          key: 'label',
          label: 'Label Text',
          type: 'text',
          placeholder: 'Enter label text'
        },
        {
          key: 'placeholder',
          label: 'Placeholder',
          type: 'text',
          placeholder: 'Enter placeholder text'
        }
      ]
    },
    {
      title: 'Content',
      controls: [
        {
          key: 'value',
          label: 'Initial Value',
          type: 'text',
          placeholder: 'Enter initial value'
        },
        {
          key: 'helperText',
          label: 'Helper Text',
          type: 'text',
          placeholder: 'Enter helper text'
        }
      ]
    },
    {
      title: 'States',
      toggles: [
        { key: 'error', label: 'Error State' },
        { key: 'required', label: 'Required' },
        { key: 'disabled', label: 'Disabled' },
        { key: 'autoFocus', label: 'Auto Focus' }
      ]
    },
    {
      title: 'Attributes',
      controls: [
        {
          key: 'name',
          label: 'Name Attribute',
          type: 'text',
          placeholder: 'Enter name attribute'
        },
        {
          key: 'id',
          label: 'ID Attribute',
          type: 'text',
          placeholder: 'Enter id attribute'
        },
        {
          key: 'autoComplete',
          label: 'Auto Complete',
          type: 'select',
          options: [
            { value: '', label: 'None' },
            { value: 'off', label: 'Off' },
            { value: 'on', label: 'On' },
            { value: 'name', label: 'Name' },
            { value: 'email', label: 'Email' },
            { value: 'username', label: 'Username' },
            { value: 'current-password', label: 'Current Password' },
            { value: 'new-password', label: 'New Password' },
            { value: 'tel', label: 'Phone' },
            { value: 'address-line1', label: 'Address Line 1' },
            { value: 'address-line2', label: 'Address Line 2' },
            { value: 'postal-code', label: 'Postal Code' },
            { value: 'country', label: 'Country' }
          ]
        }
      ]
    }
  ];

  // Generate code function
  const generateCode = (config) => {
    const props = [];
    
    // Add type if not default
    if (config.type !== 'text') {
      props.push(`type="${config.type}"`);
    }
    
    // Add variant if not default
    if (config.variant !== 'standard') {
      props.push(`variant="${config.variant}"`);
    }
    
    // Add value if provided
    if (config.value) {
      props.push(`value={inputValue}`);
    }
    
    // Add onChange handler
    props.push('onChange={handleChange}');
    
    // Add placeholder if provided
    if (config.placeholder && config.placeholder !== 'Enter text...') {
      props.push(`placeholder="${config.placeholder}"`);
    }
    
    // Add label if provided
    if (config.label && config.label !== 'Input Label') {
      props.push(`label="${config.label}"`);
    }
    
    // Add helper text if provided
    if (config.helperText) {
      props.push(`helperText="${config.helperText}"`);
    }
    
    // Add boolean props only if they're true
    if (config.error) props.push('error');
    if (config.required) props.push('required');
    if (config.disabled) props.push('disabled');
    if (config.autoFocus) props.push('autoFocus');
    
    // Add attributes if provided
    if (config.name) props.push(`name="${config.name}"`);
    if (config.id) props.push(`id="${config.id}"`);
    if (config.autoComplete) props.push(`autoComplete="${config.autoComplete}"`);
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';
    
    return `<Input${propsString}/>`;
  };

  // Example configurations
  const examples = [
    {
      props: {
        type: 'text',
        variant: 'standard',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true
      },
      code: `<Input
  type="text"
  variant="standard"
  label="Full Name"
  placeholder="Enter your full name"
  required
/>`
    },
    {
      props: {
        type: 'email',
        variant: 'floating',
        label: 'Email Address',
        required: true,
        autoComplete: 'email'
      },
      code: `<Input
  type="email"
  variant="floating"
  label="Email Address"
  required
  autoComplete="email"
/>`
    },
    {
      props: {
        type: 'currency',
        variant: 'standard',
        label: 'Price',
        placeholder: '0.00',
        helperText: 'Enter amount in USD'
      },
      code: `<Input
  type="currency"
  variant="standard"
  label="Price"
  placeholder="0.00"
  helperText="Enter amount in USD"
/>`
    },
    {
      props: {
        type: 'percentage',
        variant: 'floating',
        label: 'Discount Rate',
        helperText: 'Enter percentage without % symbol'
      },
      code: `<Input
  type="percentage"
  variant="floating"
  label="Discount Rate"
  helperText="Enter percentage without % symbol"
/>`
    },
    {
      props: {
        type: 'email',
        variant: 'standard',
        label: 'Email',
        error: true,
        helperText: 'Please enter a valid email address'
      },
      code: `<Input
  type="email"
  variant="standard"
  label="Email"
  error
  helperText="Please enter a valid email address"
/>`
    },
    {
      props: {
        type: 'color',
        variant: 'standard',
        label: 'Brand Color',
        value: '#3b82f6'
      },
      code: `<Input
  type="color"
  variant="standard"
  label="Brand Color"
  value="#3b82f6"
/>`
    }
  ];

  return (
    <ComponentPlayground
      title="Input Playground"
      description="Customize the input properties and see the live preview with generated code. Test different input types, variants, and states."
      component={DemoInput}
      controls={controls}
      examples={examples}
      generateCode={generateCode}
      initialConfig={initialConfig}
    />
  );
};

export default InputDemo;