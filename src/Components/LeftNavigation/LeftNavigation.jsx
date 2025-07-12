import React from 'react';
import { MenuItem } from '../MenuItem'; // Use index.js file for cleaner import
import Button from '../Button/Button.jsx'; 
import './LeftNavigation.css';

const LeftNavigation = ({ 
  activeComponent, 
  onComponentChange, 
  isCollapsed, 
  onToggleCollapse, 
  onSettings 
}) => {
  const navItems = [
    { id: 'button', label: 'Button', icon: 'circle' },
    { id: 'icon', label: 'Icon', icon: 'star' }, // Added Icon component
    { id: 'card', label: 'Card', icon: 'file' },
    { id: 'avatar', label: 'Avatar', icon: 'user' },
    { id: 'badge', label: 'Badge', icon: 'tag' },
    { id: 'menu-item', label: 'Menu Item', icon: 'list' },
    { id: 'input', label: 'Input', icon: 'edit' },
    { id: 'checkbox', label: 'Checkbox', icon: 'check-square' },
    { id: 'radio', label: 'Radio', icon: 'dot-circle' },
    { id: 'switch', label: 'Switch', icon: 'toggle-on' },
    { id: 'slider', label: 'Slider', icon: 'sliders' },
    { id: 'typography', label: 'Typography', icon: 'type' },
    { id: 'state-message', label: 'State Message', icon: 'message-circle' },
    { id: 'colors', label: 'Colors - Coming Soon', icon: 'palette', disabled: true }
  ];

  return (
    <nav className={`left-navigation ${isCollapsed ? 'collapsed' : ''}`} data-surface="surface-dim">
      {/* Header with toggle */}
      <div className="nav-header">
        {!isCollapsed && <h2 className="nav-title">Components</h2>}
        <Button
          type="icon-only"
          variant="text"
          size="small"
          leftIcon={isCollapsed ? 'arrow-right' : 'arrow-left'}
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          className="toggle-button"
        />
      </div>

      {/* Navigation Items */}
      <ul className="nav-list">
        {navItems.map(item => (
          <li key={item.id} className="nav-item">
            <MenuItem
              icon={true}
              iconName={item.icon}
              state={activeComponent === item.id ? 'active' : item.disabled ? 'disabled' : 'default'}
              onClick={() => !item.disabled && onComponentChange(item.id)}
              className="nav-menu-item"
              divider={false}
              expandible={false}
              title={isCollapsed ? item.label : undefined}
            >
              {!isCollapsed ? item.label : undefined}
            </MenuItem>
          </li>
        ))}
      </ul>

      {/* Settings Button */}
      <div className="nav-footer">
        <MenuItem
          icon={true}
          iconName="settings"
          onClick={onSettings}
          className="settings-menu-item"
          divider={false}
          expandible={false}
          title={isCollapsed ? 'Settings' : undefined}
        >
          {!isCollapsed ? 'Settings' : undefined}
        </MenuItem>
      </div>
    </nav>
  );
};

export default LeftNavigation;