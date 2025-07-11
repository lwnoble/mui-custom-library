import React, { useState } from 'react';
import Button from '../../components/Button/Button.jsx';
import Icon from '../../components/Icon/Icon.jsx';
import ComponentPlayground from '../ComponentPlayground/ComponentPlayground.jsx';

const ButtonDemo = () => {
  // Initial configuration
  const initialConfig = {
    variant: 'solid',
    size: 'standard',
    type: 'text-only',
    children: 'Button Text',
    disabled: false,
    fullWidth: false,
    leftIcon: '',
    rightIcon: '',
    className: ''
  };

  // Enhanced demo component that handles Button-specific logic and auto-updates
  const DemoButton = (config) => {
    const handleClick = () => {
      console.log('Button clicked!');
    };

    // Auto-update text content based on type changes
    const getAutoUpdatedContent = () => {
      // If user has entered custom content, use it, otherwise use defaults
      switch (config.type) {
        case 'letter':
          // If children is empty or still default, use 'A', otherwise use first character
          if (!config.children || config.children === 'Button Text' || config.children === '1') {
            return 'A';
          }
          return config.children.charAt(0).toUpperCase();
        case 'number':
          // If children is empty or still default, use '1'
          if (!config.children || config.children === 'Button Text' || config.children === 'A') {
            return '1';
          }
          return config.children;
        case 'icon-only':
          return undefined; // No text content for icon-only
        default:
          // For text-only, left-icon, right-icon
          if (!config.children || config.children === 'A' || config.children === '1') {
            return 'Button Text';
          }
          return config.children;
      }
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
        <Button
          variant={config.variant}
          size={config.size}
          type={config.type}
          fullWidth={config.fullWidth}
          leftIcon={config.leftIcon || (config.type === 'left-icon' ? 'search' : config.type === 'icon-only' ? 'user' : undefined)}
          rightIcon={config.rightIcon || (config.type === 'right-icon' ? 'download' : undefined)}
          disabled={config.disabled}
          onClick={handleClick}
          className={config.className}
        >
          {getAutoUpdatedContent()}
        </Button>
      </div>
    );
  };

  // Controls configuration
  const controls = [
    {
      title: 'Button Properties',
      controls: [
        {
          key: 'variant',
          label: 'Variant',
          type: 'select',
          options: [
            { value: 'solid', label: 'Solid' },
            { value: 'outline', label: 'Outline' },
            { value: 'text', label: 'Text' },
            { value: 'light', label: 'Light' }
          ]
        },
        {
          key: 'size',
          label: 'Size',
          type: 'select',
          options: [
            { value: 'standard', label: 'Standard' },
            { value: 'small', label: 'Small' }
          ]
        },
        {
          key: 'type',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'text-only', label: 'Text Only' },
            { value: 'left-icon', label: 'Left Icon' },
            { value: 'right-icon', label: 'Right Icon' },
            { value: 'icon-only', label: 'Icon Only' },
            { value: 'letter', label: 'Letter' },
            { value: 'number', label: 'Number' }
          ]
        }
      ]
    },
    {
      title: 'Content',
      controls: [
        {
          key: 'children',
          label: 'Button Text',
          type: 'text',
          placeholder: (config) => {
            switch (config.type) {
              case 'letter': return 'Enter single letter (e.g., A, B, C)';
              case 'number': return 'Enter number (e.g., 1, 2, 99)';
              case 'icon-only': return 'Text disabled for icon-only buttons';
              default: return 'Enter button text';
            }
          },
          disabled: (config) => config.type === 'icon-only'
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
      title: 'Icons',
      showWhen: (config) => ['left-icon', 'right-icon', 'icon-only'].includes(config.type),
      controls: [
        {
          key: 'leftIcon',
          label: 'Left Icon Name',
          type: 'text',
          showWhen: (config) => ['left-icon', 'icon-only'].includes(config.type),
          placeholder: 'Enter Font Awesome icon name (e.g., search, user, heart)'
        },
        {
          key: 'rightIcon',
          label: 'Right Icon Name',
          type: 'text',
          showWhen: (config) => config.type === 'right-icon',
          placeholder: 'Enter Font Awesome icon name (e.g., download, arrow-right)'
        }
      ]
    },
    {
      title: 'Layout & States',
      toggles: [
        { key: 'fullWidth', label: 'Full Width' },
        { key: 'disabled', label: 'Disabled' }
      ]
    }
  ];

  // Generate code function
  const generateCode = (config) => {
    const props = [];
    
    // Add variant if not default
    if (config.variant !== 'solid') {
      props.push(`variant="${config.variant}"`);
    }
    
    // Add size if not default
    if (config.size !== 'standard') {
      props.push(`size="${config.size}"`);
    }
    
    // Add type if not default
    if (config.type !== 'text-only') {
      props.push(`type="${config.type}"`);
    }
    
    // Add icons - always show the icon prop in generated code for icon types
    if (config.type === 'left-icon' || config.type === 'icon-only') {
      const iconName = config.leftIcon || (config.type === 'left-icon' ? 'search' : 'user');
      props.push(`leftIcon="${iconName}"`);
    }
    
    if (config.type === 'right-icon') {
      const iconName = config.rightIcon || 'download';
      props.push(`rightIcon="${iconName}"`);
    }
    
    // Add layout and states
    if (config.fullWidth) props.push('fullWidth');
    if (config.disabled) props.push('disabled');
    
    // Add click handler
    props.push('onClick={handleClick}');
    
    // Add className if provided
    if (config.className) {
      props.push(`className="${config.className}"`);
    }
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';
    
    // Determine children based on type
    let children = '';
    switch (config.type) {
      case 'letter':
        children = config.children?.charAt(0)?.toUpperCase() || 'A';
        break;
      case 'number':
        children = config.children || '1';
        break;
      case 'icon-only':
        children = ''; // No children for icon-only
        break;
      default:
        children = config.children || 'Button Text';
        break;
    }
    
    if (children) {
      return `<Button${propsString}>${children}</Button>`;
    } else {
      return `<Button${propsString} />`;
    }
  };

  // Example configurations
  const examples = [
    {
      props: {
        variant: 'solid',
        children: 'Primary Action'
      },
      code: `<Button onClick={handleClick}>
  Primary Action
</Button>`
    },
    {
      props: {
        variant: 'outline',
        size: 'small',
        children: 'Secondary'
      },
      code: `<Button variant="outline" size="small" onClick={handleClick}>
  Secondary
</Button>`
    },
    {
      props: {
        variant: 'solid',
        type: 'left-icon',
        leftIcon: 'search',
        children: 'Search'
      },
      code: `<Button 
  type="left-icon"
  leftIcon="search"
  onClick={handleClick}
>
  Search
</Button>`
    },
    {
      props: {
        variant: 'light',
        type: 'right-icon',
        rightIcon: 'download',
        children: 'Download'
      },
      code: `<Button 
  variant="light"
  type="right-icon"
  rightIcon="download"
  onClick={handleClick}
>
  Download
</Button>`
    },
    {
      props: {
        variant: 'outline',
        type: 'icon-only',
        leftIcon: 'heart'
      },
      code: `<Button 
  variant="outline"
  type="icon-only"
  leftIcon="heart"
  onClick={handleClick}
/>`
    },
    {
      props: {
        variant: 'text',
        children: 'Read More'
      },
      code: `<Button 
  variant="text"
  onClick={handleClick}
>
  Read More
</Button>`
    },
    {
      props: {
        variant: 'solid',
        type: 'letter',
        children: 'B'
      },
      code: `<Button 
  type="letter"
  onClick={handleClick}
>
  B
</Button>`
    },
    {
      props: {
        variant: 'solid',
        fullWidth: true,
        children: 'Sign Up Now'
      },
      code: `<Button fullWidth onClick={handleClick}>
  Sign Up Now
</Button>`
    },
    {
      props: {
        variant: 'outline',
        fullWidth: true,
        type: 'left-icon',
        leftIcon: 'user',
        children: 'Create Account'
      },
      code: `<Button 
  variant="outline"
  type="left-icon"
  leftIcon="user"
  fullWidth
  onClick={handleClick}
>
  Create Account
</Button>`
    },
    {
      props: {
        variant: 'solid',
        disabled: true,
        children: 'Disabled'
      },
      code: `<Button disabled onClick={handleClick}>
  Disabled
</Button>`
    }
  ];

  return (
    <ComponentPlayground
      title="Button Playground"
      description="Customize button properties and see all variants, sizes, types, and states. Test different icons, content, and interactive behaviors. The text variant includes underlined text for hotlinks."
      component={DemoButton}
      controls={controls}
      examples={examples}
      generateCode={generateCode}
      initialConfig={initialConfig}
    />
  );
};

export default ButtonDemo;