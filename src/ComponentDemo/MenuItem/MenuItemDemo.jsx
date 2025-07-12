import React, { useState } from 'react';
import { MenuItem } from '../../components/MenuItem/MenuItem.jsx';
import ComponentPlayground from '../ComponentPlayground/ComponentPlayground.jsx';

const MenuDemo = () => {
  // Initial configuration
  const initialConfig = {
    state: 'default',
    level: 'one',
    alignment: 'left',
    children: 'Menu Item',
    icon: true,
    iconName: 'home',
    checkbox: false,
    divider: true,
    avatar: false,
    expandible: true,
    expandibleState: 'close',
    checkboxChecked: false,
    avatarSrc: '',
    avatarSize: 'xs',
    className: ''
  };

  // Enhanced demo component that handles MenuItem-specific logic
  const DemoMenuItem = (config) => {
    const [checkboxState, setCheckboxState] = useState(config.checkboxChecked);
    const [expandState, setExpandState] = useState(config.expandibleState);

    const handleClick = () => {
      console.log('MenuItem clicked!', config.children);
    };

    const handleCheckboxChange = () => {
      setCheckboxState(!checkboxState);
      console.log('Checkbox toggled:', !checkboxState);
    };

    const handleExpandToggle = () => {
      const newState = expandState === 'open' ? 'close' : 'open';
      setExpandState(newState);
      console.log('Expand toggled:', newState);
    };

    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-start', 
        justifyContent: 'center',
        padding: '40px',
        minHeight: '120px',
        width: '100%',
        maxWidth: '400px',
        background: 'var(--Surface)',
        borderRadius: '8px'
      }}>
        <div style={{ 
          fontSize: '14px', 
          color: '#666', 
          marginBottom: '16px',
          fontWeight: '500'
        }}>
          MenuItem Preview
        </div>
        
        <MenuItem
          state={config.state}
          level={config.level}
          alignment={config.alignment}
          icon={config.icon}
          iconName={config.iconName || 'home'}
          checkbox={config.checkbox}
          divider={config.divider}
          avatar={config.avatar}
          expandible={config.expandible}
          expandibleState={expandState}
          checkboxChecked={config.checkbox ? checkboxState : false}
          avatarSrc={config.avatarSrc || 'https://picsum.photos/32/32?random=1'}
          avatarSize={config.avatarSize}
          className={config.className}
          onClick={config.state !== 'disabled' ? handleClick : undefined}
          onExpandToggle={handleExpandToggle}
        >
          {config.children}
        </MenuItem>
        
        <div style={{ 
          marginTop: '16px',
          fontSize: '12px', 
          color: '#888',
          fontStyle: 'italic'
        }}>
          State: {config.state} | Level: {config.level} | 
          Icon Color: {["hover", "focus", "focus-visible", "active"].includes(config.state) ? "default" : "quiet"} |
          {config.checkbox && ` Checked: ${checkboxState} |`}
          {config.expandible && ` Expanded: ${expandState}`}
        </div>
      </div>
    );
  };

  // Controls configuration
  const controls = [
    {
      title: 'MenuItem Properties',
      controls: [
        {
          key: 'state',
          label: 'State',
          type: 'select',
          options: [
            { value: 'default', label: 'Default' },
            { value: 'hover', label: 'Hover' },
            { value: 'focus', label: 'Focus' },
            { value: 'focus-visible', label: 'Focus Visible' },
            { value: 'active', label: 'Active' },
            { value: 'disabled', label: 'Disabled' }
          ]
        },
        {
          key: 'level',
          label: 'Level',
          type: 'select',
          options: [
            { value: 'one', label: 'Level One' },
            { value: 'two', label: 'Level Two (Indented)' }
          ]
        },
        {
          key: 'alignment',
          label: 'Alignment',
          type: 'select',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' }
          ]
        }
      ]
    },
    {
      title: 'Content',
      controls: [
        {
          key: 'children',
          label: 'Menu Text',
          type: 'text',
          placeholder: 'Enter menu item text'
        },
        {
          key: 'iconName',
          label: 'Icon Name',
          type: 'text',
          showWhen: (config) => config.icon,
          placeholder: 'Enter Font Awesome icon name (e.g., home, user, settings)'
        },
        {
          key: 'avatarSrc',
          label: 'Avatar URL',
          type: 'text',
          showWhen: (config) => config.avatar,
          placeholder: 'Enter avatar image URL'
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
      title: 'Components',
      toggles: [
        { key: 'icon', label: 'Show Icon' },
        { key: 'checkbox', label: 'Show Checkbox' },
        { key: 'avatar', label: 'Show Avatar' },
        { key: 'expandible', label: 'Show Expand Control' },
        { key: 'divider', label: 'Show Divider' }
      ]
    },
    {
      title: 'Component Settings',
      controls: [
        {
          key: 'expandibleState',
          label: 'Expand State',
          type: 'select',
          showWhen: (config) => config.expandible,
          options: [
            { value: 'close', label: 'Closed' },
            { value: 'open', label: 'Open' }
          ]
        },
        {
          key: 'avatarSize',
          label: 'Avatar Size',
          type: 'select',
          showWhen: (config) => config.avatar,
          options: [
            { value: 'xs', label: 'Extra Small' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ]
        }
      ],
      toggles: [
        { 
          key: 'checkboxChecked', 
          label: 'Checkbox Checked',
          showWhen: (config) => config.checkbox
        }
      ]
    }
  ];

  // Generate code function
  const generateCode = (config) => {
    const props = [];
    
    // Add state if not default
    if (config.state !== 'default') {
      props.push(`state="${config.state}"`);
    }
    
    // Add level if not default
    if (config.level !== 'one') {
      props.push(`level="${config.level}"`);
    }
    
    // Add alignment if not default
    if (config.alignment !== 'left') {
      props.push(`alignment="${config.alignment}"`);
    }
    
    // Add icon props
    if (!config.icon) {
      props.push('icon={false}');
    } else if (config.iconName && config.iconName !== 'home') {
      props.push(`iconName="${config.iconName}"`);
    }
    
    // Add component toggles
    if (config.checkbox) props.push('checkbox={true}');
    if (!config.divider) props.push('divider={false}');
    if (config.avatar) props.push('avatar={true}');
    if (!config.expandible) props.push('expandible={false}');
    
    // Add component settings
    if (config.expandible && config.expandibleState !== 'close') {
      props.push(`expandibleState="${config.expandibleState}"`);
    }
    
    if (config.checkbox && config.checkboxChecked) {
      props.push('checkboxChecked={true}');
    }
    
    if (config.avatar) {
      if (config.avatarSrc) {
        props.push(`avatarSrc="${config.avatarSrc}"`);
      }
      if (config.avatarSize !== 'xs') {
        props.push(`avatarSize="${config.avatarSize}"`);
      }
    }
    
    // Add click handler
    if (config.state !== 'disabled') {
      props.push('onClick={handleClick}');
    }
    
    // Add className if provided
    if (config.className) {
      props.push(`className="${config.className}"`);
    }
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';
    
    return `<MenuItem${propsString}>
  ${config.children || 'Menu Item'}
</MenuItem>`;
  };

  // Example configurations
  const examples = [
    {
      props: {
        state: 'default',
        children: 'Dashboard'
      },
      code: `<MenuItem onClick={handleClick}>
  Dashboard
</MenuItem>`
    },
    {
      props: {
        state: 'focus',
        iconName: 'search',
        children: 'Search (Focus State)'
      },
      code: `<MenuItem 
  state="focus"
  iconName="search"
  onClick={handleClick}
>
  Search (Focus State)
</MenuItem>`
    },
    {
      props: {
        state: 'active',
        iconName: 'user',
        children: 'Profile Settings'
      },
      code: `<MenuItem 
  state="active"
  iconName="user"
  onClick={handleClick}
>
  Profile Settings
</MenuItem>`
    },
    {
      props: {
        checkbox: true,
        checkboxChecked: true,
        iconName: 'bell',
        children: 'Notifications'
      },
      code: `<MenuItem 
  checkbox={true}
  checkboxChecked={true}
  iconName="bell"
  onClick={handleClick}
>
  Notifications
</MenuItem>`
    },
    {
      props: {
        avatar: true,
        avatarSize: 'small',
        children: 'John Doe',
        divider: false
      },
      code: `<MenuItem 
  avatar={true}
  avatarSize="small"
  divider={false}
  onClick={handleClick}
>
  John Doe
</MenuItem>`
    },
    {
      props: {
        level: 'two',
        iconName: 'cog',
        children: 'Advanced Settings'
      },
      code: `<MenuItem 
  level="two"
  iconName="cog"
  onClick={handleClick}
>
  Advanced Settings
</MenuItem>`
    },
    {
      props: {
        state: 'disabled',
        iconName: 'lock',
        children: 'Locked Feature'
      },
      code: `<MenuItem 
  state="disabled"
  iconName="lock"
>
  Locked Feature
</MenuItem>`
    },
    {
      props: {
        expandible: true,
        expandibleState: 'open',
        iconName: 'folder',
        children: 'File Management'
      },
      code: `<MenuItem 
  expandible={true}
  expandibleState="open"
  iconName="folder"
  onClick={handleClick}
>
  File Management
</MenuItem>`
    },
    {
      props: {
        alignment: 'center',
        iconName: 'sign-out',
        children: 'Logout',
        divider: false
      },
      code: `<MenuItem 
  alignment="center"
  iconName="sign-out"
  divider={false}
  onClick={handleClick}
>
  Logout
</MenuItem>`
    }
  ];

  return (
    <ComponentPlayground
      title="MenuItem Playground"
      description="Customize MenuItem properties and see different states, levels, and component combinations. MenuItems support icons, avatars, checkboxes, expand controls, and various interaction states. Icons automatically change from quiet (muted) to default (prominent) colors during hover, focus, and active states. Perfect for navigation menus, option lists, and interactive menus."
      component={DemoMenuItem}
      controls={controls}
      examples={examples}
      generateCode={generateCode}
      initialConfig={initialConfig}
    />
  );
};

export default MenuDemo;