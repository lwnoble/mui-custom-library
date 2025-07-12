import React, { useState } from 'react';
import Icon from '../../components/Icon/Icon.jsx';
import ComponentPlayground from '../ComponentPlayground/ComponentPlayground.jsx';

const IconDemo = () => {
  // Initial configuration
  const initialConfig = {
    name: 'star',
    size: 'medium',
    style: 'solid',
    variant: 'default',
    disabled: false,
    className: ''
  };

  // Enhanced demo component that handles Icon-specific logic
  const DemoIcon = (config) => {
    const handleClick = () => {
      console.log('Icon clicked!');
    };

    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px',
        minHeight: '120px',
        width: '100%'
      }}>
        <Icon
          name={config.name}
          size={config.size}
          style={config.style}
          variant={config.variant}
          disabled={config.disabled}
          onClick={handleClick}
          className={config.className}
        />
      </div>
    );
  };

  // Controls configuration
  const controls = [
    {
      title: 'Icon Properties',
      controls: [
        {
          key: 'name',
          label: 'Icon Name',
          type: 'text',
          placeholder: 'Enter Font Awesome icon name (e.g., star, heart, user)'
        },
        {
          key: 'size',
          label: 'Size',
          type: 'select',
          options: [
            { value: 'extra-small', label: 'Extra Small' },
            { value: 'xs', label: 'XS' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
            { value: 'extra-large', label: 'Extra Large' },
            { value: 'xl', label: 'XL' },
            { value: 'extra-extra-large', label: 'Extra Extra Large' },
            { value: 'xxl', label: 'XXL' }
          ]
        },
        {
          key: 'style',
          label: 'Font Awesome Style',
          type: 'select',
          options: [
            { value: 'solid', label: 'Solid (fas)' },
            { value: 'regular', label: 'Regular (far)' },
            { value: 'light', label: 'Light (fal) - Pro only' },
            { value: 'thin', label: 'Thin (fat) - Pro only' },
            { value: 'duotone', label: 'Duotone (fad) - Pro only' },
            { value: 'brands', label: 'Brands (fab)' }
          ]
        },
        {
          key: 'variant',
          label: 'Color Variant',
          type: 'select',
          options: [
            { value: 'default', label: 'Default' },
            { value: 'quiet', label: 'Quiet' },
            { value: 'error', label: 'Error' },
            { value: 'warning', label: 'Warning' },
            { value: 'success', label: 'Success' },
            { value: 'info', label: 'Info' },
            { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' },
            { value: 'tertiary', label: 'Tertiary' },
            { value: 'on-button', label: 'On Button' }
          ]
        }
      ]
    },
    {
      title: 'Additional Options',
      controls: [
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
        { 
          key: 'disabled', 
          label: 'Disabled',
          description: 'Makes the icon non-interactive and visually disabled'
        }
      ]
    }
  ];

  // Generate code function
  const generateCode = (config) => {
    const props = [];
    
    // Always include name as it's required
    props.push(`name="${config.name}"`);
    
    // Add size if not default
    if (config.size !== 'medium') {
      props.push(`size="${config.size}"`);
    }
    
    // Add style if not default
    if (config.style !== 'solid') {
      props.push(`style="${config.style}"`);
    }
    
    // Add variant if not default
    if (config.variant !== 'default') {
      props.push(`variant="${config.variant}"`);
    }
    
    // Add disabled if true
    if (config.disabled) {
      props.push('disabled');
    }
    
    // Add click handler (always interactive in demo)
    props.push('onClick={handleClick}');
    
    // Add className if provided
    if (config.className) {
      props.push(`className="${config.className}"`);
    }
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';
    
    return `<Icon${propsString} />`;
  };

  // Example configurations
  const examples = [
    {
      props: {
        name: 'star',
        size: 'medium',
        style: 'solid'
      },
      code: `<Icon name="star" onClick={handleClick} />`
    },
    {
      props: {
        name: 'heart',
        size: 'large',
        variant: 'error'
      },
      code: `<Icon 
  name="heart"
  size="large"
  variant="error"
  onClick={handleClick}
/>`
    },
    {
      props: {
        name: 'check-circle',
        variant: 'success',
        size: 'large'
      },
      code: `<Icon 
  name="check-circle"
  variant="success"
  size="large"
  onClick={handleClick}
/>`
    },
    {
      props: {
        name: 'exclamation-triangle',
        variant: 'warning',
        size: 'medium'
      },
      code: `<Icon 
  name="exclamation-triangle"
  variant="warning"
  onClick={handleClick}
/>`
    },
    {
      props: {
        name: 'info-circle',
        variant: 'info',
        size: 'medium'
      },
      code: `<Icon 
  name="info-circle"
  variant="info"
  onClick={handleClick}
/>`
    },
    {
      props: {
        name: 'user',
        size: 'small',
        variant: 'quiet'
      },
      code: `<Icon 
  name="user"
  size="small"
  variant="quiet"
  onClick={handleClick}
/>`
    },
    {
      props: {
        name: 'github',
        style: 'brands',
        size: 'large'
      },
      code: `<Icon 
  name="github"
  style="brands"
  size="large"
  onClick={handleClick}
/>`
    },
    {
      props: {
        name: 'download',
        variant: 'primary',
        size: 'medium'
      },
      code: `<Icon 
  name="download"
  variant="primary"
  onClick={handleClick}
/>`
    },
    {
      props: {
        name: 'search',
        size: 'small',
        variant: 'secondary'
      },
      code: `<Icon 
  name="search"
  size="small"
  variant="secondary"
  onClick={handleClick}
/>`
    },
    {
      props: {
        name: 'times',
        variant: 'error',
        disabled: true
      },
      code: `<Icon 
  name="times"
  variant="error"
  disabled
  onClick={handleClick}
/>`
    }
  ];

  return (
    <div>
      {/* Font Awesome Link Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <p style={{ 
          margin: '0 0 8px 0', 
          fontSize: '14px', 
          fontWeight: '500',
          color: '#374151'
        }}>
          📖 Browse Font Awesome Free Icons
        </p>
        <a 
          href="https://fontawesome.com/search?p=4&o=r&m=free" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#2563eb',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          fontawesome.com/search?m=free →
        </a>
        <p style={{ 
          margin: '8px 0 0 0', 
          fontSize: '12px', 
          color: '#6b7280'
        }}>
          Find icon names to use in the playground above
        </p>
      </div>

      <ComponentPlayground
        title="Icon Playground"
        description="Customize icon properties and see all variants, sizes, styles, and states. Test different Font Awesome icons with various design system color variants. Click the link above to browse available free icons."
        component={DemoIcon}
        controls={controls}
        examples={examples}
        generateCode={generateCode}
        initialConfig={initialConfig}
      />
    </div>
  );
};

export default IconDemo;