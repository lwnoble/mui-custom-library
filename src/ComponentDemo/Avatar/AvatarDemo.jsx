import React, { useState } from 'react';
import Avatar from '../../components/Avatar/Avatar.jsx';
import ComponentPlayground from '../ComponentPlayground/ComponentPlayground.jsx';

const AvatarDemo = () => {
  // Initial configuration
  const initialConfig = {
    size: 'm',
    src: '',
    alt: 'User avatar',
    children: '',
    clickable: false,
    disabled: false,
    className: '',
    showInitials: false,
    initials: 'JD',
    showBadge: false,
    badgeType: 'counter',
    badgeState: 'info',
    badgeText: '1',
    badgePosition: 'top-right'
  };

  // Enhanced demo component that handles Avatar-specific logic
  const DemoAvatar = (config) => {
    const handleClick = () => {
      console.log('Avatar clicked!');
    };

    // Determine what to show as children
    const getAvatarChildren = () => {
      if (config.src) {
        return undefined; // Image will show, no need for children
      }
      if (config.showInitials && config.initials) {
        return config.initials.slice(0, 2).toUpperCase();
      }
      if (config.children) {
        return config.children;
      }
      return undefined; // Will show default PersonIcon
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
        <Avatar
          key={`${config.size}-${config.showBadge}-${config.badgeType}-${config.badgeState}-${config.badgeText}-${config.badgePosition}`}
          size={config.size}
          src={config.src || undefined}
          alt={config.alt}
          clickable={config.clickable}
          disabled={config.disabled}
          onClick={config.clickable ? handleClick : undefined}
          className={config.className}
          showBadge={config.showBadge}
          badgeType={config.badgeType}
          badgeState={config.badgeState}
          badgeText={config.badgeText}
          badgePosition={config.badgePosition}
        >
          {getAvatarChildren()}
        </Avatar>
      </div>
    );
  };

  // Controls configuration
  const controls = [
    {
      title: 'Avatar Properties',
      controls: [
        {
          key: 'size',
          label: 'Size',
          type: 'select',
          options: [
            { value: 'xxxs', label: 'XXXS' },
            { value: 'xxs', label: 'XXS' },
            { value: 'xs', label: 'XS' },
            { value: 's', label: 'S' },
            { value: 'm', label: 'M (Default)' },
            { value: 'l', label: 'L' },
            { value: 'xl', label: 'XL' },
            { value: 'xxl', label: 'XXL' }
          ]
        },
        {
          key: 'src',
          label: 'Image URL',
          type: 'text',
          placeholder: 'Enter image URL (optional)'
        },
        {
          key: 'alt',
          label: 'Alt Text',
          type: 'text',
          placeholder: 'Enter alt text for accessibility'
        }
      ]
    },
    {
      title: 'Content',
      toggles: [
        { 
          key: 'showInitials', 
          label: 'Show Initials',
          description: 'Display user initials instead of default icon'
        }
      ],
      controls: [
        {
          key: 'initials',
          label: 'Initials',
          type: 'text',
          placeholder: 'Enter initials (e.g., JD, AB)',
          showWhen: (config) => config.showInitials,
          maxLength: 2
        },
        {
          key: 'children',
          label: 'Custom Content',
          type: 'text',
          placeholder: 'Enter custom content (overrides initials)',
          description: 'Custom text or content to display in avatar'
        }
      ]
    },
    {
      title: 'Badge',
      toggles: [
        { 
          key: 'showBadge', 
          label: 'Show Badge',
          description: 'Display a badge on the avatar'
        }
      ],
      controls: [
        {
          key: 'badgeType',
          label: 'Badge Type',
          type: 'select',
          showWhen: (config) => config.showBadge,
          options: [
            { value: 'counter', label: 'Counter' },
            { value: 'status', label: 'Status' }
          ]
        },
        {
          key: 'badgeState',
          label: 'Badge State',
          type: 'select',
          showWhen: (config) => config.showBadge,
          options: [
            { value: 'info', label: 'Info' },
            { value: 'success', label: 'Success' },
            { value: 'warning', label: 'Warning' },
            { value: 'error', label: 'Error' }
          ]
        },
        {
          key: 'badgeText',
          label: 'Badge Text',
          type: 'text',
          placeholder: 'Enter badge text (e.g., 1, 99+)',
          showWhen: (config) => config.showBadge && config.badgeType === 'counter'
        },
        {
          key: 'badgePosition',
          label: 'Badge Position',
          type: 'select',
          showWhen: (config) => config.showBadge,
          options: [
            { value: 'top-right', label: 'Top Right' },
            { value: 'top-left', label: 'Top Left' },
            { value: 'bottom-right', label: 'Bottom Right' },
            { value: 'bottom-left', label: 'Bottom Left' }
          ]
        }
      ]
    },
    {
      title: 'Behavior & Styling',
      toggles: [
        { key: 'clickable', label: 'Clickable' },
        { 
          key: 'disabled', 
          label: 'Disabled',
          showWhen: (config) => config.clickable
        }
      ],
      controls: [
        {
          key: 'className',
          label: 'Additional CSS Classes',
          type: 'text',
          placeholder: 'Enter additional CSS classes'
        }
      ]
    }
  ];

  // Generate code function
  const generateCode = (config) => {
    const props = [];
    
    // Add size if not default
    if (config.size !== 'm') {
      props.push(`size="${config.size}"`);
    }
    
    // Add src if provided
    if (config.src) {
      props.push(`src="${config.src}"`);
    }
    
    // Add alt if not default
    if (config.alt !== 'User avatar') {
      props.push(`alt="${config.alt}"`);
    }
    
    // Add behavior props
    if (config.clickable) {
      props.push('clickable');
      props.push('onClick={handleClick}');
    }
    
    if (config.disabled && config.clickable) {
      props.push('disabled');
    }
    
    // Add badge props
    if (config.showBadge) {
      props.push('showBadge');
      if (config.badgeType !== 'counter') {
        props.push(`badgeType="${config.badgeType}"`);
      }
      if (config.badgeState !== 'info') {
        props.push(`badgeState="${config.badgeState}"`);
      }
      if (config.badgeType === 'counter' && config.badgeText !== '1') {
        props.push(`badgeText="${config.badgeText}"`);
      }
      if (config.badgePosition !== 'top-right') {
        props.push(`badgePosition="${config.badgePosition}"`);
      }
    }
    
    // Add className if provided
    if (config.className) {
      props.push(`className="${config.className}"`);
    }
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';
    
    // Determine children content
    let children = '';
    if (!config.src) { // Only show children if no image
      if (config.children) {
        children = config.children;
      } else if (config.showInitials && config.initials) {
        children = config.initials.slice(0, 2).toUpperCase();
      }
    }
    
    if (children) {
      return `<Avatar${propsString}>\n  ${children}\n</Avatar>`;
    } else {
      return `<Avatar${propsString} />`;
    }
  };

  // Example configurations
  const examples = [
    {
      props: {
        size: 'm'
      },
      code: `<Avatar />`
    },
    {
      props: {
        size: 'l',
        showInitials: true,
        initials: 'JD'
      },
      code: `<Avatar size="l">
  JD
</Avatar>`
    },
    {
      props: {
        size: 'xl',
        src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      code: `<Avatar 
  size="xl"
  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
/>`
    },
    {
      props: {
        size: 'm',
        clickable: true,
        showInitials: true,
        initials: 'AB'
      },
      code: `<Avatar 
  clickable
  onClick={handleClick}
>
  AB
</Avatar>`
    },
    {
      props: {
        size: 's',
        clickable: true,
        disabled: true,
        showInitials: true,
        initials: 'DU'
      },
      code: `<Avatar 
  size="s"
  clickable
  disabled
  onClick={handleClick}
>
  DU
</Avatar>`
    },
    {
      props: {
        size: 'xs',
        children: '👤'
      },
      code: `<Avatar size="xs">
  👤
</Avatar>`
    },
    {
      props: {
        size: 'xxl',
        src: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face',
        clickable: true
      },
      code: `<Avatar 
  size="xxl"
  src="https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face"
  clickable
  onClick={handleClick}
/>`
    },
    {
      props: {
        size: 'xxxs',
        showInitials: true,
        initials: 'SM'
      },
      code: `<Avatar size="xxxs">
  SM
</Avatar>`
    },
    {
      props: {
        size: 'l',
        showInitials: true,
        initials: 'JD',
        showBadge: true,
        badgeType: 'counter',
        badgeState: 'error',
        badgeText: '5'
      },
      code: `<Avatar 
  size="l"
  showBadge
  badgeState="error"
  badgeText="5"
>
  JD
</Avatar>`
    },
    {
      props: {
        size: 'm',
        src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        showBadge: true,
        badgeType: 'status',
        badgeState: 'success'
      },
      code: `<Avatar 
  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  showBadge
  badgeType="status"
  badgeState="success"
/>`
    },
    {
      props: {
        size: 'xl',
        clickable: true,
        showInitials: true,
        initials: 'MB',
        showBadge: true,
        badgeType: 'counter',
        badgeState: 'warning',
        badgeText: '99+'
      },
      code: `<Avatar 
  size="xl"
  clickable
  onClick={handleClick}
  showBadge
  badgeState="warning"
  badgeText="99+"
>
  MB
</Avatar>`
    },
    {
      props: {
        size: 'l',
        showInitials: true,
        initials: 'TL',
        showBadge: true,
        badgeType: 'status',
        badgeState: 'success',
        badgePosition: 'top-left'
      },
      code: `<Avatar 
  size="l"
  showBadge
  badgeType="status"
  badgeState="success"
  badgePosition="top-left"
>
  TL
</Avatar>`
    },
    {
      props: {
        size: 'l',
        showInitials: true,
        initials: 'BR',
        showBadge: true,
        badgeType: 'counter',
        badgeState: 'error',
        badgeText: '3',
        badgePosition: 'bottom-right'
      },
      code: `<Avatar 
  size="l"
  showBadge
  badgeState="error"
  badgeText="3"
  badgePosition="bottom-right"
>
  BR
</Avatar>`
    },
    {
      props: {
        size: 'l',
        showInitials: true,
        initials: 'BL',
        showBadge: true,
        badgeType: 'status',
        badgeState: 'warning',
        badgePosition: 'bottom-left'
      },
      code: `<Avatar 
  size="l"
  showBadge
  badgeType="status"
  badgeState="warning"
  badgePosition="bottom-left"
>
  BL
</Avatar>`
    }
  ];

  return (
    <ComponentPlayground
      title="Avatar Playground"
      description="Customize avatar properties including size, image source, initials, badges, and interactive behaviors. Test different sizes from XXXS to XXL, add images or initials, configure counter and status badges with 4 position options (top-left, top-right, bottom-left, bottom-right), and set up clickable states."
      component={DemoAvatar}
      controls={controls}
      examples={examples}
      generateCode={generateCode}
      initialConfig={initialConfig}
    />
  );
};

export default AvatarDemo;