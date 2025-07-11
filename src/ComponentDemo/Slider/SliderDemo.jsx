import React, { useState } from 'react';
import Slider from '../../components/Slider/Slider.jsx';
import ComponentPlayground from '../ComponentPlayground/ComponentPlayground.jsx';

const SliderDemo = () => {
  // Initial configuration
  const initialConfig = {
    type: 'single', // 'single', 'range'
    size: 'default',
    orientation: 'horizontal',
    min: 0,
    max: 100,
    step: 1,
    marks: false,
    marksType: 'default', // 'default', 'custom', 'steps'
    track: 'normal',
    valueLabelDisplay: 'off',
    disabled: false,
    name: 'demo-slider',
    className: '',
    ariaLabel: 'Value slider'
  };

  // Enhanced demo component that handles Slider-specific logic
  const DemoSlider = (config) => {
    // Initialize state based on slider type
    const [singleValue, setSingleValue] = useState(30);
    const [rangeValue, setRangeValue] = useState([20, 80]);

    const isRange = config.type === 'range';
    const currentValue = isRange ? rangeValue : singleValue;

    const handleChange = (newValue, event, activeThumb) => {
      if (isRange) {
        setRangeValue(newValue);
      } else {
        setSingleValue(newValue);
      }
      console.log('Slider changed:', newValue, activeThumb !== undefined ? `(thumb ${activeThumb})` : '');
    };

    // Generate marks based on configuration
    const getMarks = () => {
      if (!config.marks) return false;
      
      switch (config.marksType) {
        case 'custom':
          return [
            { value: config.min, label: `${config.min}` },
            { value: config.min + (config.max - config.min) * 0.25, label: 'Low' },
            { value: config.min + (config.max - config.min) * 0.5, label: 'Mid' },
            { value: config.min + (config.max - config.min) * 0.75, label: 'High' },
            { value: config.max, label: `${config.max}` }
          ];
        case 'steps':
          // Generate marks at step intervals
          const marks = [];
          for (let i = config.min; i <= config.max; i += config.step * 5) {
            marks.push({ value: i, label: `${i}` });
          }
          if (marks[marks.length - 1]?.value !== config.max) {
            marks.push({ value: config.max, label: `${config.max}` });
          }
          return marks;
        default:
          return true; // Simple marks at step intervals
      }
    };

    // Get container style based on orientation
    const getContainerStyle = () => {
      const baseStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        width: '100%'
      };

      if (config.orientation === 'vertical') {
        return {
          ...baseStyle,
          minHeight: '300px',
          flexDirection: 'column'
        };
      }

      return {
        ...baseStyle,
        minHeight: '120px',
        flexDirection: 'column',
        gap: '20px'
      };
    };

    // Get slider style based on orientation
    const getSliderStyle = () => {
      if (config.orientation === 'vertical') {
        return { height: 200 };
      }
      return { width: '80%', maxWidth: '400px' };
    };

    return (
      <div style={getContainerStyle()}>
        <div style={{
          fontSize: '14px',
          color: '#666',
          textAlign: 'center',
          marginBottom: config.orientation === 'vertical' ? '16px' : '0'
        }}>
          <div style={{ fontWeight: '500', marginBottom: '4px' }}>
            {config.type === 'range' ? 'Range Slider' : 'Single Value Slider'}
            {config.orientation === 'vertical' && ' (Vertical)'}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {config.size === 'small' ? 'Small size' : 'Default size'} • 
            Range: {config.min} - {config.max} • 
            Step: {config.step}
          </div>
        </div>

        <div style={getSliderStyle()}>
          <Slider
            value={currentValue}
            onChange={handleChange}
            type={config.type}
            size={config.size}
            orientation={config.orientation}
            min={config.min}
            max={config.max}
            step={config.step}
            marks={getMarks()}
            track={config.track}
            valueLabelDisplay={config.valueLabelDisplay}
            disabled={config.disabled}
            name={config.name}
            className={config.className}
            aria-label={config.ariaLabel}
          />
        </div>

        <div style={{
          fontSize: '12px',
          color: '#888',
          textAlign: 'center',
          marginTop: config.orientation === 'vertical' ? '16px' : '8px'
        }}>
          <div>
            <strong>Current Value:</strong> {
              isRange 
                ? `[${rangeValue[0]}, ${rangeValue[1]}]` 
                : singleValue
            }
          </div>
          {config.name && (
            <div style={{ marginTop: '4px' }}>
              <strong>Form Name:</strong> {config.name}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Controls configuration
  const controls = [
    {
      title: 'Slider Type',
      controls: [
        {
          key: 'type',
          label: 'Slider Type',
          type: 'select',
          options: [
            { value: 'single', label: 'Single Value' },
            { value: 'range', label: 'Range (Two Values)' }
          ]
        },
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
          key: 'orientation',
          label: 'Orientation',
          type: 'select',
          options: [
            { value: 'horizontal', label: 'Horizontal' },
            { value: 'vertical', label: 'Vertical' }
          ]
        }
      ]
    },
    {
      title: 'Range & Steps',
      controls: [
        {
          key: 'min',
          label: 'Minimum Value',
          type: 'number',
          min: -100,
          max: 50
        },
        {
          key: 'max',
          label: 'Maximum Value',
          type: 'number',
          min: 50,
          max: 1000
        },
        {
          key: 'step',
          label: 'Step Size',
          type: 'number',
          min: 0.1,
          max: 10,
          step: 0.1
        }
      ]
    },
    {
      title: 'Visual Options',
      controls: [
        {
          key: 'track',
          label: 'Track Display',
          type: 'select',
          options: [
            { value: 'normal', label: 'Normal' },
            { value: 'inverted', label: 'Inverted' },
            { value: false, label: 'No Track' }
          ]
        },
        {
          key: 'valueLabelDisplay',
          label: 'Value Label',
          type: 'select',
          options: [
            { value: 'off', label: 'Off' },
            { value: 'auto', label: 'Auto (on drag)' },
            { value: 'on', label: 'Always On' }
          ]
        }
      ]
    },
    {
      title: 'Marks',
      toggles: [
        { key: 'marks', label: 'Show Marks' }
      ],
      controls: [
        {
          key: 'marksType',
          label: 'Marks Type',
          type: 'select',
          showWhen: (config) => config.marks,
          options: [
            { value: 'default', label: 'Default (at steps)' },
            { value: 'custom', label: 'Custom Labels' },
            { value: 'steps', label: 'Every 5 Steps' }
          ]
        }
      ]
    },
    {
      title: 'Form & Accessibility',
      controls: [
        {
          key: 'name',
          label: 'Name Attribute',
          type: 'text',
          placeholder: 'Enter name for form submission'
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
    
    // Always show value and onChange for clarity
    const valueExample = config.type === 'range' ? '[20, 80]' : '30';
    props.push(`value={${valueExample}}`);
    props.push('onChange={handleChange}');
    
    // Add non-default props
    if (config.size !== 'default') {
      props.push(`size="${config.size}"`);
    }
    
    if (config.orientation !== 'horizontal') {
      props.push(`orientation="${config.orientation}"`);
    }
    
    if (config.min !== 0) {
      props.push(`min={${config.min}}`);
    }
    
    if (config.max !== 100) {
      props.push(`max={${config.max}}`);
    }
    
    if (config.step !== 1) {
      props.push(`step={${config.step}}`);
    }
    
    if (config.marks) {
      switch (config.marksType) {
        case 'custom':
          props.push(`marks={[
    { value: ${config.min}, label: '${config.min}' },
    { value: ${Math.round(config.min + (config.max - config.min) * 0.5)}, label: 'Mid' },
    { value: ${config.max}, label: '${config.max}' }
  ]}`);
          break;
        default:
          props.push('marks');
          break;
      }
    }
    
    if (config.track !== 'normal') {
      props.push(`track={${config.track === false ? 'false' : `"${config.track}"`}}`);
    }
    
    if (config.valueLabelDisplay !== 'off') {
      props.push(`valueLabelDisplay="${config.valueLabelDisplay}"`);
    }
    
    if (config.disabled) props.push('disabled');
    
    if (config.name && config.name !== 'demo-slider') {
      props.push(`name="${config.name}"`);
    }
    
    if (config.ariaLabel && config.ariaLabel !== 'Value slider') {
      props.push(`aria-label="${config.ariaLabel}"`);
    }
    
    if (config.className) {
      props.push(`className="${config.className}"`);
    }
    
    // Add style for vertical orientation
    if (config.orientation === 'vertical') {
      props.push('sx={{ height: 200 }}');
    }
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';
    
    const stateExample = config.type === 'range' 
      ? `const [value, setValue] = useState([20, 80]);`
      : `const [value, setValue] = useState(30);`;
    
    return `// Slider with state management
${stateExample}

const handleChange = (newValue) => {
  setValue(newValue);
};

<Slider${propsString}/>`;
  };

  // Example configurations
  const examples = [
    {
      props: {
        type: 'single',
        size: 'default'
      },
      code: `const [value, setValue] = useState(30);

<Slider 
  value={value}
  onChange={setValue}
/>`
    },
    {
      props: {
        type: 'range',
        valueLabelDisplay: 'auto'
      },
      code: `const [value, setValue] = useState([20, 80]);

<Slider 
  value={value}
  onChange={setValue}
  valueLabelDisplay="auto"
/>`
    },
    {
      props: {
        type: 'single',
        size: 'small',
        marks: true,
        step: 10
      },
      code: `<Slider 
  size="small"
  value={value}
  onChange={setValue}
  step={10}
  marks
/>`
    },
    {
      props: {
        type: 'single',
        orientation: 'vertical'
      },
      code: `<Slider 
  orientation="vertical"
  value={value}
  onChange={setValue}
  sx={{ height: 200 }}
/>`
    },
    {
      props: {
        type: 'single',
        min: 0,
        max: 100,
        step: 5,
        marks: true,
        marksType: 'custom',
        valueLabelDisplay: 'on'
      },
      code: `<Slider 
  value={value}
  onChange={setValue}
  min={0}
  max={100}
  step={5}
  valueLabelDisplay="on"
  marks={[
    { value: 0, label: '0' },
    { value: 50, label: 'Mid' },
    { value: 100, label: '100' }
  ]}
/>`
    },
    {
      props: {
        type: 'range',
        track: 'inverted',
        min: -50,
        max: 50
      },
      code: `// Inverted track range slider
<Slider 
  value={[-20, 20]}
  onChange={setValue}
  track="inverted"
  min={-50}
  max={50}
/>`
    },
    {
      props: {
        type: 'single',
        track: false,
        marks: true,
        step: 25,
        disabled: true
      },
      code: `<Slider 
  value={50}
  disabled
  track={false}
  step={25}
  marks
/>`
    },
    {
      props: {
        type: 'single',
        min: 0,
        max: 10,
        step: 0.5,
        marks: true,
        marksType: 'steps',
        valueLabelDisplay: 'auto'
      },
      code: `// Precise slider with decimal steps
<Slider 
  value={7.5}
  onChange={setValue}
  min={0}
  max={10}
  step={0.5}
  marks
  valueLabelDisplay="auto"
/>`
    }
  ];

  return (
    <ComponentPlayground
      title="Slider Playground"
      description="Customize slider properties and see all variants, orientations, and configurations. Sliders can be single-value or range sliders with customizable steps, marks, and value labels. Perfect for selecting numerical values or ranges."
      component={DemoSlider}
      controls={controls}
      examples={examples}
      generateCode={generateCode}
      initialConfig={initialConfig}
    />
  );
};

export default SliderDemo;